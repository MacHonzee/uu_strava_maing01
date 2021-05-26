"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../../components/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");
const TrailtourParser = require("../../components/trailtour-parser-helper");
const Tools = require("./tools");

class UpdateAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
  }

  async update(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let trailtourObj = await this.trailtourDao.getByYear(awid, dtoIn.year);
    if (!trailtourObj) {
      throw new Errors.Update.TrailtourDoesNotExist({ uuAppErrorMap }, { year: dtoIn.year });
    }
    if (trailtourObj.state !== "active") {
      throw new Errors.Update.TrailtourIsNotActive({ uuAppErrorMap }, { year: dtoIn.year, state: trailtourObj.state });
    }

    // HDS 3
    let totalResults = await TrailtourParser.parseTotalResults(trailtourObj.totalResultsUri);

    // HDS 3.1
    if (!dtoIn.force && trailtourObj.lastUpdate > new Date(totalResults.resultsTimestamp)) {
      let warning = Warnings.trailtourAlreadyUpdated;
      let paramMap = {
        lastUpdate: trailtourObj.lastUpdate,
        resultsTimestamp: totalResults.resultsTimestamp,
      };
      // we return status 200 because the Cron jobs require status 200 to work correctly
      ValidationHelper.addWarning(uuAppErrorMap, warning.code, warning.message, paramMap);
      return {
        uuAppErrorMap,
      };
    }

    // HDS 4
    let trailtourList = await TrailtourParser.parseBaseUri(trailtourObj.baseUri);

    trailtourObj.totalResults = totalResults;
    trailtourObj = await this.trailtourDao.updateByYear(trailtourObj);

    // HDS 5
    let trailtourResultDates = await this._prepareTrailtourResultDates(trailtourObj);

    // HDS 6
    let statistics = { clubs: {} };
    let yesterday = new Date(); // this assumes daily updates and only from previous day
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    yesterday = this._getYesterdayStr(yesterday);

    let promises = trailtourList.map(async (trailtour, i) => {
      let tourData = await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
      Object.assign(trailtour, tourData);
      trailtour.awid = awid;
      trailtour.trailtourId = trailtourObj.id;

      // HDS 6.1
      trailtour = this._updateDatesOfResults(trailtour, trailtourResultDates, yesterday);

      trailtourList[i] = await this.trailtourResultsDao.updateByStravaAndTtId(trailtour);
      statistics = Tools.updateStatistics(statistics, trailtourList[i], yesterday);
    });
    await Promise.all(promises);

    trailtourObj.lastUpdate = new Date();
    trailtourObj = await Tools.saveStatistics(statistics, trailtourObj);

    return {
      trailtourObj,
      trailtourList,
      uuAppErrorMap,
    };
  }

  async _prepareTrailtourResultDates(trailtourObj) {
    let allTrailtours = await this.trailtourResultsDao.listByTrailtour(trailtourObj.awid, trailtourObj.id);

    let dateMap = {};
    allTrailtours.itemList.forEach((trailtour) => {
      dateMap[trailtour.stravaId] = dateMap[trailtour.stravaId] || {};
      ["womenResults", "menResults"].forEach((sexResultsKey) => {
        trailtour[sexResultsKey].forEach((athleteResult) => {
          dateMap[trailtour.stravaId][athleteResult.stravaId] = athleteResult;
        });
      });
    });
    return dateMap;
  }

  _updateDatesOfResults(trailtour, trailtourResultDates, yesterday) {
    ["womenResults", "menResults"].forEach((sexResultsKey) => {
      trailtour[sexResultsKey].forEach((athleteResult, i) => {
        let originalResult = trailtourResultDates[trailtour.stravaId][athleteResult.stravaId];
        // either it was not run at all, or it was run again and the result was improved by getting more points
        if (!originalResult || originalResult.points < athleteResult.points) {
          trailtour[sexResultsKey][i].runDate = yesterday;
          trailtourResultDates[trailtour.stravaId][athleteResult.stravaId] = trailtour[sexResultsKey][i];
        } else {
          trailtour[sexResultsKey][i].runDate = originalResult.runDate;
        }
      });
    });
    return trailtour;
  }

  _padNum(num) {
    return num < 10 ? "0" + num : num;
  }

  _getYesterdayStr(date) {
    return `${date.getFullYear()}-${this._padNum(date.getMonth() + 1)}-${this._padNum(date.getDate())}`;
  }
}

module.exports = new UpdateAbl();
