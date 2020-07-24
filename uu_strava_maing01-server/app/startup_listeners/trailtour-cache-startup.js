const { DaoFactory } = require("uu_appg01_objectstore");
const { DbConnection } = require("uu_appg01_datastore");
const { Config } = require("uu_appg01_server").Utils;
const { LoggerFactory } = require("uu_appg01_core-logging");
const TrailtourCache = require("../helpers/trailtour-cache");

async function getDbConnection() {
  const map = Config.get("uuSubAppDataStoreMap");
  const uri = map["primary"];
  return await DbConnection.get(uri);
}

class TrailtourCacheStartup {
  /**
   * Initialize watching changes in trailtour collection.
   */
  async onStartup() {
    if (DaoFactory.isDataStoreOn()) {
      await TrailtourCache.initCache();

      const logger = LoggerFactory.get("TrailtourCache.Startup");
      const db = await getDbConnection();
      const changeStream = db
        .collection("trailtour")
        .watch(
          [
            { $match: { operationType: { $in: ["insert", "replace", "update"] } } },
            { $project: { operationType: 1, fullDocument: { _id: 1, lastUpdate: 1, year: 1 } } }
          ],
          { fullDocument: "updateLookup" }
        );
      changeStream.on("change", next => {
        TrailtourCache.updateCache(next);
      });
      changeStream.on("error", e => {
        logger.warn("ChangeStream not available in current MongoDB deployment.", e);
        changeStream.close();
      });
      changeStream.on("close", () => {
        TrailtourCache.disableCache();
      });
      changeStream.on("end", () => {
        TrailtourCache.disableCache();
      });
    }
  }
}

module.exports = TrailtourCacheStartup;
