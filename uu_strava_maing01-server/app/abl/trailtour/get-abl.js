"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");

class GetAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    return {
      ...trailtour,
      uuAppErrorMap,
    };
  }
}

module.exports = new GetAbl();
