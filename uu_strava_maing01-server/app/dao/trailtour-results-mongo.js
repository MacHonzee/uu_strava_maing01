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

// $set and $unset does not work in Mongo 4.0 (requires 4.2+)
const CONVERT_ID_STAGES = [
  {
    $addFields: {
      id: "$_id",
      "segment.id": "$segment._id"
    }
  },
  {
    $project: {
      _id: 0,
      "segment._id": 0
    }
  }
];

class TrailtourResultsMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, segmentId: 1, trailtourId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, stravaId: 1, trailtourId: 1 }, { unique: true });
    await super.createIndex({ awid: 1, trailtourId: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateBySegmentAndTtId(uuObject) {
    return await super.findOneAndUpdate(
      { awid: uuObject.awid, segmentId: uuObject.segmentId, trailtourId: uuObject.trailtourId },
      uuObject,
      "NONE"
    );
  }

  async updateByStravaAndTtId(uuObject) {
    return await super.findOneAndUpdate(
      { awid: uuObject.awid, stravaId: uuObject.stravaId, trailtourId: uuObject.trailtourId },
      uuObject,
      "NONE"
    );
  }

  async get(awid, id) {
    return await super.findOne({ awid, id });
  }

  // TODO odstranit po odstranění cmd getAthleteResults
  async listAthleteResults_(awid, trailtourId, athleteStravaId) {
    let elemMatch = key => ({
      $slice: [
        {
          $filter: {
            input: "$" + key,
            as: key,
            cond: { $eq: ["$$" + key + ".stravaId", athleteStravaId] }
          }
        },
        1
      ]
    });
    let resultsTotal = key => ({
      $cond: {
        if: { $isArray: "$" + key },
        then: { $size: "$" + key },
        else: 0
      }
    });

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
      ...SEGMENT_LOOKUP_STAGES,
      ...CONVERT_ID_STAGES
    ]);
  }

  async listAthleteResults(awid, trailtourId, stravaIdList) {
    let elemMatch = key => ({
      $filter: {
        input: "$" + key,
        as: key,
        cond: {
          $in: ["$$" + key + ".stravaId", stravaIdList]
        }
      }
    });

    let resultsTotal = key => ({
      $cond: {
        if: { $isArray: "$" + key },
        then: { $size: "$" + key },
        else: 0
      }
    });

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
      ...SEGMENT_LOOKUP_STAGES,
      ...CONVERT_ID_STAGES
    ]);
  }

  async listSegments(awid, trailtourId) {
    return await super.aggregate([
      { $match: { awid, trailtourId: new ObjectId(trailtourId) } },
      ...SEGMENT_LOOKUP_STAGES,
      ...CONVERT_ID_STAGES
    ]);
  }

  async listAllForCache() {
    return await super.find({}, {}, {}, { trailtourId: 1 });
  }
}

module.exports = TrailtourResultsMongo;
