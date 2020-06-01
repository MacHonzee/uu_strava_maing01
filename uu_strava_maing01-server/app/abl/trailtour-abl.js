"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
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

    let trailtourList = await TrailtourParser.parseBaseUri(dtoIn.baseUri);

    let trailtourObj = {
      awid,
      year: dtoIn.year,
      baseUri: dtoIn.baseUri,
      lastUpdate: new Date()
    };
    try {
      trailtourObj = await this.trailtourDao.create(trailtourObj);
    } catch (e) {
      if (e) {
        trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);
      } else {
        throw e;
      }
    }

    let SegmentAbl = require("./segment-abl");
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link);
      Object.assign(trailtour, tourData);

      let createSegmentDtoIn = {
        stravaId: tourData.stravaId
      };
      let { segment } = await SegmentAbl.create(awid, createSegmentDtoIn, session);
      tourData.segmentId = segment.id;

      // TODO dao create / update
      break;
    }

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }
}

module.exports = new TrailtourAbl();
