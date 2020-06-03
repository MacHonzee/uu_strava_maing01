"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TrailtourResultsMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, segmentId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, stravaId: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateBySegmentId(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, segmentId: uuObject.segmentId }, uuObject, "NONE");
  }

  async updateByStravaId(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, stravaId: uuObject.stravaId }, uuObject, "NONE");
  }
}

module.exports = TrailtourResultsMongo;
