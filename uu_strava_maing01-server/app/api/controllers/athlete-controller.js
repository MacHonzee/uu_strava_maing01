"use strict";
const AthleteAbl = require("../../abl/athlete-abl.js");

class AthleteController {
  create(ucEnv) {
    return AthleteAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  exportActivities(ucEnv) {
    return AthleteAbl.exportActivities(ucEnv.getUri().getAwid(), ucEnv.getSession());
  }

  loadMyself(ucEnv) {
    return AthleteAbl.loadMyself(ucEnv.getUri().getAwid(), ucEnv.getSession());
  }

}

module.exports = new AthleteController();
