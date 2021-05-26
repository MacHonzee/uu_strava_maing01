"use strict";
const SegmentAbl = require("../../abl/segment-abl.js");

class SegmentController {
  refreshAll(ucEnv) {
    return SegmentAbl.refreshAll(ucEnv.getUri(), ucEnv.getSession());
  }
  refreshOne(ucEnv) {
    return SegmentAbl.refreshOne(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  list(ucEnv) {
    return SegmentAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  calculateElevation(ucEnv) {
    return SegmentAbl.calculateElevation(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new SegmentController();
