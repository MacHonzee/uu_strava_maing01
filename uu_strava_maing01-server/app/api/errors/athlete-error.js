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
  UC_CODE: `${ATHLETE_ERROR_PREFIX}exportActivities/`
};

const LoadMyself = {
  UC_CODE: `${ATHLETE_ERROR_PREFIX}loadMyself/`
};

module.exports = {
  LoadMyself,
  ExportActivities,
  Create
};
