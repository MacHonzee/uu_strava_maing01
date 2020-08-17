"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const SEGMENT_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}segment/`;

const Create = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const RefreshOne = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}refreshOne/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RefreshOne.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const RefreshAll = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}refreshAll/`,

  RefreshOneFailed: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RefreshAll.UC_CODE}refreshOneFailed`;
      this.message = "Refreshing single activity failed.";
    }
  }
};

const List = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const CalculateElevation = {
  UC_CODE: `${SEGMENT_ERROR_PREFIX}calculateElevation/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${CalculateElevation.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

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
  }
};

module.exports = {
  CalculateElevation,
  Create,
  RefreshOne,
  RefreshAll,
  List
};
