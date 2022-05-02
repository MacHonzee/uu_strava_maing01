"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const polyline = require("@mapbox/polyline");
const Errors = require("../api/errors/google-api-error");

const ELEVATION_API_URL = "https://maps.googleapis.com/maps/api/elevation/json";
const MAX_SAMPLES = 250;

const GoogleApiHelper = {
  async calculateElevation(segment, apiKey) {
    // decode path to get number of coordinates
    let path = segment.map.polyline;
    let coords = polyline.decode(path);

    // slice it by MAX_SAMPLES (there is a limit to Google API) and merge the results together
    let allResults = [];
    for (let i = 0; i <= Math.floor(coords.length / MAX_SAMPLES); i++) {
      // build correct dtoIn
      let slicedCoords = coords.slice(i * MAX_SAMPLES, (i + 1) * MAX_SAMPLES);
      let samples = Math.min(MAX_SAMPLES, slicedCoords.length);
      let dtoIn = { key: apiKey, path: slicedCoords.join("|"), samples };

      let dtoOut = await AppClient.get(ELEVATION_API_URL, dtoIn);
      if (dtoOut.data.status !== "OK") {
        throw new Errors.CalculateElevation.InvalidGoogleApiResult({}, { segment, response: dtoOut.data });
      } else {
        allResults = allResults.concat(dtoOut.data.results);
      }
    }

    return allResults;
  },
};

module.exports = GoogleApiHelper;
