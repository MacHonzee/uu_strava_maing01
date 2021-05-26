"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");

class UpdateConfigAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async updateConfig(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let trailtourObj = {
      awid,
      ...dtoIn,
    };
    trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);

    // HDS 3
    return {
      trailtourObj,
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateConfigAbl();
