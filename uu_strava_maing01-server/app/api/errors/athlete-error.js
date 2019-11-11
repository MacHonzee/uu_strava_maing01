"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const ATHLETE_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}athlete/`;

const Create = {
  UC_CODE: `${ATHLETE_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const ExportActivities = {
  UC_CODE: `${ATHLETE_ERROR_PREFIX}exportActivities/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${ExportActivities.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const UpdateNewActivities = {
  UC_CODE: `${ATHLETE_ERROR_PREFIX}updateNewActivities/`,

  NoLatestActivity: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateNewActivities.UC_CODE}noLatestActivity`;
      this.message = "There is no latest activity yet, export all first.";
    }
  }
};

module.exports = {
  Create,
  ExportActivities,
  UpdateNewActivities
};
