"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("mongodb");

const PROJECTION_ATTRS = {
  name: 1,
  gpxLink: 1,
  stravaId: 1,
  resultsTimestamp: 1,
  segmentId: 1,
  sys: 1,
  author: 1,
  link: 1,
  order: 1
};

class TrailtourResultsMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, segmentId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, stravaId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, trailtourId: 1 });
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

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  async listAthleteResults(awid, trailtourId, athleteStravaId) {
    let elemMatch = key => ({
      $filter: { input: "$" + key, as: key, cond: { $eq: ["$$" + key + ".stravaId", athleteStravaId] } }
    });
    let resultsTotal = key => ({ $cond: { if: { $isArray: "$" + key }, then: { $size: "$" + key }, else: 0 } });

    return await super.aggregate([
      { $match: { awid, trailtourId: new ObjectId(trailtourId) } },
      {
        $project: {
          menResultsTotal: resultsTotal("menResults"),
          womenResultsTotal: resultsTotal("womenResults"),
          clubResultsTotal: resultsTotal("clubResults"),
          menResults: elemMatch("menResults"),
          womenResults: elemMatch("womenResults"),
          clubResults: elemMatch("clubResults"),
          ...PROJECTION_ATTRS
        }
      },
      {
        $lookup: {
          from: "segment",
          localField: "segmentId",
          foreignField: "_id",
          as: "segment"
        }
      },
      {
        $unwind: "$segment"
      },
      {
        $set: {
          id: "$_id",
          "segment.id": "$segment._id"
        }
      },
      {
        $unset: ["_id", "segment._id"]
      }
    ]);
  }
}

module.exports = TrailtourResultsMongo;
