"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TrailtourMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, year: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateByYear(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, year: uuObject.year }, uuObject, "NONE");
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async getByYear(awid, year) {
    return await super.findOne({ awid, year });
  }

  async list(awid, pageInfo, sort, projection) {
    return await super.find({ awid }, pageInfo, sort, projection);
  }

  async listAllForCache() {
    return await super.find({}, {}, {}, { lastUpdate: 1, year: 1 });
  }

  async listActive(awid) {
    return await super.find({ awid, state: "active" });
  }

  async listAthletes(awid, year) {
    let projection = {
      lastUpdate: 1,
    };
    ["womenResults", "menResults"].forEach((resultKey) => {
      projection["totalResults." + resultKey + ".name"] = 1;
      projection["totalResults." + resultKey + ".stravaId"] = 1;
    });

    let trailtourObj = await super.findOne({ awid, year }, projection);

    return {
      lastUpdate: trailtourObj.lastUpdate,
      men: trailtourObj.totalResults.menResults,
      women: trailtourObj.totalResults.womenResults,
    };
  }
}

module.exports = TrailtourMongo;
