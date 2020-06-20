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

const SEGMENT_LOOKUP_STAGES = [
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
  }
];

function fixAggregateIds(items) {
  items.forEach((item, i, self) => {
    self[i].id = item._id;
    self[i].segment.id = item.segment._id;
    delete item._id;
    delete item.segment._id;
  });
  return items;
}

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

    let items = await super.aggregate([
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
      ...SEGMENT_LOOKUP_STAGES
      // TODO $set a $unset does not work in Mongo in Cloudu (requires 4.2+)
      // {
      //   $set: {
      //     id: "$_id",
      //     "segment.id": "$segment._id"
      //   }
      // },
      // {
      //   $unset: ["_id", "segment._id"]
      // }
    ]);

    items = fixAggregateIds(items);

    return items;
  }

  async listSegments(awid, trailtourId) {
    let items = await super.aggregate([
      { $match: { awid, trailtourId: new ObjectId(trailtourId) } },
      ...SEGMENT_LOOKUP_STAGES
      // TODO $set a $unset does not work in Mongo in Cloudu (requires 4.2+)
      // {
      //   $set: {
      //     id: "$_id",
      //     "segment.id": "$segment._id"
      //   }
      // },
      // {
      //   $unset: ["_id", "segment._id"]
      // }
    ]);

    items = fixAggregateIds(items);

    return items;
  }
}

module.exports = TrailtourResultsMongo;
