"use strict";
const SegmentAbl = require("../../abl/segment-abl.js");

class SegmentController {

  list(ucEnv) {
    return SegmentAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

}

module.exports = new SegmentController();
