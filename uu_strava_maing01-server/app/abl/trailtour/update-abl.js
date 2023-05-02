"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const ValidationHelper = require("../../components/validation-helper");
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");
const TrailtourParser = require("../../components/trailtour-parser-helper");
const Tools = require("./tools");
const SegmentAbl = require("../segment-abl");

class UpdateAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.trailtourResultsDao = DaoFactory.getDao("trailtourResults");
    this._logger = LoggerFactory.get("Trailtour.UpdateAbl");
  }

  async update(uri, dtoIn, session) {
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
    let toursInMongo = await this.trailtourResultsDao.listByTrailtour(trailtourObj.awid, trailtourObj.id);

    // HDS 6
    let toursInWeb = await this._parseTourDetails(trailtourList, trailtourObj);

    // HDS 7
    toursInMongo = await this._healChangedSegments(toursInMongo, toursInWeb, uuAppErrorMap, uri, session);

    // HDS 8
    let trailtourResultDates = await this._prepareTrailtourResultDates(toursInMongo);

    // HDS 9
    let statistics = { clubs: {} };
    let yesterday = new Date(); // this assumes daily updates and only from previous day
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    yesterday = this._getYesterdayStr(yesterday);

    let promises = toursInWeb.map(async (trailtour, i) => {
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

  async _prepareTrailtourResultDates(allTrailtours) {
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

  async _parseTourDetails(trailtourList, trailtourObj) {
    let promises = trailtourList.map(async (trailtour) => {
      return await TrailtourParser.parseTourDetail(trailtour.link, trailtourObj.year);
    });
    return await Promise.all(promises);
  }

  // It is common that the configuration on website changes, and they switch from one segment to another.
  // If so, we need to replace the configuration in Mongo aswell
  async _healChangedSegments(toursInMongo, toursInWeb, uuAppErrorMap, uri, session) {
    for (let webTour of toursInWeb) {
      let mongoTour = toursInMongo.itemList.find((tour) => tour.stravaId === webTour.stravaId);
      if (!mongoTour) {
        this._logger.warn(`There is a change in segment with name '${webTour.name}' and stravaId ${webTour.stravaId}.`);

        // we did not find any relevant mongo trailtour by stravaId, fix it by matching the name.
        let replacedMongoTour = toursInMongo.itemList.find((tour) => tour.name === webTour.name);
        if (!replacedMongoTour) {
          throw new Errors.Update.UnableToHealInconsistency({ uuAppErrorMap }, { webTour });
        }

        // and now we switch the information to contain link to new segment
        replacedMongoTour.stravaId = webTour.stravaId;
        let { segment } = await this._createNewSegment(uri, session, webTour.stravaId);
        replacedMongoTour.segmentId = segment.id;
        await this.trailtourResultsDao.update(replacedMongoTour);
      }
    }

    return toursInMongo;
  }

  async _createNewSegment(uri, session, stravaId) {
    let createSegmentUri = UriBuilder.parse(uri).setUseCase("segment/create").toUri();
    return await SegmentAbl.create(createSegmentUri, { stravaId }, session);
  }
}

module.exports = new UpdateAbl();
