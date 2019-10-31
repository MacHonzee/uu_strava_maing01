"use strict";
const StravaMainAbl = require("../../abl/strava-main-abl.js");

class StravaMainController {
  init(ucEnv) {
    return StravaMainAbl.init(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new StravaMainController();
