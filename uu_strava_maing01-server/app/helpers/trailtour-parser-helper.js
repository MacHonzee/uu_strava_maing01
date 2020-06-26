"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const cheerio = require("cheerio");

const BASE_SELECTORS = {
  tourItem: ".etapa-item",
  tourItemHeader: ".prehled-etap-nadpis2",
  tourDetailName: ".text-center.etapa-h2",
  tourDetailGpx: ".text-center .btn-success",
  womenResults: ".etapa-vysledky div.row:nth-child(2)",
  menResults: ".etapa-vysledky div.row:nth-child(3)",
  clubResults: ".etapa-vysledky div.row:nth-child(4)",
  generatedResults: ".default-content p:nth-child(2)",
  tableResults: "tbody",
  totalWomenResults: ".default-content table.table:nth-child(3)",
  totalMenResults: ".default-content table.table:nth-child(7)",
  totalClubResults: ".default-content table.table:nth-child(11)",
  mapyCzLink: 'JAK.mel\\("a", {href:"(.*)", target'
};

const YEARLY_SELECTORS = {
  2019: {
    tourDetailStravalink: ".etapa-vysledky .text-center a.btn-success"
  },
  2020: {
    tourDetailStravalink: "#vysledky + p.text-center a.btn-warning"
  }
};

const TRAILTOUR_ORDER_TITLE = /TRAILTOUR (CZ |SK )?#/;
const STRAVA_SEGMENT_HREF = "https://www.strava.com/segments/";
const STRAVA_ATHLETE_HREF = "https://www.strava.com/athletes/";
const GENERATED_LABEL = "Generováno: ";

async function parsePage(pageUri) {
  let data = await AppClient.get(pageUri, {}, { transformResponse: false });
  let strData = await streamToString(data);
  return { $: cheerio.load(strData), stringData: strData };
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
  // TODO this now works only for 2020 year
  let results = $(selector);
  // FIXME not found nows
  let generatedTag = $(BASE_SELECTORS.generatedResults, results);
  let generated =
    generatedTag &&
    generatedTag
      .text()
      .trim()
      .replace(GENERATED_LABEL, "");
  let tableRows = $(BASE_SELECTORS.tableResults, results).children();

  let allResults = [];
  for (let i = 1; i < tableRows.length; i++) {
    let rowCells = tableRows[i].childNodes.filter(node => node.type === "tag");
    let nameTd = $(rowCells[1]);
    let name = nameTd.text().trim();
    let nameLink = nameTd.find("a")[0];
    let stravaId;
    if (nameLink) {
      stravaId = parseInt(nameLink.attribs.href.replace(STRAVA_ATHLETE_HREF, ""));
    }

    let club;
    if (rowCells.length === 4 || rowCells.length === 5) {
      club = $(rowCells[2])
        .text()
        .trim();

      if (club === "---") club = undefined;
    }

    let seconds;
    if (rowCells.length === 5) {
      seconds = 0;
      let timeSplits = $(rowCells[3])
        .text()
        .trim()
        .split(":");

      for (let pow = 0; pow <= 2; pow++) {
        seconds += Math.pow(60, pow) * parseFloat(timeSplits[2 - pow]);
      }
    }

    let pointsTd = $(rowCells[rowCells.length - 1]);
    let points = parseFloat(pointsTd.text().trim());

    let resultItem = {
      order: i,
      name,
      points
    };
    if (seconds) resultItem.time = seconds;
    if (stravaId) resultItem.stravaId = stravaId;
    if (club) resultItem.club = club;

    allResults.push(resultItem);
  }

  return { generated, allResults };
}

const TrailtourParser = {
  async parseBaseUri(baseUri) {
    const { $ } = await parsePage(baseUri);
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

  async parseTourDetail(link, year) {
    const { $, stringData } = await parsePage(link);
    let name = $(BASE_SELECTORS.tourDetailName)
      .text()
      .replace(/\n/g, "")
      .replace(/\/\s+/, "/ ")
      .trim();
    let gpxLink = $(BASE_SELECTORS.tourDetailGpx)[0].attribs.href;
    let yearlySelector = YEARLY_SELECTORS[year.toString()] || YEARLY_SELECTORS["2020"];
    let stravaLink = $(yearlySelector.tourDetailStravalink)[0].attribs.href;
    let stravaId = parseInt(stravaLink.replace(STRAVA_SEGMENT_HREF, ""));
    let foundMapyCzLink = stringData.match(BASE_SELECTORS.mapyCzLink);
    let mapyCzLink = foundMapyCzLink ? foundMapyCzLink[1] : undefined;
    let { allResults: womenResults } = parseResults($, BASE_SELECTORS.womenResults);
    let { allResults: menResults } = parseResults($, BASE_SELECTORS.menResults);
    let { allResults: clubResults, generated } = parseResults($, BASE_SELECTORS.clubResults);

    return {
      name,
      gpxLink,
      stravaId,
      resultsTimestamp: generated,
      mapyCzLink,
      womenResults,
      menResults,
      clubResults
    };
  },

  async parseTotalResults(uri) {
    const { $ } = await parsePage(uri);
    let { allResults: womenResults } = parseResults($, BASE_SELECTORS.totalWomenResults);
    let { allResults: menResults } = parseResults($, BASE_SELECTORS.totalMenResults);
    let { allResults: clubResults } = parseResults($, BASE_SELECTORS.totalClubResults);

    return { womenResults, menResults, clubResults };
  }
};

module.exports = TrailtourParser;
