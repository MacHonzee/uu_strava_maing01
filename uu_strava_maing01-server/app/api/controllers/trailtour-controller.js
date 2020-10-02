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

const TrailtourCacheHandler = require("../../helpers/trailtour-cache-handler");

class TrailtourController {
  setup(ucEnv) {
    return SetupAbl.setup(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updateAll(ucEnv) {
    let request = ucEnv.getRequest();
    return UpdateAllAbl.updateAll(ucEnv.getUri().getAwid(), ucEnv.getAuthorizationResult(), request.getHeaders());
  }

  updateConfig(ucEnv) {
    return UpdateConfigAbl.updateConfig(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  getSegments(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return GetSegmentsAbl.getSegments(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  getTourDetail(ucEnv) {
    return TrailtourCacheHandler.withTrailtourResultCache(ucEnv, () => {
      return GetTourDetailAbl.getTourDetail(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  async downloadGpx(ucEnv) {
    // TODO this is cachable aswell, implement it sometime later
    let dtoIn = ucEnv.getDtoIn();
    let dtoOut = await DownloadGpxAbl.downloadGpx(dtoIn);
    // set correct filename of response, since the Trailtour links do not have Content-disposition header
    let splits = dtoIn.gpxLink.split("/");
    return ucEnv.setBinaryDtoOut({ data: dtoOut.data, filename: splits[splits.length - 1] });
  }

  listAthletes(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListAthletesAbl.listAthletes(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  listAthleteResults(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListAthleteResultsAbl.listAthleteResults(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  listClubResults(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return ListClubResultsAbl.listClubResults(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  listLastRuns(ucEnv) {
    return ListLastRunsAbl.listLastRuns(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TrailtourController();
