"use strict";
const StravaMainAbl = require("../../abl/strava-main-abl.js");

class StravaMainController {
  updateConfig(ucEnv) {
    return StravaMainAbl.updateConfig(ucEnv.getUri(), ucEnv.getDtoIn());
  }
  init(ucEnv) {
    return StravaMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  loadConfig(ucEnv) {
    return StravaMainAbl.loadConfig(ucEnv.getUri(), ucEnv.getSession());
  }

  redirectToPlus4uNetApi(ucEnv) {
    return StravaMainAbl.redirectToPlus4uNetApi(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new StravaMainController();
