"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const SEGMENT_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}segment/`;

const RefreshAll = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}refreshAll/`,

  RefreshOneFailed: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RefreshAll.UC_CODE}refreshOneFailed`;
      this.message = "Refreshing single activity failed.";
    }
  },
};

const CalculateElevation = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}calculateElevation/`,

  MissingGoogleElevationApiKey: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CalculateElevation.UC_CODE}missingGoogleElevationApiKey`;
      this.message = "Google API Key for Elevation is missing in configuration.";
    }
  },

  SegmentNotFound: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CalculateElevation.UC_CODE}SegmentNotFound`;
      this.message = "Segment was not found.";
    }
  },
};

module.exports = {
  CalculateElevation,
  RefreshAll,
};
