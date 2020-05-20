"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const cheerio = require("cheerio");

async function parsePage(pageUri) {
  let data = await AppClient.get(pageUri, {}, { transformResponse: false });
  let strData = await streamToString(data);
  return cheerio.load(strData);
}

async function streamToString(stream) {
  let body = [];
  return new Promise((resolve, reject) => {
    stream.on("data", chunk => body.push(chunk));
    stream.on("end", () => {
      body = Buffer.concat(body).toString();
      resolve(body);
    });
    stream.on("error", err => reject(err));
  });
}

function parseResults($, selector) {
  let results = $(selector);
  let generated = $(BASE_SELECTORS.generatedResults, results)
    .text()
    .trim()
    .replace(GENERATED_LABEL, "");
  let tableRows = $(BASE_SELECTORS.tableResults, results).children();

  let allResults = [];
  for (let i = 1; i < tableRows.length; i++) {
    let rowCells = tableRows[i].childNodes;
    let nameTd = $(rowCells[0]);
    let name = nameTd.text().trim();
    let nameLink = nameTd.find("a")[0];
    let stravaId;
    if (nameLink) {
      stravaId = nameLink.attribs.href.replace(STRAVA_ATHLETE_HREF, "");
    }

    let seconds;
    if (rowCells.length === 3) {
      seconds = 0;
      let timeSplits = $(rowCells[1])
        .text()
        .trim()
        .split(":");

      // eslint-disable-next-line for-direction
      for (let pow = 0; pow <= 2; pow++) {
        seconds += Math.pow(60, pow) * parseFloat(timeSplits[2 - pow]);
      }
    }

    let pointsTd = $(rowCells[rowCells.length - 1]);
    let points = parseFloat(pointsTd.text().trim());

    allResults.push({
      order: i,
      name,
      stravaId,
      time: seconds,
      points
    });
  }

  return { generated, allResults };
}

const BASE_SELECTORS = {
  tourItem: ".etapa-item",
  tourItemHeader: ".prehled-etap-nadpis2",
  tourDetailGpx: ".text-center .btn-success",
  tourDetailStravalink: "#vysledky + p.text-center a.btn-warning",
  womenResults: ".etapa-vysledky div.row:nth-child(2)",
  menResults: ".etapa-vysledky div.row:nth-child(3)",
  clubResults: ".etapa-vysledky div.row:nth-child(4)",
  generatedResults: "p.text-center",
  tableResults: "tbody"
};

const TRAILTOUR_ORDER_TITLE = "TRAILTOUR CZ #";
const STRAVA_SEGMENT_HREF = "https://www.strava.com/segments/";
const STRAVA_ATHLETE_HREF = "https://www.strava.com/athletes/";
const GENERATED_LABEL = "Generováno : ";

const TrailtourParser = {
  async parseBaseUri(baseUri) {
    const $ = await parsePage(baseUri);
    let items = $(BASE_SELECTORS.tourItem);
    return Array.from(items).map(item => {
      let a = $("a", item);
      let link = a[0].attribs.href;
      let titleSplits = $(BASE_SELECTORS.tourItemHeader, item)
        .text()
        .trim()
        .split("\n");
      let order = titleSplits[0].trim().replace(TRAILTOUR_ORDER_TITLE, "");
      order = parseInt(order);
      let author = titleSplits[1].trim();

      return {
        link,
        order,
        author
      };
    });
  },

  async parseTourDetail(link) {
    const $ = await parsePage(link);
    let gpxLink = $(BASE_SELECTORS.tourDetailGpx)[0].attribs.href;
    let stravaLink = $(BASE_SELECTORS.tourDetailStravalink)[0].attribs.href;
    let stravaId = stravaLink.replace(STRAVA_SEGMENT_HREF, "");
    let { allResults: womenResults } = parseResults($, BASE_SELECTORS.womenResults);
    let { allResults: menResults } = parseResults($, BASE_SELECTORS.menResults);
    let { allResults: clubResults, generated } = parseResults($, BASE_SELECTORS.clubResults);

    return {
      gpxLink,
      stravaId,
      womenResults,
      menResults,
      clubResults,
      resultsTimestamp: generated
    };
  }
};

module.exports = TrailtourParser;
