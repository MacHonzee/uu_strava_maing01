"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { SysProfileModel } = require("uu_appg01_server").Workspace;
const Errors = require("../api/errors/strava-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`
  }
};

class StravaMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.configDao = DaoFactory.getDao("stravaMain");
    this.athleteDao = DaoFactory.getDao("athlete");
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
    const schemas = ["stravaMain", "athlete", "activity", "segment"];
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
    try {
      await SysProfileModel.setProfile(awid, { code: "Authorities", roleUri: dtoIn.authoritiesUri });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        // A4
        throw new Errors.Init.SysSetProfileFailed({ uuAppErrorMap }, { role: dtoIn.authoritiesUri }, e);
      }
      throw e;
    }

    // HDS 4
    await this.configDao.create({ awid, ...dtoIn.configuration });

    // HDS 5
    return {
      uuAppErrorMap: uuAppErrorMap
    };
  }

  async loadConfig(awid, session) {
    let config = await this.configDao.get(awid);

    const AthleteAbl = require("./athlete-abl");
    let token = await AthleteAbl.getValidToken(awid, session);

    return {
      clientId: config.clientId,
      stravaTokenValid: !!token.token
    };
  }
}

module.exports = new StravaMainAbl();
