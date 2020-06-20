"use strict";
const StravaMainUseCaseError = require("./strava-main-use-case-error.js");

const Init = {
  UC_CODE: `${StravaMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  }
};

const UpdateConfig = {
  UC_CODE: `${StravaMainUseCaseError.ERROR_PREFIX}updateConfig/`,

  InvalidDtoIn: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateConfig.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

module.exports = {
  UpdateConfig,
  Init
};
