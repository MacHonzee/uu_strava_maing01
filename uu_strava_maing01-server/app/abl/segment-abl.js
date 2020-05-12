"use strict";
const Path = require("path");
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/segment-error.js");
const StravaApiHelper = require("../helpers/strava-api-helper");

const WARNINGS = {
  refreshOneUnsupportedKeys: {
    code: `${Errors.RefreshOne.UC_CODE}unsupportedKeys`
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};

class SegmentAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "segment-types.js"));
    this.segmentDao = DaoFactory.getDao("segment");
    this.athlSegDao = DaoFactory.getDao("athleteSegment");
    this.athleteDao = DaoFactory.getDao("athlete");
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
    let athlSegObj = await this.athlSegDao.getByStravaIdAndUuIdentity(awid, segmentId, uuIdentity);
    if (athlSegObj && !dtoIn.force) return {uuAppErrorMap};

    // HDS 3
    let token = dtoIn.token || (await require("./athlete-abl").getValidToken(awid, session)).token;

    // HDS 4
    let segmentDetail = await StravaApiHelper.getSegmentById(token, segmentId);

    // HDS 5
    let athlete = dtoIn.athlete || (await this.athleteDao.getByUuIdentity(awid, uuIdentity));

    // HDS 6
    let segmentLeaderboard = await StravaApiHelper.getSegmentLeaderboard(token, segmentId, {per_page: 3});

    // HDS 7
    let segmentObj = await this.segmentDao.getByStravaId(awid, segmentId);
    let newSegment;
    if (segmentObj) {
      newSegment = {...segmentObj};
    } else {
      newSegment = {...segmentDetail};
      newSegment.awid = awid;
      newSegment.stravaId = segmentDetail.id;
      delete newSegment.id;
      delete newSegment.athlete_segment_stats;
    }

    let segLeaderEntries = segmentLeaderboard.entries;
    newSegment.firstLeaderboard = segLeaderEntries.find(entry => entry.rank === 1);
    newSegment.secondLeaderboard = segLeaderEntries.find(entry => entry.rank === 2);
    newSegment.thirdLeaderboard = segLeaderEntries.find(entry => entry.rank === 3);

    if (segmentObj) {
      segmentObj = await this.segmentDao.updateByStravaId(awid, segmentId, newSegment);
    } else {
      segmentObj = await this.segmentDao.create(newSegment);
    }

    // HDS 8
    let newAthlSegObj = {
      awid,
      uuIdentity,
      stravaId: segmentId,
      athleteSegmentStats: segmentDetail.athlete_segment_stats
    };
    let abbrev = `${athlete.firstname} ${athlete.lastname.charAt(0)}.`;
    newAthlSegObj.ownLeaderboard = segLeaderEntries.find(entry => entry.athlete_name === abbrev);

    // HDS 9
    if (athlSegObj) {
      athlSegObj = await this.athlSegDao.updateByStravaIdAndUuIdentity(awid, segmentDetail.id, uuIdentity, newAthlSegObj);
    } else {
      athlSegObj = await this.athlSegDao.create(newAthlSegObj);
    }

    // HDS 9
    return {
      segment: segmentObj,
      athleteSegment: athlSegObj,
      uuAppErrorMap
    };
  }

  async refreshAll(awid, session) {
    // HDS 1
    let segments = await this.list(awid, {}, session);

    // HDS 2
    let uuIdentity = session.getIdentity().getUuIdentity();
    let athlete = await this.athleteDao.getByUuIdentity(awid, uuIdentity);

    // HDS 3
    let token = (await require("./athlete-abl").getValidToken(awid, session)).token;

    // HDS 2
    for (let segment of segments.itemList) {
      // FIXME probably will be of a different key
      if (segment.ownLeaderboard) continue;

      let exportDtoIn = {
        athlete,
        token,
        force: true,
        stravaId: segment.stravaId
      };
      try {
        await this.refreshOne(awid, exportDtoIn, session);
      } catch (e) {
        throw new Errors.RefreshAll.RefreshOneFailed({}, {stravaId: segment.stravaId}, e);
      }
    }

    // HDS 3
    return {
      uuAppErrorMap: {}
    };
  }

  async list(awid, dtoIn, session) {
    // FIXME needs lookup to get own leaderboard

    // HDS 1
    let validationResult = this.validator.validate("segmentListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    let criteria = {
      uuIdentity: session.getIdentity().getUuIdentity(),
      ...dtoIn
    };
    delete criteria.pageInfo;
    let pageInfo = dtoIn.pageInfo || {};
    pageInfo.pageSize = pageInfo.pageSize || 2000;
    pageInfo.pageIndex = pageInfo.pageIndex || 0;
    let items = await this.segmentDao.listByCriteria(awid, criteria, pageInfo);

    return {
      ...items,
      uuAppErrorMap
    };
  }
}

module.exports = new SegmentAbl();
