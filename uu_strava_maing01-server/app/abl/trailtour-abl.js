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

    // TODO dao create / update

    let SegmentAbl = require("./segment-abl");
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link);
      Object.assign(trailtour, tourData);

      let refreshDtoIn = {
        stravaId: tourData.stravaId,
        force: true
        // TODO no leaderboard optimization
      };
      let { segment } = await SegmentAbl.refreshOne(awid, refreshDtoIn, session);
      tourData.segmentId = segment.id;

      // TODO dao create / update
      break;
    }

    return {
      trailtourList,
      uuAppErrorMap
    };
  }
}

module.exports = new TrailtourAbl();
