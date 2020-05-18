"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class SegmentMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, stravaId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, activity_type: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateByStravaId(awid, stravaId, uuObject) {
    return await super.findOneAndUpdate({ awid, stravaId }, uuObject, "NONE");
  }

  async getByStravaId(awid, stravaId) {
    return await super.findOne({ awid, stravaId });
  }
}

module.exports = SegmentMongo;
