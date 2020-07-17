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
    trailtours.itemList.forEach(tt => {
      this._trailtours[tt.id] = tt;
      this._trailtourYearMap[tt.year] = tt;
    });

    const ttResultsDao = DaoFactory.getDao("trailtourResults");
    let ttResults = await ttResultsDao.listAllForCache();
    ttResults.itemList.forEach(tt => {
      this._ttResultsMap[tt.id] = { trailtour: tt.trailtourId };
    });

    this._active = true;

    this._logger.info("Trailtour cache initialized");
  }

  async withTrailtourCache(ucEnv, fn) {
    let year = ucEnv.getDtoIn().year;
    let trailtour = this._trailtourYearMap[year];
    return await this._handleCache(ucEnv, fn, trailtour);
  }

  async withTrailtourResultCache(ucEnv, fn) {
    let ttResultId = ucEnv.getDtoIn().id;
    let trailtourId = this._ttResultsMap[ttResultId];
    let trailtour = this._trailtours[trailtourId];
    return await this._handleCache(ucEnv, fn, trailtour);
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

  async _handleCache(ucEnv, fn, trailtour) {
    if (trailtour && this._active && ucEnv.getRequest().isResourceCached({ lastModified: trailtour.lastUpdate })) {
      // this way it is possible to completely skip Abl call
      return ucEnv.getResponse().useCachedResource();
    } else {
      // otherwise if it is not cached, we call Abl and then save the resource cache
      let dtoOut = await fn();
      ucEnv.getResponse().setResourceCache({
        lastModified: dtoOut.lastUpdate || dtoOut.trailtour.lastUpdate,
        maxAge: 1 // this parameter is mandatory - if it is 0 or undefined, the browser does not even call the backend
      });
      return dtoOut;
    }
  }
}

module.exports = new TrailtourCache();
