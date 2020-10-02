"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const { MongoClient } = require("mongodb");

const TT_YEAR = "2020_CZ";
const DATABASE_NAME = "stravaMainPrimary";
const CONN_STRING = "mongodb://127.0.0.1:27017/" + DATABASE_NAME;
const SKIPPED_STRAVA_IDS = [58106992, 45535394];

const SOURCE_DATES_DATA_LNG = TT_YEAR.replace("2020_", "");
const SOURCE_DATES_DATA = {
  url: "https://trailtour2020.herokuapp.com/_dash-update-component",
  dtoIn: {
    output: "..latest-runs-table.columns...latest-runs-table.data..",
    outputs: [
      {
        id: "latest-runs-table",
        property: "columns"
      },
      {
        id: "latest-runs-table",
        property: "data"
      }
    ],
    inputs: [
      {
        id: "app-country",
        property: "data",
        value: {
          country: SOURCE_DATES_DATA_LNG
        }
      }
    ],
    changedPropIds: []
  }
};

function _padNum(num) {
  return num < 10 ? "0" + num : num;
}

async function migrateData(database, sourceData) {
  // download trailtour and all trailtour results
  let ttColl = database.collection("trailtour");
  let trailtour = await ttColl.findOne({ year: TT_YEAR });
  let ttResultsColl = database.collection("trailtourResults");
  let trailtourResults = await ttResultsColl.find({ trailtourId: trailtour._id }).toArray();

  // iterate on sourceData from reverse to update from past to present
  // eslint-disable-next-line for-direction
  for (let i = sourceData.length - 1; i >= 0; i--) {
    // find matching trailtour by its name
    let source = sourceData[i];
    let foundTt = trailtourResults.find(
      tt => tt.order === parseInt(source["Stage No"].replace(SOURCE_DATES_DATA_LNG + " # ", ""))
    );
    if (!foundTt) {
      throw "There was no TT found for source: " + JSON.stringify(source);
    }

    // find matching result by combination of name and club
    let foundResult;
    let foundSex;
    let uniqueSource = `${source.Name.trim()}_${source.Club === "NoClub" ? "" : source.Club}`;
    for (let sexKey of ["menResults", "womenResults"]) {
      let results = foundTt[sexKey];
      foundResult = results.find(result => {
        let uniqueResult = `${result.name}_${result.club ? result.club : ""}`;
        if (uniqueSource === uniqueResult && !SKIPPED_STRAVA_IDS.includes(result.stravaId)) {
          return true;
        }
      });
      if (foundResult) {
        foundSex = sexKey;
        break;
      }
    }

    if (!foundResult) {
      console.warn("There was no athlete result found for source: " + JSON.stringify(source));
      continue;
    }

    // save date to TT results
    let runDate = new Date(source.Date + "T12:00:00.000Z");
    runDate.setDate(runDate.getDate() - 1);
    let runDateStr = `${runDate.getFullYear()}-${_padNum(runDate.getMonth() + 1)}-${_padNum(runDate.getDate())}`;
    foundResult.runDate = runDateStr;

    // save date to lastRun date in TT total results
    let totalResult = trailtour.totalResults[foundSex].find(result => result.stravaId === foundResult.stravaId);
    totalResult.lastRun = runDateStr;
  }

  // after everything is updated on source data, we then update everything to database
  await ttColl.findOneAndUpdate({ _id: trailtour._id }, { $set: { totalResults: trailtour.totalResults } });
  for (let results of trailtourResults) {
    await ttResultsColl.findOneAndUpdate(
      { _id: results._id },
      { $set: { menResults: results.menResults, womenResults: results.womenResults } }
    );
  }
  console.log("All migrated");
}

async function main() {
  // download data from source Heroku app
  const sourceDataDtoOut = await AppClient.post(SOURCE_DATES_DATA.url, SOURCE_DATES_DATA.dtoIn);
  const sourceData = sourceDataDtoOut.data.response["latest-runs-table"].data;

  // connect to mongodb and setup basic try/catch scenario
  const client = new MongoClient(CONN_STRING);
  try {
    await client.connect();
    const database = client.db(DATABASE_NAME);
    await migrateData(database, sourceData);
  } finally {
    await client.close();
  }
}

main().catch(e => {
  console.error(e);
});
