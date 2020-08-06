/**
 * Server calls of application client.
 */
import * as UU5 from "uu5g04";
import Plus4U5 from "uu_plus4u5g01";

const BACKEND_URI_MAP = {
  /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */
  default: location.protocol + "//" + location.host + UU5.Environment.getAppBasePath(),
  dev1: "https://uustravamaing01.ew.r.appspot.com/uu-strava-maing01/9cb6f576dcb44633b5d7e5afd9384a49/"
};

function getBackendUri() {
  let mainEnv = (UU5 && UU5.Environment && UU5.Environment.defaultBackend) || "default";
  return BACKEND_URI_MAP[mainEnv];
}

let Calls = {
  APP_BASE_URI: getBackendUri(),

  call(method, url, dtoIn, clientOptions) {
    return new Promise((resolve, reject) => {
      Plus4U5.Common.Calls.call(
        method,
        url,
        {
          data: dtoIn,
          done: resolve,
          fail: reject
        },
        clientOptions
      );
    });
  },

  loadAwidConfig(dtoInData) {
    let commandUri = Calls.getCommandUri("stravaMain/loadConfig");
    return Calls.call("get", commandUri, dtoInData);
  },

  createAthlete(dtoInData) {
    let commandUri = Calls.getCommandUri("athlete/create");
    return Calls.call("get", commandUri, dtoInData);
  },

  loadAthleteMyself(dtoInData) {
    let commandUri = Calls.getCommandUri("athlete/loadMyself");
    return Calls.call("get", commandUri, dtoInData);
  },

  segmentList(dtoInData) {
    let commandUri = Calls.getCommandUri("segment/list");
    return Calls.call("get", commandUri, dtoInData);
  },

  segmentRefreshOne(_, dtoInData) {
    let commandUri = Calls.getCommandUri("segment/refreshOne");
    return Calls.call("post", commandUri, dtoInData);
  },

  getTrailtour(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/get");
    return Calls.call("get", commandUri, dtoInData);
  },

  getTourSegments(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/getSegments");
    return Calls.call("get", commandUri, dtoInData);
  },

  getTourDetail(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/getTourDetail");
    return Calls.call("get", commandUri, dtoInData);
  },

  updateTrailtour(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/update");
    return Calls.call("post", commandUri, dtoInData);
  },

  listAthletes(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/listAthletes");
    return Calls.call("get", commandUri, dtoInData);
  },

  listAthleteResults(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/listAthleteResults");
    return Calls.call("get", commandUri, dtoInData);
  },

  listClubResults(dtoInData) {
    let commandUri = Calls.getCommandUri("trailtour/listClubResults");
    return Calls.call("get", commandUri, dtoInData);
  },
  /*
  For calling command on specific server, in case of developing client site with already deployed
  server in uuCloud etc. You can specify url of this application (or part of url) in development
  configuration in *-client/env/development.json, for example:
   {
     ...
     "uu5Environment": {
       "gatewayUri": "https://uuos9.plus4u.net",
       "tid": "84723877990072695",
       "awid": "b9164294f78e4cd51590010882445ae5",
       "vendor": "uu",
       "app": "demoappg01",
       "subApp": "main"
     }
   }
   */
  getCommandUri(aUseCase) {
    // useCase <=> e.g. "getSomething" or "sys/getSomething"
    // add useCase to the application base URI
    let targetUriStr = Calls.APP_BASE_URI + aUseCase.replace(/^\/+/, "");

    // override tid / awid if it's present in environment (use also its gateway in such case)
    if (process.env.NODE_ENV !== "production") {
      let env = UU5.Environment;
      if (env.tid || env.awid || env.vendor || env.app) {
        let url = Plus4U5.Common.Url.parse(targetUriStr);
        if (env.tid || env.awid) {
          if (env.gatewayUri) {
            let match = env.gatewayUri.match(/^([^:]*):\/\/([^/]+?)(?::(\d+))?(\/|$)/);
            if (match) {
              url.protocol = match[1];
              url.hostName = match[2];
              url.port = match[3];
            }
          }
          if (env.tid) url.tid = env.tid;
          if (env.awid) url.awid = env.awid;
        }
        if (env.vendor || env.app) {
          if (env.vendor) url.vendor = env.vendor;
          if (env.app) url.app = env.app;
          if (env.subApp) url.subApp = env.subApp;
        }
        targetUriStr = url.toString();
      }
    }

    return targetUriStr;
  }
};

export default Calls;
