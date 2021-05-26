"use strict";
const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const ATHLETE_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}athlete/`;

const UpdateNewActivities = {
  UC_CODE: `${ATHLETE_ERROR_PREFIX}updateNewActivities/`,

  NoLatestActivity: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateNewActivities.UC_CODE}noLatestActivity`;
      this.message = "There is no latest activity yet, export all first.";
    }
  },
};

module.exports = {
  UpdateNewActivities,
};
