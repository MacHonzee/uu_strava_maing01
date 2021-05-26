"use strict";
const StravaMainUseCaseError = require("./strava-main-use-case-error.js");

const CalculateElevation = {
  UC_CODE: `${StravaMainUseCaseError.ERROR_PREFIX}calculateElevation/`,

  InvalidGoogleApiResult: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CalculateElevation.UC_CODE}invalidGoogleApiResult`;
      this.message = "Google API did not return OK status.";
    }
  },
};

module.exports = {
  CalculateElevation,
};
