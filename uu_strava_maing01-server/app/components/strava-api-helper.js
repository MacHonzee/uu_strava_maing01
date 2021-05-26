"use strict";
const AppClient = require("uu_appg01_server").AppClient;

const STRAVA_API = {
  getToken: "https://www.strava.com/oauth/token",
  athlete: "https://www.strava.com/api/v3/athlete",
  athleteActivities: "https://www.strava.com/api/v3/athlete/activities",
  activity: "https://www.strava.com/api/v3/activities",
  segment: "https://www.strava.com/api/v3/segments",
};

async function callApi(url, method, dtoIn, params) {
  return AppClient[method](url, dtoIn, params);
}

function getTokenHeaders(token) {
  return {
    headers: {
      Authorization: "Bearer " + token.replace("Bearer ", ""),
    },
  };
}

const StravaApiHelper = {
  async getToken(dtoIn) {
    return callApi(STRAVA_API.getToken, "post", dtoIn);
  },

  async getLoggedInAthlete(token) {
    return callApi(STRAVA_API.athlete, "get", null, getTokenHeaders(token));
  },

  async getLoggedInAthleteActivities(token, dtoIn) {
    return callApi(STRAVA_API.athleteActivities, "get", dtoIn, getTokenHeaders(token));
  },

  async getActivityById(token, id, dtoIn) {
    let url = STRAVA_API.activity + "/" + id;
    return callApi(url, "get", dtoIn, getTokenHeaders(token));
  },

  async getSegmentById(token, id) {
    let url = STRAVA_API.segment + "/" + id;
    return callApi(url, "get", null, getTokenHeaders(token));
  },

  async getSegmentLeaderboard(token, id, dtoIn) {
    let url = STRAVA_API.segment + "/" + id + "/leaderboard";
    return callApi(url, "get", dtoIn, getTokenHeaders(token));
  },
};

module.exports = StravaApiHelper;
