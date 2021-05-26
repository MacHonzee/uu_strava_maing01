"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../components/validation-helper");
const { LruCache } = require("uu_appg01_server").Utils;
const Errors = require("../api/errors/athlete-error.js");
const StravaApiHelper = require("../components/strava-api-helper");

const STRAVA_PAGE_SIZE = 200;

class AthleteAbl {
  constructor() {
    this.configDao = DaoFactory.getDao("stravaMain");
    this.athleteDao = DaoFactory.getDao("athlete");
    this.activityDao = DaoFactory.getDao("activity");
    // the cache age should be always lower than token expiration
    this.athleteCache = new LruCache({ maxAge: 1000 * 60 * 30 });
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    let { clientId, clientSecret } = await this.configDao.get(awid);

    let tokenDtoIn = {
      client_id: clientId,
      client_secret: clientSecret,
      code: dtoIn.code,
      grant_type: "authorization_code",
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
      uuAppErrorMap,
    };
  }

  async getValidToken(uri, session) {
    const awid = uri.getAwid();

    // HDS 1
    let uuIdentity = session.getIdentity().getUuIdentity();

    // HDS 2
    let cacheKey = `${awid}_${uuIdentity}`;
    let athlete = this.athleteCache.get(cacheKey);
    if (!athlete) {
      // A1
      athlete = await this.athleteDao.getByUuIdentity(awid, uuIdentity);
      this.athleteCache.set(cacheKey, athlete);
    }

    let token;
    if (athlete) {
      // HDS 3
      let now = new Date();
      let expiration = new Date(athlete.token.expires_at * 1000);
      if (now < expiration) {
        token = athlete.token.access_token;
      } else {
        // HDS 4
        // if the token is expired, we refresh the token
        let { clientId, clientSecret } = await this.configDao.get(awid);

        let tokenDtoIn = {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: athlete.token.refresh_token,
          grant_type: "refresh_token",
        };
        let newToken = await StravaApiHelper.getToken(tokenDtoIn);
        athlete = await this.athleteDao.update({ awid, uuIdentity: athlete.uuIdentity, token: { ...newToken.data } });
        token = newToken.data.access_token;
        this.athleteCache.set(cacheKey, athlete);
      }
    }

    return {
      athlete,
      token,
      uuAppErrorMap: {},
    };
  }

  async exportActivities(uri, dtoIn, session) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    let preparedDtoIn = {};
    if (dtoIn.after) {
      preparedDtoIn.after = new Date(dtoIn.after).getTime() / 1000;
    }

    let uuIdentity = session.getIdentity().getUuIdentity();
    let { token } = await this.getValidToken(awid, session);
    let SegmentAbl = require("./segment-abl");
    let pageIndex = 1;
    let createdSegments = [];
    let myActivities;
    do {
      let athlDtoIn = {
        page: pageIndex,
        per_page: STRAVA_PAGE_SIZE,
        ...preparedDtoIn,
      };
      myActivities = await StravaApiHelper.getLoggedInAthleteActivities(token, athlDtoIn);

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
          let exportDtoIn = { stravaId: segmentId, force: dtoIn.force };
          let newSegment = await SegmentAbl.refreshOne(uri, exportDtoIn, session);
          if (newSegment) createdSegments.push(newSegment);
        }
      }
      pageIndex++;
    } while (myActivities.length === STRAVA_PAGE_SIZE);

    return {
      createdSegments,
      uuAppErrorMap,
    };
  }

  async loadMyself(uri, session) {
    const awid = uri.getAwid();

    let athlete = await this.athleteDao.getByUuIdentity(awid, session.getIdentity().getUuIdentity());
    if (athlete) athlete.token = !!athlete.token;

    return {
      athlete,
      uuAppErrorMap: {},
    };
  }

  async updateNewActivities(uri, session) {
    const awid = uri.getAwid();

    // HDS 1
    let uuIdentity = session.getIdentity().getUuIdentity();
    let lastActivity = await this.activityDao.listLatestByUuIdentity(awid, uuIdentity);
    if (!lastActivity) {
      throw new Errors.UpdateNewActivities.NoLatestActivity({});
    }

    // HDS 2
    let { createdSegments, uuAppErrorMap } = await this.exportActivities(
      awid,
      {
        after: lastActivity.start_date,
        force: true,
      },
      session
    );

    // HDS 3
    return {
      createdSegments,
      uuAppErrorMap,
    };
  }
}

module.exports = new AthleteAbl();
