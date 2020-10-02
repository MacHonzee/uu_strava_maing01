"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class ListLastRunsAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
  }

  async listLastRuns(awid, dtoIn) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "listLastRuns", dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);
    delete trailtour.totalResults;

    // HDS 3
    let trailtourResults = await this.trailtourResultsDao.listByDateRange(
      awid,
      trailtour.id,
      dtoIn.dateFrom,
      dtoIn.dateTo
    );

    // HDS 4
    return {
      trailtour,
      trailtourResults,
      uuAppErrorMap
    };
  }
}

module.exports = new ListLastRunsAbl();
