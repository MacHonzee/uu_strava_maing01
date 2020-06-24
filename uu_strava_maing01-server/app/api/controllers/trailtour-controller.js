"use strict";
const TrailtourAbl = require("../../abl/trailtour-abl.js");

class TrailtourController {
  setup(ucEnv) {
    return TrailtourAbl.setup(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return TrailtourAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  updateConfig(ucEnv) {
    return TrailtourAbl.updateConfig(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return TrailtourAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  getSegments(ucEnv) {
    return TrailtourAbl.getSegments(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  getAthleteResults(ucEnv) {
    return TrailtourAbl.getAthleteResults(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  getTourDetail(ucEnv) {
    return TrailtourAbl.getTourDetail(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TrailtourController();
