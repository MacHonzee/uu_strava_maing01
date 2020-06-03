"use strict";
const TrailtourAbl = require("../../abl/trailtour-abl.js");

class TrailtourController {
  setup(ucEnv) {
    return TrailtourAbl.setup(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return TrailtourAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new TrailtourController();
