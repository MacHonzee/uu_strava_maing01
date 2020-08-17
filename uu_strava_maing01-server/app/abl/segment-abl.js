"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/segment-error.js");
const StravaApiHelper = require("../helpers/strava-api-helper");
const GoogleApiHelper = require("../helpers/google-api-helper");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  refreshOneUnsupportedKeys: {
    code: `${Errors.RefreshOne.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  calculateElevationUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  },
  segmentAlreadyCalculated: {
    code: `${Errors.CalculateElevation.UC_CODE}segmentAlreadyCalculated`,
    message: `Segment has already calculated elevation data.`
  }
};

class SegmentAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "segment-types.js"));
    this.segmentDao = DaoFactory.getDao("segment");
    this.athlSegDao = DaoFactory.getDao("athleteSegment");
    this.athleteDao = DaoFactory.getDao("athlete");
    this.stravaMainDao = DaoFactory.getDao("stravaMain");
  }

  // this is just a model, it is not on a public API
  async create(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("createDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2
    let segmentId = dtoIn.stravaId;
    let segmentObj = await this.segmentDao.getByStravaId(awid, segmentId);

    // A3
    if (segmentObj && !dtoIn.force) return { segment: segmentObj, uuAppErrorMap };

    // HDS 3
    let AthleteAbl = require("./athlete-abl");
    let { token } = await AthleteAbl.getValidToken(awid, session);

    // HDS 4
    let stravaSegment = await StravaApiHelper.getSegmentById(token, segmentId);

    // HDS 5
    let newSegment;
    if (segmentObj) {
      newSegment = { ...segmentObj };
    } else {
      newSegment = { ...stravaSegment };
      newSegment.awid = awid;
      newSegment.stravaId = stravaSegment.id;
      delete newSegment.id;
      delete newSegment.athlete_segment_stats;
    }

    if (dtoIn.leaderboard) {
      newSegment.leaderboard = dtoIn.leaderboard;
    }

    // HDS 6
    if (segmentObj) {
      segmentObj = await this.segmentDao.updateByStravaId(awid, segmentId, newSegment);
    } else {
      segmentObj = await this.segmentDao.create(newSegment);
    }

    // HDS 7
    return {
      stravaSegment,
      segment: segmentObj,
      uuAppErrorMap
    };
  }

  async refreshOne(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("refreshOneDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.refreshOneUnsupportedKeys.code,
      Errors.RefreshOne.InvalidDtoIn
    );

    // HDS 2
    let segmentId = dtoIn.stravaId;
    let uuIdentity = session.getIdentity().getUuIdentity();
    let athleteSegment = await this.athlSegDao.getByStravaIdAndUuIdentity(awid, segmentId, uuIdentity);
    if (athleteSegment && !dtoIn.force) return { uuAppErrorMap };

    // HDS 3
    let AthleteAbl = require("./athlete-abl");
    let { token, athlete } = await AthleteAbl.getValidToken(awid, session);

    // HDS 4
    let segmentLeaderboard = await StravaApiHelper.getSegmentLeaderboard(token, segmentId, { per_page: 3 });

    // HDS 5
    let segLeaderEntries = segmentLeaderboard.entries.filter(entry => entry.rank <= 3);
    let createSegmentDtoIn = {
      stravaId: segmentId,
      force: true,
      leaderboard: segLeaderEntries
    };
    let { stravaSegment, segment } = await this.create(awid, createSegmentDtoIn, session);

    // HDS 6
    let newAthlSegObj = {
      awid,
      uuIdentity,
      stravaId: segmentId,
      segmentId: segment.id,
      activityType: segment.activity_type,
      athleteSegmentStats: stravaSegment.athlete_segment_stats
    };
    let abbrev = `${athlete.firstname} ${athlete.lastname.charAt(0)}.`;
    newAthlSegObj.ownLeaderboard = segLeaderEntries.find(entry => entry.athlete_name === abbrev);

    // HDS 7
    if (newAthlSegObj.ownLeaderboard) {
      if (athleteSegment) {
        athleteSegment = await this.athlSegDao.updateByStravaIdAndUuId(awid, segmentId, uuIdentity, newAthlSegObj);
      } else {
        athleteSegment = await this.athlSegDao.create(newAthlSegObj);
      }
    }

    // HDS 9
    return {
      segment,
      athleteSegment,
      uuAppErrorMap
    };
  }

  async refreshAll(awid, session) {
    // HDS 1
    let segments = await this.list(awid, {}, session);

    // HDS 2
    for (let segment of segments.itemList) {
      if (segment.ownResult) continue;

      let exportDtoIn = {
        force: true,
        stravaId: segment.stravaId
      };
      try {
        await this.refreshOne(awid, exportDtoIn, session);
      } catch (e) {
        throw new Errors.RefreshAll.RefreshOneFailed({}, { stravaId: segment.stravaId }, e);
      }
    }

    // HDS 3
    return {
      uuAppErrorMap: {}
    };
  }

  async list(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("segmentListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    let uuIdentity = session.getIdentity().getUuIdentity();
    let criteria = {
      ...dtoIn
    };
    delete criteria.pageInfo;
    let pageInfo = dtoIn.pageInfo || {};
    pageInfo.pageSize = pageInfo.pageSize || 2000;
    pageInfo.pageIndex = pageInfo.pageIndex || 0;
    let items = await this.athlSegDao.listOwnByCriteria(awid, criteria, uuIdentity, pageInfo);

    return {
      ...items,
      uuAppErrorMap
    };
  }

  async calculateElevation(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("calculateElevationDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.calculateElevationUnsupportedKeys.code,
      Errors.CalculateElevation.InvalidDtoIn
    );

    // HDS 2
    let stravaConfig = await this.stravaMainDao.get(awid);
    if (!stravaConfig.elevationApiKey) {
      // A3
      throw new Errors.CalculateElevation.MissingGoogleElevationApiKey({ uuAppErrorMap });
    }

    // HDS 3
    let segment = await this.segmentDao.getByStravaId(awid, dtoIn.stravaId);
    if (!segment) {
      // A4
      throw new Errors.CalculateElevation.SegmentNotFound({ uuAppErrorMap }, { stravaId: dtoIn.stravaId });
    }

    // HDS 4
    if (segment.elevationProfile) {
      // A5
      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.segmentAlreadyCalculated.code,
        WARNINGS.segmentAlreadyCalculated.message
      );
    } else {
      // HDS 4.1
      let elevationProfile = await GoogleApiHelper.calculateElevation(segment, stravaConfig.elevationApiKey);

      // HDS 4.2
      segment = await this.segmentDao.updateByStravaId(awid, dtoIn.stravaId, { elevationProfile });
    }

    // HDS 5
    return {
      ...segment,
      uuAppErrorMap
    };
  }
}

module.exports = new SegmentAbl();
