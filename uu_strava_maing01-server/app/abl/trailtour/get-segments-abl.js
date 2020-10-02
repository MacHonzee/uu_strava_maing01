"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class GetSegmentsAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
  }

  async getSegments(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "getSegments", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);
    delete trailtour.totalResults;

    // HDS 3
    let tourSegments = await this.trailtourResultsDao.listSegments(awid, trailtour.id);

    // HDS 4
    return {
      trailtour,
      tourSegments,
      uuAppErrorMap
    };
  }
}

module.exports = new GetSegmentsAbl();
