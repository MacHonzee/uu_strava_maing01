"use strict";
const TrailtourAbl = require("../../abl/trailtour-abl.js");
const TrailtourCacheHandler = require("../../helpers/trailtour-cache-handler");

class TrailtourController {
  setup(ucEnv) {
    return TrailtourAbl.setup(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return TrailtourAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updateAll(ucEnv) {
    let request = ucEnv.getRequest();
    return TrailtourAbl.updateAll(ucEnv.getUri().getAwid(), ucEnv.getAuthorizationResult(), request.getHeaders());
  }

  updateConfig(ucEnv) {
    return TrailtourAbl.updateConfig(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return TrailtourAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  getSegments(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return TrailtourAbl.getSegments(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  getAthleteResults(ucEnv) {
    return TrailtourCacheHandler.withTrailtourCache(ucEnv, () => {
      return TrailtourAbl.getAthleteResults(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  getTourDetail(ucEnv) {
    return TrailtourCacheHandler.withTrailtourResultCache(ucEnv, () => {
      return TrailtourAbl.getTourDetail(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
    });
  }

  async downloadGpx(ucEnv) {
    // TODO this is cachable aswell, implement it sometime later
    let dtoIn = ucEnv.getDtoIn();
    let dtoOut = await TrailtourAbl.downloadGpx(dtoIn);
    // set correct filename of response, since the Trailtour links do not have Content-disposition header
    let splits = dtoIn.gpxLink.split("/");
    return ucEnv.setBinaryDtoOut({ data: dtoOut.data, filename: splits[splits.length - 1] });
  }
}

module.exports = new TrailtourController();
