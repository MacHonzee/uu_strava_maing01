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
      tourData.segmentId = segment.id;

      let tourObj = {
        awid,
        ...tourData
      };
      try {
        tourObj = await this.trailtourResultsDao.updateBySegmentId(tourObj);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          tourObj = await this.trailtourResultsDao.create(tourObj);
        } else {
          throw e;
        }
      }

      if (tourObj.stravaId === 23239869) break;
    }

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }
}

module.exports = new TrailtourAbl();
