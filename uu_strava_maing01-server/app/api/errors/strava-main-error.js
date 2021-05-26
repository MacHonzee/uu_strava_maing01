"use strict";
const StravaMainUseCaseError = require("./strava-main-use-case-error.js");

const Init = {
  UC_CODE: `${StravaMainUseCaseError.ERROR_PREFIX}init/`,

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
  },
};

module.exports = {
  Init,
};
