"use strict";
const StravaMainUseCaseError = require("./strava-main-use-case-error.js");
const SSE_ADAPTER_ERROR_PREFIX = `${StravaMainUseCaseError.ERROR_PREFIX}sseAdapter/`;

const SendEvent = {
  UC_CODE: `${SSE_ADAPTER_ERROR_PREFIX}sendEvent/`,

  NoStreamFound: class extends StravaMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SendEvent.UC_CODE}noStreamFound`;
      this.message = "No stream with given id was found.";
    }
  }
};

module.exports = {
  SendEvent
};
