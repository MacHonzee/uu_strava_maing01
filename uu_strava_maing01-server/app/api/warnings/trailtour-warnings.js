"use strict";
const Errors = require("../errors/trailtour-error");

const WARNINGS = {
  setupUnsupportedKeys: {
    code: `${Errors.Setup.UC_CODE}unsupportedKeys`
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`
  },
  trailtourAlreadyUpdated: {
    code: `${Errors.Update.UC_CODE}alreadyUpToDate`,
    message: "Trailtour is already up to date with official results."
  },
  updateConfigUnsupportedKeys: {
    code: `${Errors.UpdateConfig.UC_CODE}unsupportedKeys`
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`
  },
  getTourDetailUnsupportedKeys: {
    code: `${Errors.GetTourDetail.UC_CODE}unsupportedKeys`
  },
  getSegmentsUnsupportedKeys: {
    code: `${Errors.GetSegments.UC_CODE}unsupportedKeys`
  },
  downloadGpxUnsupportedKeys: {
    code: `${Errors.DownloadGpx.UC_CODE}unsupportedKeys`
  },
  listAthletesUnsupportedKeys: {
    code: `${Errors.ListAthletes.UC_CODE}unsupportedKeys`
  },
  listAthleteResultsUnsupportedKeys: {
    code: `${Errors.ListAthleteResults.UC_CODE}unsupportedKeys`
  },
  listClubResultsUnsupportedKeys: {
    code: `${Errors.ListClubResults.UC_CODE}unsupportedKeys`
  },
  listLastRunsUnsupportedKeys: {
    code: `${Errors.ListLastRuns.UC_CODE}unsupportedKeys`
  }
};

module.exports = WARNINGS;
