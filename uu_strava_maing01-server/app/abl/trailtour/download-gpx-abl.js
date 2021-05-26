"use strict";
const ValidationHelper = require("../../components/validation-helper");
const AppClient = require("uu_appg01_server").AppClient;

class DownloadGpxAbl {
  async downloadGpx(uri, dtoIn) {
    // HDS 1, A1, A2
    ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    return await AppClient.get(dtoIn.gpxLink);
  }
}

module.exports = new DownloadGpxAbl();
