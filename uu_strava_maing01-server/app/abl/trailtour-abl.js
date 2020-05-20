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



  }
}

module.exports = new TrailtourAbl();
