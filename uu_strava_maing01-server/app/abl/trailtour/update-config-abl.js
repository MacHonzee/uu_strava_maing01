"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class UpdateConfigAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async updateConfig(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "updateConfig", dtoIn);

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
}

module.exports = new UpdateConfigAbl();
