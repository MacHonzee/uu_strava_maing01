"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const SEGMENT_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}segment/`;

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

module.exports = {
  RefreshOne,
  RefreshAll,
  List
};
