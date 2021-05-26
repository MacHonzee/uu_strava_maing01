"use strict";
const { MongoClient } = require("mongodb");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");

const TT_YEAR = "2021_SK";

// DB setup
const DATABASE_NAME = "uuStravaMainPrimary";
const CONN_STRING = "mongodb://127.0.0.1:27017/" + DATABASE_NAME;

// setup of headers file for the fetch. Easiest way is copying the headers from browser, it needs cookie mainly
const STRAVA_HEADERS_PATH = "./strava-webscrape-headers.json";

function readReqBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("error", reject);

    req.on("end", () => {
      resolve(body);
    });
  });
}

const STRAVA_HEADERS = JSON.parse(fs.readFileSync(STRAVA_HEADERS_PATH));
const PAGE_SIZE = 100;

async function loadStravaLeaderboard(segmentId, gender) {
  let page = 1;
  let allTtResults = [];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let stravaApiUrl = `https://www.strava.com/segments/${segmentId}/leaderboard?page=${page}&per_page=${PAGE_SIZE}&partial=false&gender=${gender}`;

    let result = await fetch(stravaApiUrl, {
      headers: STRAVA_HEADERS,
      referrer: `https://www.strava.com/segments/${segmentId}?filter=overall`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors"
    });

    let leaderboard = await readReqBody(result.body);

    let ttResults = parseStravaResults(leaderboard);
    allTtResults = allTtResults.concat(ttResults);

    if (ttResults.length === PAGE_SIZE) {
      page++;
    } else {
      break;
    }
  }
  return allTtResults;
}

function _padNum(num) {
  return num < 10 ? "0" + num : num;
}

function parseStravaResults(strData) {
  let $ = cheerio.load(strData);
  let rows = $(".table-leaderboard tbody tr");
  let results = [];
  Array.from(rows).forEach(row => {
    let cells = row.children.filter(tag => tag.name === "td");
    if (cells.length < 3) return; // it might return "No results found" sometimes

    let athleteId = JSON.parse(cells[1].attribs["data-tracking-properties"]).athlete_id;
    let date = new Date(
      $(cells[2])
        .text()
        .trim()
    );
    let dateStr = `${date.getFullYear()}-${_padNum(date.getMonth() + 1)}-${_padNum(date.getDate())}`;
    results.push({ athlete: athleteId, date: dateStr });
  });
  return results;
}

async function migrateData(database) {
  // download trailtour and all trailtour results
  let ttColl = database.collection("trailtour");
  let trailtour = await ttColl.findOne({ year: TT_YEAR });
  let ttResultsColl = database.collection("trailtourResults");
  let trailtourResults = await ttResultsColl.find({ trailtourId: trailtour._id }).toArray();

  let lastRunDateMap = {};
  // process each trailtour
  for (let ttResult of trailtourResults) {
    console.log("Starting migration on: " + ttResult.name);

    // process each sex separately
    for (let sexKey of ["menResults", "womenResults"]) {
      let stravaSexKey = sexKey === "menResults" ? "M" : "F";
      let leaderboard = await loadStravaLeaderboard(ttResult.stravaId, stravaSexKey);

      // for each found athlete, found TT counterpart by comparing stravaId
      leaderboard.forEach(({ athlete: stravaAthlete, date }) => {
        let foundTtResult = ttResult[sexKey].find(athlete => athlete.stravaId === stravaAthlete);

        // in case of match, update runDate
        if (foundTtResult) {
          foundTtResult.runDate = date;
          if (!lastRunDateMap[stravaAthlete] || lastRunDateMap[stravaAthlete] < date) {
            lastRunDateMap[stravaAthlete] = date;
          }
        }
      });
    }

    // update it in DB
    await ttResultsColl.findOneAndUpdate(
      { _id: ttResult._id },
      { $set: { menResults: ttResult.menResults, womenResults: ttResult.womenResults } }
    );

    console.log("Migration finished on: " + ttResult.name);
  }

  // update global TT results
  for (let sexKey of ["menResults", "womenResults"]) {
    for (let athlete of trailtour.totalResults[sexKey]) {
      let lastRun = lastRunDateMap[athlete.stravaId];
      if (lastRun) {
        athlete.lastRun = lastRun;
      }
    }
  }
  await ttColl.findOneAndUpdate({ _id: trailtour._id }, { $set: { totalResults: trailtour.totalResults } });
  console.log("All migrated");
}

async function main() {
  // connect to mongodb and setup basic try/catch scenario
  const client = new MongoClient(CONN_STRING);
  try {
    await client.connect();
    const database = client.db(DATABASE_NAME);
    await migrateData(database);
  } finally {
    await client.close();
  }
}

main();
