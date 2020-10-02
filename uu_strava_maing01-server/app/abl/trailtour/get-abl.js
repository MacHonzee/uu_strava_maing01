"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class GetAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
  }

  async get(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "get", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    return {
      ...trailtour,
      uuAppErrorMap
    };
  }
}

module.exports = new GetAbl();
