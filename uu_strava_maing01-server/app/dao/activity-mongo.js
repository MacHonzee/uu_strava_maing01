"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ActivityMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, stravaId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, uuIdentity: 1 });
    await super.createIndex({ awid: 1, start_date: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByStravaId(awid, stravaId) {
    return await super.findOne({ awid, stravaId });
  }

  async listLatestByUuIdentity(awid, uuIdentity) {
    return await super.findOne({ awid, uuIdentity }, null, { start_date: -1 });
  }
}

module.exports = ActivityMongo;
