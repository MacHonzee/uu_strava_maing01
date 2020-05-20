"use strict";
const TrailtourAbl = require("../../abl/trailtour-abl.js");

class TrailtourController {
  setup(ucEnv) {
    return TrailtourAbl.setup(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TrailtourController();
