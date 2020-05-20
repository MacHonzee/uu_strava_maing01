"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TrailtourMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, year: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, id: uuObject.id }, uuObject, "NONE");
  }

  async getByYear(awid, year) {
    return await super.findOne({ awid, year });
  }
}

module.exports = TrailtourMongo;
