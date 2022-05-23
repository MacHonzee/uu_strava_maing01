"use strict";
const DownloadGpxAbl = require("../../abl/trailtour/download-gpx-abl");
const GetAbl = require("../../abl/trailtour/get-abl");
const GetSegmentsAbl = require("../../abl/trailtour/get-segments-abl");
const GetTourDetailAbl = require("../../abl/trailtour/get-tour-detail-abl");
const ListAthleteResultsAbl = require("../../abl/trailtour/list-athlete-results-abl");
const ListAthletesAbl = require("../../abl/trailtour/list-athletes-abl");
const ListClubResultsAbl = require("../../abl/trailtour/list-club-results-abl");
const ListLastRunsAbl = require("../../abl/trailtour/list-last-runs-abl");
const SetupAbl = require("../../abl/trailtour/setup-abl");
const UpdateAbl = require("../../abl/trailtour/update-abl");
const UpdateAllAbl = require("../../abl/trailtour/update-all-abl");
const UpdateConfigAbl = require("../../abl/trailtour/update-config-abl");

const TrailtourCacheHandler = require("../../components/trailtour-cache-handler");

class TrailtourController {
  setup(ucEnv) {
    return SetupAbl.setup(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  updateAll(ucEnv) {
    let request = ucEnv.getRequest();
    return UpdateAllAbl.updateAll(ucEnv.getUri(), ucEnv.getAuthorizationResult(), request.getHeaders());
  }

  updateConfig(ucEnv) {
    return UpdateConfigAbl.updateConfig(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return GetAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  getSegments(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return GetSegmentsAbl.getSegments(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  getTourDetail(ucEnv) {
    return TrailtourCacheHandler.withTrailtourResultCache(ucEnv, () => {
      return GetTourDetailAbl.getTourDetail(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  async downloadGpx(ucEnv) {
    // TODO this is cachable aswell, implement it sometime later
    let dtoIn = ucEnv.getDtoIn();
    let dtoOut = await DownloadGpxAbl.downloadGpx(ucEnv.getUri(), dtoIn);
    // set correct filename of response, since the Trailtour links do not have Content-disposition header
    let splits = dtoIn.gpxLink.split("/");
    return ucEnv.setBinaryDtoOut({ data: dtoOut.data, filename: splits[splits.length - 1] });
  }

  listAthletes(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListAthletesAbl.listAthletes(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  listAthleteResults(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListAthleteResultsAbl.listAthleteResults(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  listClubResults(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListClubResultsAbl.listClubResults(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }

  listLastRuns(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListLastRunsAbl.listLastRuns(ucEnv.getUri(), ucEnv.getDtoIn());
    });
  }
}

module.exports = new TrailtourController();
