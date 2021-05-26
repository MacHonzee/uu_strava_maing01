"use strict";
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const ValidationHelper = require("../components/validation-helper");
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { LruCache } = require("uu_appg01_server").Utils;
const AppClient = require("uu_appg01_server").AppClient;
const Errors = require("../api/errors/strava-main-error.js");

const CACHED_PERSONAL_ROLE_CMD =
  "https://uuappg01-eu-w-1.plus4u.net/uu-plus4upeople-maing01/56ac93ddb0034de8b8e4f4b829ff7d0f/findPerson";

class StravaMainAbl {
  constructor() {
    this.configDao = DaoFactory.getDao("stravaMain");
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.personalRoleCache = new LruCache();
  }

  async init(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    const schemas = ["stravaMain", "athlete", "activity", "segment", "athleteSegment", "trailtour", "trailtourResults"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3
    const profileMap = {
      Authorities: dtoIn.authoritiesUri,
      RegisteredUsers: "urn:uu:GGPLUS4U",
      UnregisteredUsers: "urn:uu:GGALL",
    };

    for (let profileCode in profileMap) {
      // eslint-disable-next-line no-prototype-builtins
      if (!profileMap.hasOwnProperty(profileCode)) continue;

      let profile = profileMap[profileCode];
      try {
        await SysProfileModel.setProfile(awid, { code: profileCode, roleUri: profile });
      } catch (e) {
        if (e instanceof ObjectStoreError) {
          // A4
          throw new Errors.Init.SetProfileFailed({ uuAppErrorMap }, { code: profileCode, role: profile }, e);
        }
        throw e;
      }
    }

    // HDS 4
    await this.configDao.create({ awid, ...dtoIn.configuration });

    // HDS 6
    return {
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async loadConfig(uri, session) {
    const awid = uri.getAwid();
    let config = await this.configDao.get(awid);
    delete config.clientSecret;
    delete config.elevationApiKey;

    const AthleteAbl = require("./athlete-abl");
    let { athlete } = await AthleteAbl.loadMyself(uri, session);

    let trailtours = await this.trailtourDao.list(awid, {}, { state: 1 }, { _id: 1, year: 1, state: 1 });

    // sort first by year, then by CZ > SK (it should sort to 2021_CZ, 2021_SK, 2020_CZ, 2020_SK and 2019)
    trailtours.itemList.sort((a, b) => {
      let yearA = a.year.match(/^\d+/)[0];
      let yearB = b.year.match(/^\d+/)[0];
      if (yearA > yearB) return -1;
      if (yearA < yearB) return 1;
      if (a.year.includes("CZ")) return -1;
    });

    return {
      config,
      trailtours: trailtours.itemList,
      athlete,
    };
  }

  async updateConfig(uri, dtoIn) {
    const awid = uri.getAwid();

    // HDS 1, A1, A2
    let uuAppErrorMap = ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let config = await this.configDao.update({ awid, ...dtoIn });

    // HDS 3
    return {
      ...config,
      uuAppErrorMap,
    };
  }

  // this is just a utility command to override CORS for different deployments than uuCloud (such as Google Cloud)
  async redirectToPlus4uNetApi(uri, dtoIn, session) {
    // HDS 1, A1, A2
    ValidationHelper.validate(uri, dtoIn);

    // HDS 2
    let dtoOut;
    if (dtoIn.originalUri.includes(CACHED_PERSONAL_ROLE_CMD)) {
      let uuIdentity = session.getIdentity().getUuIdentity();
      dtoOut = this.personalRoleCache.get(uuIdentity);
      if (!dtoOut) {
        dtoOut = await AppClient.get(dtoIn.originalUri, dtoIn.originalData, { session });
        this.personalRoleCache.set(uuIdentity, dtoOut);
      }
    } else {
      dtoOut = await AppClient.get(dtoIn.originalUri, dtoIn.originalData, { session });
    }

    // HDS 3
    return dtoOut;
  }
}

module.exports = new StravaMainAbl();
