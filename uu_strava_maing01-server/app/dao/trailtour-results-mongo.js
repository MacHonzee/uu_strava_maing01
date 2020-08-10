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

function getResultTotalStage(key) {
  return {
    $cond: {
      if: { $isArray: "$" + key },
      then: { $size: "$" + key },
      else: 0
    }
  };
}

function getElemMatchStage(rootKey, matchKey, matchList) {
  return {
    $filter: {
      input: "$" + rootKey,
      as: rootKey,
      cond: {
        $in: ["$$" + rootKey + "." + matchKey, matchList]
      }
    }
  };
}

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

  async listAthleteResults(awid, trailtourId, stravaIdList) {
    return await super.aggregate([
      { $match: { awid, trailtourId: new ObjectId(trailtourId) } },
      {
        $project: {
          menResultsTotal: getResultTotalStage("menResults"),
          womenResultsTotal: getResultTotalStage("womenResults"),
          clubResultsTotal: getResultTotalStage("clubResults"),
          menResults: getElemMatchStage("menResults", "stravaId", stravaIdList),
          womenResults: getElemMatchStage("womenResults", "stravaId", stravaIdList),
          clubResults: getElemMatchStage("clubResults", "stravaId", stravaIdList),
          ...PROJECTION_ATTRS
        }
      },
      ...SEGMENT_LOOKUP_STAGES,
      ...CONVERT_ID_STAGES
    ]);
  }

  async listClubResults(awid, trailtourId, clubNameList) {
    const getPointsSum = key => ({
      $reduce: {
        input: "$" + key,
        initialValue: 0.0,
        in: { $add: ["$$value", "$$this.points"] }
      }
    });

    const getResultLength = key => ({ $size: "$" + key });

    const getAvgPoints = key => ({
      $cond: {
        if: { $eq: ["$" + key + "Count", 0] },
        then: 0,
        else: { $divide: ["$" + key + "Points", "$" + key + "Count"] }
      }
    });

    return await super.aggregate([
      { $match: { awid, trailtourId: new ObjectId(trailtourId) } },
      {
        $project: {
          clubResultsTotal: getResultTotalStage("clubResults"),
          menResults: getElemMatchStage("menResults", "club", clubNameList),
          womenResults: getElemMatchStage("womenResults", "club", clubNameList),
          clubResults: getElemMatchStage("clubResults", "name", clubNameList),
          ...PROJECTION_ATTRS
        }
      },
      {
        $addFields: {
          menResultsPoints: getPointsSum("menResults"),
          womenResultsPoints: getPointsSum("womenResults"),
          clubResultsPoints: getPointsSum("clubResults"),
          menResultsCount: getResultLength("menResults"),
          womenResultsCount: getResultLength("womenResults"),
          clubResultsCount: { $add: [getResultLength("menResults"), getResultLength("womenResults")] }
        }
      },
      {
        $addFields: {
          menResultsAvgPoints: getAvgPoints("menResults"),
          womenResultsAvgPoints: getAvgPoints("womenResults"),
          clubResultsAvgPoints: getAvgPoints("clubResults")
        }
      },
      {
        $project: {
          menResults: 0,
          womenResults: 0,
          clubResults: 0
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
