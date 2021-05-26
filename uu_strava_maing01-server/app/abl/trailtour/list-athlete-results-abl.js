"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");

class ListAthleteResultsAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
  }

  async listAthleteResults(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let trailtour = await this.trailtourDao.getByYear(awid, dtoIn.year);

    // HDS 3
    ["womenResults", "menResults", "clubResults"].forEach((results) => {
      trailtour.totalResults[results + "Total"] = trailtour.totalResults[results].length;
      trailtour.totalResults[results] = trailtour.totalResults[results].filter((result) =>
        dtoIn.stravaIdList.includes(result.stravaId)
      );
    });

    // HDS 4
    let athleteResults = await this.trailtourResultsDao.listAthleteResults(awid, trailtour.id, dtoIn.stravaIdList);

    // HDS 5
    return {
      trailtour,
      athleteResults,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAthleteResultsAbl();
