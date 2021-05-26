const TrailtourCache = require("./trailtour-cache");

class TrailtourCacheHandler {
  async withTrailtourCache(ucEnv, fn) {
    let year = ucEnv.getDtoIn().year;
    let trailtour = TrailtourCache.getTrailtourCache(year);
    return await this._handleCache(ucEnv, fn, trailtour);
  }

  async withTrailtourResultCache(ucEnv, fn) {
    let ttResultId = ucEnv.getDtoIn().id;
    let trailtour = TrailtourCache.getTrailtourResultCache(ttResultId);
    return await this._handleCache(ucEnv, fn, trailtour);
  }

  async _handleCache(ucEnv, fn, trailtour) {
    if (trailtour && ucEnv.getRequest().isResourceCached({ lastModified: trailtour.lastUpdate })) {
      // this way it is possible to completely skip Abl call
      return ucEnv.getResponse().useCachedResource();
    } else {
      // otherwise if it is not cached, we call Abl and then save the resource cache
      let dtoOut = await fn();
      ucEnv.getResponse().setResourceCache({
        lastModified: dtoOut.lastUpdate || dtoOut.trailtour.lastUpdate,
        maxAge: 1, // this parameter is mandatory - if it is 0 or undefined, the browser does not even call the backend
      });
      return dtoOut;
    }
  }
}

module.exports = new TrailtourCacheHandler();
