"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");

class ListAthletesAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
  }

  async listAthletes(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let athletes = await this.trailtourDao.listAthletes(awid, dtoIn.year);

    // HDS 3
    return {
      ...athletes,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAthletesAbl();
