"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const SEGMENT_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}segment/`;

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
  List
};
