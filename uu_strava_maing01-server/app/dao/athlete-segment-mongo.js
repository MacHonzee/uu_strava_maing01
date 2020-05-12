"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class AthleteSegmentMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, stravaId: 1, uuIdentity: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateByStravaIdAndUuIdentity(awid, stravaId, uuIdentity, uuObject) {
    return await super.findOneAndUpdate({ awid, stravaId, uuIdentity }, uuObject, "NONE");
  }

  async getByStravaIdAndUuIdentity(awid, stravaId, uuIdentity) {
    return await super.findOne({ awid, stravaId, uuIdentity });
  }
}

module.exports = AthleteSegmentMongo;
