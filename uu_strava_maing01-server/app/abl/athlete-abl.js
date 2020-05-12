"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/athlete-error.js");
const StravaApiHelper = require("../helpers/strava-api-helper");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`
  },
  exportActivitiesUnsupportedKeys: {
    code: `${Errors.ExportActivities.UC_CODE}unsupportedKeys`
  }
};

const STRAVA_PAGE_SIZE = 200;

class AthleteAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "athlete-types.js"));
    this.configDao = DaoFactory.getDao("stravaMain");
    this.athleteDao = DaoFactory.getDao("athlete");
    this.activityDao = DaoFactory.getDao("activity");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async create(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("athleteCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    let { clientId, clientSecret } = await this.configDao.get(awid);

    let tokenDtoIn = {
      client_id: clientId,
      client_secret: clientSecret,
      code: dtoIn.code,
      grant_type: "authorization_code"
    };
    let token = await StravaApiHelper.getToken(tokenDtoIn);

    let loggedInAthlete = await StravaApiHelper.getLoggedInAthlete(token.access_token);
    let athleteObject = { ...loggedInAthlete };
    athleteObject.awid = awid;
    athleteObject.stravaId = loggedInAthlete.id;
    athleteObject.token = token;
    athleteObject.uuIdentity = session.getIdentity().getUuIdentity();
    delete athleteObject.id;
    delete athleteObject.token.athlete;

    try {
      athleteObject = await this.athleteDao.create(athleteObject);
    } catch (e) {
      if (e.code === "uu-app-objectstore/duplicateKey") {
        athleteObject = await this.athleteDao.update(athleteObject);
      } else {
        throw e;
      }
    }

    return {
      athleteObject,
      uuAppErrorMap
    };
  }

  async getValidToken(awid, session) {
    let uuIdentity = session.getIdentity().getUuIdentity();
    let athlete = await this.athleteDao.getByUuIdentity(awid, uuIdentity);
    let token;
    if (athlete) {
      let now = new Date();
      let expiration = new Date(athlete.token.expires_at * 1000);
      if (now < expiration) {
        token = athlete.token.access_token;
      } else {
        // if the token is expired, we refresh the token
        let { clientId, clientSecret } = await this.configDao.get(awid);

        let tokenDtoIn = {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: athlete.token.refresh_token,
          grant_type: "refresh_token"
        };
        let newToken = await StravaApiHelper.getToken(tokenDtoIn);
        await this.athleteDao.update({ awid, uuIdentity: athlete.uuIdentity, token: { ...newToken.data } });
        token = newToken.data.access_token;
      }
    }

    return {
      token,
      uuAppErrorMap: {}
    };
  }

  async exportActivities(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("exportActivitiesDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.exportActivitiesUnsupportedKeys.code,
      Errors.ExportActivities.InvalidDtoIn
    );

    let preparedDtoIn = {};
    if (dtoIn.after) {
      preparedDtoIn.after = (new Date(dtoIn.after).getTime()) / 1000;
    }

    let uuIdentity = session.getIdentity().getUuIdentity();
    let athleteToken = await this.getValidToken(awid, session);
    let SegmentAbl = require("./segment-abl");
    let token = athleteToken.token;
    let pageIndex = 1;
    let createdSegments = [];
    while (true) {
      let athlDtoIn = {
        page: pageIndex,
        per_page: STRAVA_PAGE_SIZE,
        ...preparedDtoIn
      };
      let myActivities = await StravaApiHelper.getLoggedInAthleteActivities(token, athlDtoIn);

      for (let activity of myActivities) {
        let existingActivityObject = await this.activityDao.getByStravaId(awid, activity.id);
        if (existingActivityObject) continue;

        let activityDtoIn = { include_all_efforts: true };
        let activityDetail = await StravaApiHelper.getActivityById(token, activity.id, activityDtoIn);
        let newUuObject = { ...activityDetail };
        newUuObject.awid = awid;
        newUuObject.uuIdentity = uuIdentity;
        newUuObject.stravaId = activityDetail.id;
        newUuObject.start_date = new Date(activityDetail.start_date);
        delete newUuObject.id;
        delete newUuObject.segment_efforts;
        await this.activityDao.create(newUuObject);

        for (let segmentEffort of activityDetail.segment_efforts) {
          if (segmentEffort.segment.hazardous) continue;
          let segmentId = segmentEffort.segment.id;
          let exportDtoIn = { stravaId: segmentId, force: dtoIn.force, token };
          let newSegment = await SegmentAbl.refreshOne(awid, exportDtoIn, session);
          if (newSegment) createdSegments.push(newSegment);
        }
      }

      if (myActivities.length === STRAVA_PAGE_SIZE) {
        pageIndex++;
      } else {
        break;
      }
    }

    return {
      createdSegments,
      uuAppErrorMap
    };
  }

  async loadMyself(awid, session) {
    let athlete = await this.athleteDao.getByUuIdentity(awid, session.getIdentity().getUuIdentity());
    delete athlete.token;

    return {
      ...athlete,
      uuAppErrorMap: {}
    };
  }

  async updateNewActivities(awid, session) {
    // HDS 1
    let uuIdentity = session.getIdentity().getUuIdentity();
    let lastActivity = await this.activityDao.listLatestByUuIdentity(awid, uuIdentity);
    if (!lastActivity) {
      throw new Errors.UpdateNewActivities.NoLatestActivity({});
    }

    // HDS 2
    let { createdSegments, uuAppErrorMap } = await this.exportActivities(awid, { after: lastActivity.start_date, force: true }, session);

    // HDS 3
    return {
      createdSegments,
      uuAppErrorMap
    };
  }
}

module.exports = new AthleteAbl();
