"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const TRAILTOUR_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}trailtour/`;

const Setup = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}setup/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Setup.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  Setup
};
