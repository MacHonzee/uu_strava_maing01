"use strict";
const { Config } = require("uu_appg01_server").Utils;

const MIDDLEWARE_ORDER = -450;
const SUBAPP_REGEX = /\/?[a-zA-Z0-9]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+(-[a-zA-Z0-9]+)?\/[a-f0-9]{32}/;

/**
 * Initializes UriOverrideMiddleware which redirects request to a single awid of the instance in case it is missing
 */
class UriOverrideMiddleware {
  constructor() {
    this.order = MIDDLEWARE_ORDER;
  }

  pre(req, res, next) {
    // let overrideUrl = Config.get("defaultUriOverride");
    // if (!overrideUrl) return next();
    // console.log(req.url);

    // FIXME does not work for oidc
    // this does not allow use of uuCloud aliases
    // let url = req.url;
    // if (!url.match(SUBAPP_REGEX)) {
    //   console.log("Overriding late url", req.url);
    //   let useCase = url.replace(SUBAPP_REGEX, "");
    //   req.url = overrideUrl + useCase;
    //   console.log("Overriden to", req.url);
    // }

    return next();
  }
}

module.exports = UriOverrideMiddleware;
