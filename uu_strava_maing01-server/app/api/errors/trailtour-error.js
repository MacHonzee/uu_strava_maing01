"use strict";

const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const TRAILTOUR_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}trailtour/`;

const Update = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}update/`,

  TrailtourDoesNotExist: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}trailtourDoesNotExist`;
      this.message = "Trailtour object was not found.";
    }
  },

  TrailtourIsNotActive: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}trailtourIsNotActive`;
      this.message = "Trailtour is not active anymore.";
    }
  },

  UnableToHealInconsistency: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}unableToHealInconsistency`;
      this.message =
        "There is a change in list of Trailtours on website that the application is unable to automatically heal.";
    }
  },
};

const UpdateAll = {
  UC_CODE: `${TRAILTOUR_ERROR_PREFIX}updateAll/`,

  NotAuthorized: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${UpdateAll.UC_CODE}notAuthorized`;
      this.message =
        "You are not authorized for update. You either need to be in Authorities profile, " +
        "or the command has to be called as a Cron Job from Google App Engine.";
    }
  },
};

module.exports = {
  Update,
  UpdateAll,
};
