"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class StravaMainMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid) {
    let filter = {
      awid: awid,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }
}

module.exports = StravaMainMongo;
