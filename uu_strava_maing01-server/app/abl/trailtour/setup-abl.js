"use strict";
const { DaoFactory, ObjectNotFound } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../helpers/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");
const TrailtourParser = require("../../helpers/trailtour-parser-helper");
const Tools = require("./tools");

class SetupAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
  }

  async setup(awid, dtoIn, session) {
    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(Warnings, Errors, "trailtour", "setup", dtoIn);

    // HDS 2
    let trailtourList = await TrailtourParser.parseBaseUri(dtoIn.baseUri);

    // HDS 3
    let totalResults = await TrailtourParser.parseTotalResults(dtoIn.totalResultsUri);

    // HDS 4
    let trailtourObj = {
      awid,
      year: dtoIn.year,
      baseUri: dtoIn.baseUri,
      totalResultsUri: dtoIn.totalResultsUri,
      mapConfig: dtoIn.mapConfig,
      lastUpdate: new Date(),
      state: "active",
      totalResults
    };
    try {
      trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);
    } catch (e) {
      if (e instanceof ObjectNotFound) {
        trailtourObj = await this.trailtourDao.create(trailtourObj);
      } else {
        throw e;
      }
    }

    // HDS 5
    let statistics = { clubs: {} };
    let SegmentAbl = require("../segment-abl");
    for (let trailtour of trailtourList) {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
      Object.assign(trailtour, tourData);

      let createSegmentDtoIn = {
        stravaId: tourData.stravaId
      };
      let { segment } = await SegmentAbl.create(awid, createSegmentDtoIn, session);
      trailtour.awid = awid;
      trailtour.segmentId = segment.id;
      trailtour.trailtourId = trailtourObj.id;

      try {
        trailtour = await this.trailtourResultsDao.updateBySegmentAndTtId(trailtour);
      } catch (e) {
        if (e instanceof ObjectNotFound) {
          trailtour = await this.trailtourResultsDao.create(trailtour);
        } else {
          throw e;
        }
      }

      statistics = Tools.updateStatistics(statistics, trailtour);
    }

    trailtourObj = await Tools.saveStatistics(statistics, trailtourObj);

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap
    };
  }
}

module.exports = new SetupAbl();
