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

const Update = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TrailtourDoesNotExist: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}trailtourDoesNotExist`;
      this.message = "Trailtour object was not found.";
    }
  }
};

const Get = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const GetTourDetail = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}getTourDetail/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetTourDetail.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const GetAthleteResults = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}getAthleteResults/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetAthleteResults.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const GetSegments = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}getSegments/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${GetSegments.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  GetSegments,
  GetAthleteResults,
  GetTourDetail,
  Get,
  Setup,
  Update
};
