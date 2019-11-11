"use strict";
const SegmentAbl = require("../../abl/segment-abl.js");

class SegmentController {
  refreshAll(ucEnv) {
    return SegmentAbl.refreshAll(ucEnv.getUri().getAwid(), ucEnv.getSession());
  }

  refreshOne(ucEnv) {
    return SegmentAbl.refreshOne(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  list(ucEnv) {
    return SegmentAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new SegmentController();
