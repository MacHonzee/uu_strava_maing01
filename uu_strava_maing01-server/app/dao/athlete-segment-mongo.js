"use strict";
const {UuObjectDao} = require("uu_appg01_server").ObjectStore;

const DEFAULT_PAGE_INDEX = 0;
const DEFAULT_PAGE_SIZE = 1000;

class AthleteSegmentMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({awid: 1, uuIdentity: 1, stravaId: 1}, {unique: true});
    await super.createIndex({awid: 1, uuIdentity: 1, activityType: 1});
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async updateByStravaIdAndUuIdentity(awid, stravaId, uuIdentity, uuObject) {
    return await super.findOneAndUpdate({awid, stravaId, uuIdentity}, uuObject, "NONE");
  }

  async getByStravaIdAndUuIdentity(awid, stravaId, uuIdentity) {
    return await super.findOne({awid, stravaId, uuIdentity});
  }

  async listOwnByCriteria(awid, criteria, uuIdentity, pageInfo) {
    let matchStage = {
      $match: {
        awid,
        uuIdentity
      }
    };
    if (criteria.activityType) matchStage.$match.activityType = criteria.activityType;

    let pageIndex = pageInfo.pageIndex ? pageInfo.pageIndex : DEFAULT_PAGE_INDEX;
    let pageSize = pageInfo.pageSize ? pageInfo.pageSize : DEFAULT_PAGE_SIZE;
    if (pageSize > DEFAULT_PAGE_SIZE) pageSize = DEFAULT_PAGE_SIZE;
    let total = await super.count(matchStage.$match);

    let itemList = await super.aggregate([
      matchStage,
      {
        $skip: pageIndex * pageSize
      },
      {
        $limit: pageSize
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
        // there will be always only one segment
        $unwind: {
          $path: "$segment"
        }
      },
      {
        $set: {
          "id": "$_id",
          "segment.id": "$segment._id"
        }
      },
      {
        $unset: ["$_id", "$segment._id"]
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$segment",
              {
                ownResult: "$$ROOT"
              }
            ]
          }
        }
      }
    ]);

    return {
      itemList: itemList || [],
      pageInfo: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        total: total
      }
    };
  }
}

module.exports = AthleteSegmentMongo;
