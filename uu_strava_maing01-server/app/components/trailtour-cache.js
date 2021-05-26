const { DaoFactory } = require("uu_appg01_objectstore");
const { LoggerFactory } = require("uu_appg01_core-logging");

class TrailtourCache {
  constructor() {
    this._trailtours = {};
    this._trailtourYearMap = {};
    this._ttResultsMap = {};
    this._logger = LoggerFactory.get("TrailtourCache.Handler");
    this._active = false;
  }

  async initCache() {
    const trailtourDao = DaoFactory.getDao("trailtour");
    let trailtours = await trailtourDao.listAllForCache();
    trailtours.itemList.forEach((tt) => {
      this._trailtours[tt.id] = tt;
      this._trailtourYearMap[tt.year] = tt;
    });

    const ttResultsDao = DaoFactory.getDao("trailtourResults");
    let ttResults = await ttResultsDao.listAllForCache();
    ttResults.itemList.forEach((tt) => {
      this._ttResultsMap[tt.id] = { trailtour: tt.trailtourId };
    });

    this._active = true;

    this._logger.info("Trailtour cache initialized");
  }

  getTrailtourCache(year) {
    return this._active && this._trailtourYearMap[year];
  }

  getTrailtourResultCache(ttResultId) {
    let trailtourId = this._ttResultsMap[ttResultId];
    let trailtour = this._trailtours[trailtourId];
    return this._active && trailtour;
  }

  updateCache(next) {
    let tt = next.fullDocument;
    this._trailtours[tt._id] = tt;
    this._trailtourYearMap[tt.year] = tt;
  }

  enableCache() {
    this._active = true;
  }

  disableCache() {
    this._active = false;
  }
}

module.exports = new TrailtourCache();
