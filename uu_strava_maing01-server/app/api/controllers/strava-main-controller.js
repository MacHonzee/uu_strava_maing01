"use strict";
const StravaMainAbl = require("../../abl/strava-main-abl.js");

class StravaMainController {
  init(ucEnv) {
    return StravaMainAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  loadConfig(ucEnv) {
    return StravaMainAbl.loadConfig(ucEnv.getUri().getAwid(), ucEnv.getSession());
  }
}

module.exports = new StravaMainController();
