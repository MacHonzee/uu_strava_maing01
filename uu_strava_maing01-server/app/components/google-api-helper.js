"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const polyline = require("@mapbox/polyline");
const Errors = require("../api/errors/google-api-error");

const ELEVATION_API_URL = "https://maps.googleapis.com/maps/api/elevation/json";
const MAX_SAMPLES = 500;

const GoogleApiHelper = {
  async calculateElevation(segment, apiKey) {
    // decode path to get number of coordinates
    let path = segment.map.polyline;
    let coords = polyline.decode(path);

    // call google Api for the result
    let samples = Math.min(MAX_SAMPLES, coords.length);
    let dtoIn = { key: apiKey, path: "enc:" + path, samples };
    let dtoOut = await AppClient.get(ELEVATION_API_URL, dtoIn);
    if (dtoOut.data.status !== "OK") {
      throw new Errors.CalculateElevation.InvalidGoogleApiResult({}, { segment, response: dtoOut.data });
    } else {
      return dtoOut.data.results;
    }
  },
};

module.exports = GoogleApiHelper;
