"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ActivityMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, stravaId: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByStravaId(awid, stravaId) {
    return await super.findOne({ awid, stravaId });
  }
}

module.exports = ActivityMongo;
