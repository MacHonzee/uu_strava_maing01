"use strict";
const { DaoFactory, ObjectNotFound } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../helpers/validation-helper");
const AppClient = require("uu_appg01_server").AppClient;
const Errors = require("../api/errors/trailtour-error.js");
const TrailtourParser = require("../helpers/trailtour-parser-helper");

const WARNINGS = {
  setupUnsupportedKeys: {
    code: `${Errors.Setup.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  trailtourAlreadyUpdated: {
    code: `${Errors.Update.UC_CODE}alreadyUpToDate`,
    message: "Trailtour is already up to date with official results."
  },
  updateConfigUnsupportedKeys: {
    code: `${Errors.UpdateConfig.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  getTourDetailUnsupportedKeys: {
    code: `${Errors.GetTourDetail.UC_CODE}unsupportedKeys`
  },
  getSegmentsUnsupportedKeys: {
    code: `${Errors.GetSegments.UC_CODE}unsupportedKeys`
  },
  downloadGpxUnsupportedKeys: {
    code: `${Errors.DownloadGpx.UC_CODE}unsupportedKeys`
  },
  listAthletesUnsupportedKeys: {
    code: `${Errors.ListAthletes.UC_CODE}unsupportedKeys`
  },
  listAthleteResultsUnsupportedKeys: {
    code: `${Errors.ListAthleteResults.UC_CODE}unsupportedKeys`
  }
};

const APP_ENGINE_CRON_HEADER = "x-appengine-cron";

class TrailtourAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async setup(awid, dtoIn, session) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "setup", dtoIn);

    // HDS 2
    let trailtourList = await TrailtourParser.parseBaseUri(dtoIn.baseUri);

    // HDS 3
    let totalResults = await TrailtourParser.parseTotalResults(dtoIn.totalResultsUri);

    // HDS 4
    let trailtourObj = {
      awid,
      year: dtoIn.year,
      baseUri: dtoIn.baseUri,
      totalResultsUri: dtoIn.totalResultsUri,
      mapConfig: dtoIn.mapConfig,
      lastUpdate: new Date(),
      state: "active",
      totalResults
    };
    try {
      trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);
    } catch (e) {
      if (e instanceof ObjectNotFound) {
        trailtourObj = await this.trailtourDao.create(trailtourObj);
      } else {
        throw e;
      }
    }

    // HDS 5
    let statistics = { clubs: {} };
    let SegmentAbl = require("./segment-abl");
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
      Object.assign(trailtour, tourData);

      let createSegmentDtoIn = {
        stravaId: tourData.stravaId
      };
      let { segment } = await SegmentAbl.create(awid, createSegmentDtoIn, session);
      trailtour.awid = awid;
      trailtour.segmentId = segment.id;
      trailtour.trailtourId = trailtourObj.id;

      try {
        trailtour = await this.trailtourResultsDao.updateBySegmentAndTtId(trailtour);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          trailtour = await this.trailtourResultsDao.create(trailtour);
        } else {
          throw e;
        }
      }

      statistics = this._updateStatistics(statistics, trailtour);
    }

    trailtourObj = await this._saveStatistics(statistics, trailtourObj);

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }

  async update(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "update", dtoIn);

    // HDS 2
    let trailtourObj = await this.trailtourDao.getByYear(awid, dtoIn.year);
    if (!trailtourObj) {
      throw new Errors.Update.TrailtourDoesNotExist({ uuAppErrorMap }, { year: dtoIn.year });
    }
    if (trailtourObj.state !== "active") {
      throw new Errors.Update.TrailtourIsNotActive({ uuAppErrorMap }, { year: dtoIn.year, state: trailtourObj.state });
    }

    // HDS 3
    let totalResults = await TrailtourParser.parseTotalResults(trailtourObj.totalResultsUri);

    // HDS 3.1
    if (!dtoIn.force && trailtourObj.lastUpdate > new Date(totalResults.resultsTimestamp)) {
      let warning = WARNINGS.trailtourAlreadyUpdated;
      let paramMap = {
        lastUpdate: trailtourObj.lastUpdate,
        resultsTimestamp: totalResults.resultsTimestamp
      };
      // we return status 200 because the Cron jobs require status 200 to work correctly
      ValidationHelper.addWarning(uuAppErrorMap, warning.code, warning.message, paramMap);
      return {
        uuAppErrorMap
      };
    }

    // HDS 4
    let trailtourList = await TrailtourParser.parseBaseUri(trailtourObj.baseUri);

    trailtourObj.lastUpdate = new Date();
    trailtourObj.totalResults = totalResults;
    trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);

    // HDS 5
    let statistics = { clubs: {} };
    let promises = trailtourList.map(async (trailtour, i) => {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
      Object.assign(trailtour, tourData);
      trailtour.awid = awid;
      trailtour.trailtourId = trailtourObj.id;

      trailtourList[i] = await this.trailtourResultsDao.updateByStravaAndTtId(trailtour);
      statistics = this._updateStatistics(statistics, trailtourList[i]);
    });
    await Promise.all(promises);

    trailtourObj = await this._saveStatistics(statistics, trailtourObj);

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }

  async updateConfig(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "updateConfig", dtoIn);

    // HDS 2
    let trailtourObj = {
      awid,
      ...dtoIn
    };
    trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);

    // HDS 3
    return {
      trailtourObj,
      uuAppErrorMap
    };
  }

  async get(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "get", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    return {
      ...trailtour,
      uuAppErrorMap
    };
  }

  async getTourDetail(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "getTourDetail", dtoIn);

    // HDS 2
    let tourDetail = await this.trailtourResultsDao.get(awid, dtoIn.id);

    // HDS 3
    let segment = await this.segmentDao.getByStravaId(awid, tourDetail.stravaId);

    // HDS 4
    let trailtour = await this.trailtourDao.get(awid, tourDetail.trailtourId);

    // HDS 4
    return {
      tourDetail,
      segment,
      trailtour,
      uuAppErrorMap
    };
  }

  async listAthleteResults(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "listAthleteResults", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    ["womenResults", "menResults", "clubResults"].forEach(results => {
      trailtour.totalResults[results + "Total"] = trailtour.totalResults[results].length;
      trailtour.totalResults[results] = trailtour.totalResults[results].filter(result =>
        dtoIn.stravaIdList.includes(result.stravaId)
      );
    });

    // HDS 4
    let athleteResults = await this.trailtourResultsDao.listAthleteResults(awid, trailtour.id, dtoIn.stravaIdList);

    // HDS 5
    return {
      trailtour,
      athleteResults,
      uuAppErrorMap
    };
  }

  async getSegments(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "getSegments", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);
    delete trailtour.totalResults;

    // HDS 3
    let tourSegments = await this.trailtourResultsDao.listSegments(awid, trailtour.id);

    // HDS 4
    return {
      trailtour,
      tourSegments,
      uuAppErrorMap
    };
  }

  async downloadGpx(dtoIn) {
    // HDS 1, A1, A2
    ValidationHelper.validate(WARNINGS, Errors, "trailtour", "downloadGpx", dtoIn);

    // HDS 2
    return await AppClient.get(dtoIn.gpxLink);
  }

  async updateAll(awid, authzResult, headers) {
    // HDS 1
    let profiles = authzResult.getAuthorizedProfiles();
    if (
      profiles.length === 0 &&
      !Object.keys(headers).find(header => header.toLowerCase() === APP_ENGINE_CRON_HEADER)
    ) {
      // A1
      throw new Errors.UpdateAll.NotAuthorized({});
    }

    // HDS 2
    let trailtours = await this.trailtourDao.listActive(awid);

    // HDS 3
    let uuAppErrorMap = {};
    for (let trailtour of trailtours.itemList) {
      let dtoOut = await this.update(awid, { year: trailtour.year });
      Object.assign(uuAppErrorMap, dtoOut.uuAppErrorMap);
    }

    return {
      uuAppErrorMap
    };
  }

  async listAthletes(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(WARNINGS, Errors, "trailtour", "listAthletes", dtoIn);

    // HDS 2
    let athletes = await this.trailtourDao.listAthletes(awid, dtoIn.year);

    // HDS 3
    return {
      ...athletes,
      uuAppErrorMap
    };
  }

  _updateStatistics(statistics, trailtour) {
    ["menResults", "womenResults"].forEach(resultKey => {
      let sex = resultKey.replace("Results", "");

      trailtour[resultKey].forEach(result => {
        let stravaId = result.stravaId;
        statistics[stravaId] = statistics[stravaId] || { count: 0 };
        statistics[stravaId].count++;

        if (result.club) {
          statistics.clubs[result.club] = statistics.clubs[result.club] || this._getClubDefault();
          let clubStats = statistics.clubs[result.club];
          clubStats.runners[sex][stravaId] = clubStats.runners[sex][stravaId] || 0;
          clubStats.runners[sex][stravaId] += result.points;
          clubStats.results[sex]++;
        }
      });
    });
    return statistics;
  }

  async _saveStatistics(statistics, trailtourObj) {
    ["menResults", "womenResults"].forEach(resultKey => {
      trailtourObj.totalResults[resultKey].forEach(result => {
        let stravaId = result.stravaId;
        let stats = statistics[stravaId] || { count: 0 };
        result.totalCount = stats.count;
        result.avgPoints = stats.count > 0 ? result.points / result.totalCount : 0;
      });
    });

    trailtourObj.totalResults.clubResults.forEach(result => {
      let club = result.name;
      let stats = statistics.clubs[club] || this._getClubDefault();
      result.resultsMen = stats.results.men;
      result.resultsWomen = stats.results.women;
      result.resultsTotal = stats.results.men + stats.results.women;
      result.runnersMen = Object.keys(stats.runners.men).length;
      result.runnersWomen = Object.keys(stats.runners.women).length;
      result.runnersTotal = result.runnersMen + result.runnersWomen;
      result.pointsMen = Object.values(stats.runners.men).reduce((sum, points) => sum + points, 0.0);
      result.pointsWomen = Object.values(stats.runners.women).reduce((sum, points) => sum + points, 0.0);
      result.avgPoints = result.resultsMen > 0 ? result.pointsMen / result.resultsMen : 0;
      result.avgPointsMen = result.resultsWomen > 0 ? result.pointsWomen / result.resultsWomen : 0;
      result.avgPointsWomen = result.resultsTotal > 0 ? result.points / result.resultsTotal : 0;
    });

    return await this.trailtourDao.updateByYear(trailtourObj);
  }

  _getClubDefault() {
    return { runners: { men: {}, women: {} }, results: { men: 0, women: 0 } };
  }
}

module.exports = new TrailtourAbl();
