"use strict";
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const Errors = require("../../api/errors/trailtour-error.js");

const APP_ENGINE_CRON_HEADER = "x-appengine-cron";

class UpdateAllAbl {
  constructor() {
    this.trailtourDao = DaoFactory.getDao("trailtour");
  }

  async updateAll(uri, authzResult, headers) {
    const awid = uri.getAwid();

    // HDS 1
    let profiles = authzResult.getAuthorizedProfiles();
    if (
      profiles.length === 0 &&
      !Object.keys(headers).find((header) => header.toLowerCase() === APP_ENGINE_CRON_HEADER)
    ) {
      // A1
      throw new Errors.UpdateAll.NotAuthorized({});
    }

    // HDS 2
    let trailtours = await this.trailtourDao.listActive(awid);

    // HDS 3
    let uuAppErrorMap = {};
    const UpdateAbl = require("./update-abl");
    for (let trailtour of trailtours.itemList) {
      let dtoOut = await UpdateAbl.update(uri, { year: trailtour.year });
      Object.assign(uuAppErrorMap, dtoOut.uuAppErrorMap);
    }

    return {
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateAllAbl();
