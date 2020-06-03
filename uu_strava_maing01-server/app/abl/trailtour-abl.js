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
  }
};

class TrailtourAbl {
  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "trailtour-types.js"));
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
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
    let SegmentAbl = require("./segment-abl");
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link);
      Object.assign(trailtour, tourData);

      let createSegmentDtoIn = {
        stravaId: tourData.stravaId
      };
      let { segment } = await SegmentAbl.create(awid, createSegmentDtoIn, session);
      trailtour.awid = awid;
      trailtour.segmentId = segment.id;

      try {
        trailtour = await this.trailtourResultsDao.updateBySegmentId(trailtour);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          trailtour = await this.trailtourResultsDao.create(trailtour);
        } else {
          throw e;
        }
      }
    }

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
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link);
      Object.assign(trailtour, tourData);
      trailtour.awid = awid;

      trailtour = await this.trailtourResultsDao.updateByStravaId(trailtour);
    }

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }
}

module.exports = new TrailtourAbl();
