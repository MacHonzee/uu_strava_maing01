"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
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
    let existingSegmentObject = await this.segmentDao.getByStravaId(awid, segmentId);
    if (existingSegmentObject && !dtoIn.force) return { uuAppErrorMap };

    // HDS 3
    let token = dtoIn.token || (await require("./athlete-abl").getValidToken(awid, session)).token;

    // HDS 4
    let uuIdentity = session.getIdentity().getUuIdentity();
    let segmentDetail = await StravaApiHelper.getSegmentById(token, segmentId);
    let newSegment = { ...segmentDetail };
    newSegment.awid = awid;
    newSegment.uuIdentity = uuIdentity;
    newSegment.stravaId = segmentDetail.id;
    delete newSegment.id;

    // HDS 5
    let athlete = dtoIn.athlete || (await this.athleteDao.getByUuIdentity(awid, uuIdentity));

    // HDS 6
    let segmentLeaderboard = await StravaApiHelper.getSegmentLeaderboard(token, segmentId, { per_page: 1 });
    let abbrev = `${athlete.firstname} ${athlete.lastname.charAt(0)}.`;
    // beware, it might not return anything in case of private non-tracked activities
    newSegment.leaderboard = segmentLeaderboard.entries.find(entry => entry.athlete_name === abbrev);

    // HDS 7
    if (existingSegmentObject) {
      newSegment = await this.segmentDao.updateByStravaId(awid, segmentDetail.id, newSegment);
    } else {
      newSegment = await this.segmentDao.create(newSegment);
    }

    return {
      ...newSegment,
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
