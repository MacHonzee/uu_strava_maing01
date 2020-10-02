"use strict";
const ValidationHelper = require("../../helpers/validation-helper");
const AppClient = require("uu_appg01_server").AppClient;
const Warnings = require("../../api/warnings/trailtour-warnings");
const Errors = require("../../api/errors/trailtour-error.js");

class DownloadGpxAbl {
  constructor() {}

  async downloadGpx(dtoIn) {
    // HDS 1, A1, A2
    ValidationHelper.validate(Warnings, Errors, "trailtour", "downloadGpx", dtoIn);

    // HDS 2
    return await AppClient.get(dtoIn.gpxLink);
  }
}

module.exports = new DownloadGpxAbl();
