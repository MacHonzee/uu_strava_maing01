"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");

class GetTourDetailAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async getTourDetail(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let tourDetail = await this.trailtourResultsDao.get(awid, dtoIn.id);
    delete tourDetail.clubResults;

    // HDS 3
    let segment = await this.segmentDao.getByStravaId(awid, tourDetail.stravaId);

    // HDS 4
    let trailtour = await this.trailtourDao.get(awid, tourDetail.trailtourId);
    delete trailtour.totalResults;

    // HDS 4
    return {
      tourDetail,
      segment,
      trailtour,
      uuAppErrorMap,
    };
  }
}

module.exports = new GetTourDetailAbl();
