"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const { LruCache } = require("uu_appg01_server").Utils;
const AppClient = require("uu_appg01_server").AppClient;
const Errors = require("../api/errors/strava-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  },
  updateConfigUnsupportedKeys: {
    code: `${Errors.UpdateConfig.UC_CODE}unsupportedKeys`
  },
  redirectToPlus4uNetApiUnsupportedKeys: {
    code: `${Errors.RedirectToPlus4uNetApi.UC_CODE}unsupportedKeys`
  }
};

const CACHED_PERSONAL_ROLE_CMD = "https://api.plus4u.net/ues/wcp/ues/core/security/session/UESSession/getPersonalRole";

class StravaMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.configDao = DaoFactory.getDao("stravaMain");
    this.trailtourDao = DaoFactory.getDao("trailtour");
    this.personalRoleCache = new LruCache();
  }

  async init(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("initDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["stravaMain", "athlete", "activity", "segment", "athleteSegment", "trailtour", "trailtourResults"];
    let schemaCreateResults = schemas.map(async schema => {
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
      UnregisteredUsers: "urn:uu:GGALL"
    };

    for (let profileCode in profileMap) {
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
      uuAppErrorMap: uuAppErrorMap
    };
  }

  async loadConfig(awid, session) {
    let config = await this.configDao.get(awid);
    delete config.clientSecret;
    delete config.elevationApiKey;

    const AthleteAbl = require("./athlete-abl");
    let { athlete } = await AthleteAbl.loadMyself(awid, session);

    let trailtours = await this.trailtourDao.list(awid, {}, { state: 1 }, { _id: 1, year: 1, state: 1 });

    return {
      config,
      trailtours: trailtours.itemList,
      athlete
    };
  }

  async updateConfig(awid, dtoIn) {
    // HDS 1
    let validationResult = this.validator.validate("updateConfigDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateConfigUnsupportedKeys.code,
      Errors.UpdateConfig.InvalidDtoIn
    );

    // HDS 2
    let config = await this.configDao.update({ awid, ...dtoIn });

    // HDS 3
    return {
      ...config,
      uuAppErrorMap
    };
  }

  // this is just a utility command to override CORS for different deployments than uuCloud (such as Google Cloud)
  async redirectToPlus4uNetApi(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("redirectToPlus4uNetApiDtoInType", dtoIn);
    // A1, A2
    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.redirectToPlus4uNetApiUnsupportedKeys.code,
      Errors.RedirectToPlus4uNetApi.InvalidDtoIn
    );

    // HDS 2
    let dtoOut;
    if (dtoIn.originalUri === CACHED_PERSONAL_ROLE_CMD) {
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
