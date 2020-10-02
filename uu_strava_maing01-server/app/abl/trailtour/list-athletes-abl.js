"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class ListAthletesAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
  }

  async listAthletes(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "listAthletes", dtoIn);

    // HDS 2
    let athletes = await this.trailtourDao.listAthletes(awid, dtoIn.year);

    // HDS 3
    return {
      ...athletes,
      uuAppErrorMap
    };
  }
}

module.exports = new ListAthletesAbl();
