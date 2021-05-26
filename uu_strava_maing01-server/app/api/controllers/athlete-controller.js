"use strict";
const AthleteAbl = require("../../abl/athlete-abl.js");

class AthleteController {
  create(ucEnv) {
    return AthleteAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  exportActivities(ucEnv) {
    return AthleteAbl.exportActivities(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  loadMyself(ucEnv) {
    return AthleteAbl.loadMyself(ucEnv.getUri(), ucEnv.getSession());
  }

  updateNewActivities(ucEnv) {
    return AthleteAbl.updateNewActivities(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new AthleteController();
