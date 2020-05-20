"use strict";
const AppClient = require("uu_appg01_server").AppClient;
const cheerio = require('cheerio');

async function parsePage(pageUri) {
  let data = await AppClient.get(pageUri, {}, {transformResponse: false});
  return cheerio.load(data.data);
}

const BASE_SELECTORS = {
  tourItem: ".etapa-item"
};

const TrailtourParser = {
  async parseBaseUri(baseUri) {
    const $ = await parsePage(baseUri);
    let items = $(BASE_SELECTORS.tourItem);
    let trailtourList = [];
    console.log(items);
    return trailtourList;

    // let trailtourList = [
    //   {
    //     order: 1,
    //     author: "Pavel Čáp",
    //     link: "http://www.trailtour.cz/2020/etapy-cz/cz-etapa01-oparno-ceske-stredohori/"
    //   }
    // ];
  },

  async parseTourDetail(link) {
    let tourDetail = {
      gpxLink: "http://www.trailtour.cz/2020/data/uploads/czetapa01/cz-etapa01-oparno-ceske-stredohori.gpx",
      stravaId: "23932906",
      resultsTimestamp: "20. 05. 2020, 08:18", // asi na ISO string
      womenResults: [
        {
          order: 1,
          name: "Eliška Hájková",
          stravaId: "29247257",
          time: "00:16:02", // převést na sekundy asi,
          points: 154.17
        }
      ],
      menResults: [], // stejné,
      clubResults: [
        {
          name: "SK",
          points: 123.12
        }
      ]
    };
  }
};

module.exports = TrailtourParser;
