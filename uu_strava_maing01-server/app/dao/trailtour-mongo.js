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
}

module.exports = TrailtourMongo;
