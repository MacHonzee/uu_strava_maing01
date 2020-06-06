"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectNotFound } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/trailtour-error.js");
const TrailtourParser = require("../helpers/trailtour-parser-helper");

const WARNINGS = {
  setupUnsupportedKeys: {
    code: `${Errors.Setup.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  getTourDetailUnsupportedKeys: {
    code: `${Errors.GetTourDetail.UC_CODE}unsupportedKeys`
  },
  getAthleteResultsUnsupportedKeys: {
    code: `${Errors.GetAthleteResults.UC_CODE}unsupportedKeys`
  }
};

class TrailtourAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "trailtour-types.js"));
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async setup(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("trailtourSetupDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setupUnsupportedKeys.code,
      Errors.Setup.InvalidDtoIn
    );

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
      lastUpdate: new Date(),
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
    let statistics = {};
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
        trailtour = await this.trailtourResultsDao.updateBySegmentId(trailtour);
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
    // HDS 1
    let validationResult = this.validator.validate("trailtourUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2
    let trailtourObj = await this.trailtourDao.getByYear(awid, dtoIn.year);
    if (!trailtourObj) {
      throw new Errors.Update.TrailtourDoesNotExist({ uuAppErrorMap }, { year: dtoIn.year });
    }

    // HDS 3
    let trailtourList = await TrailtourParser.parseBaseUri(trailtourObj.baseUri);

    // HDS 4
    let totalResults = await TrailtourParser.parseTotalResults(trailtourObj.totalResultsUri);

    trailtourObj.lastUpdate = new Date();
    trailtourObj.totalResults = totalResults;
    trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);

    // HDS 5
    let statistics = {};
    let promises = trailtourList.map(async (trailtour, i) => {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
      Object.assign(trailtour, tourData);
      trailtour.awid = awid;
      trailtour.trailtourId = trailtourObj.id;

      trailtourList[i] = await this.trailtourResultsDao.updateByStravaId(trailtour);
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

  async get(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("trailtourGetDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    return {
      ...trailtour,
      uuAppErrorMap
    };
  }

  async getTourDetail(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("trailtourGetTourDetailDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getTourDetailUnsupportedKeys.code,
      Errors.GetTourDetail.InvalidDtoIn
    );

    // HDS 2
    let tourDetail = await this.trailtourResultsDao.get(awid, dtoIn.id);

    // HDS 3
    let segment = await this.segmentDao.getByStravaId(awid, tourDetail.stravaId);

    // HDS 4
    return {
      tourDetail,
      segment,
      uuAppErrorMap
    };
  }

  async getAthleteResults(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("trailtourGetAthleteResultsDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getAthleteResultsUnsupportedKeys.code,
      Errors.GetAthleteResults.InvalidDtoIn
    );

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    ["womenResults", "menResults", "clubResults"].forEach(results => {
      trailtour.totalResults[results + "Total"] = trailtour.totalResults[results].length;
      trailtour.totalResults[results] = trailtour.totalResults[results].find(
        result => result.stravaId === dtoIn.athleteStravaId
      );
    });

    // HDS 4
    let athleteResults = await this.trailtourResultsDao.listAthleteResults(awid, trailtour.id, dtoIn.athleteStravaId);

    // HDS 5
    return {
      trailtour,
      athleteResults,
      uuAppErrorMap
    };
  }

  _updateStatistics(statistics, trailtour) {
    ["menResults", "womenResults"].forEach(resultKey => {
      trailtour[resultKey].forEach(result => {
        let stravaId = result.stravaId;
        statistics[stravaId] = statistics[stravaId] || { count: 0 };
        statistics[stravaId].count++;
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

    return await this.trailtourDao.updateByYear(trailtourObj);
  }
}

module.exports = new TrailtourAbl();
