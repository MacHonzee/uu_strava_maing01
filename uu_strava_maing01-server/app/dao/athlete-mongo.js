"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class AthleteMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, uuIdentity: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async update(uuObject) {
    return await super.findOneAndUpdate({ awid: uuObject.awid, uuIdentity: uuObject.uuIdentity }, uuObject, "NONE");
  }

  async getByUuIdentity(awid, uuIdentity) {
    return await super.findOne({ awid, uuIdentity });
  }
}

module.exports = AthleteMongo;
