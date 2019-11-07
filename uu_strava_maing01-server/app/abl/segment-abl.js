"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/segment-error.js");

const WARNINGS = {
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`
  }
};

class SegmentAbl {

  constructor() {
    this.validator = new Validator(Path.join(__dirname, "..", "api", "validation_types", "segment-types.js"));
    this.segmentDao = DaoFactory.getDao("segment");
  }

  async list(awid, dtoIn, session) {
    // HDS 1
    let validationResult = this.validator.validate("segmentListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    let criteria = {
      uuIdentity: session.getIdentity().getUuIdentity(),
      ...dtoIn
    };
    delete criteria.pageInfo;
    let pageInfo = dtoIn.pageInfo || {};
    pageInfo.pageSize = pageInfo.pageSize || 2000;
    pageInfo.pageIndex = pageInfo.pageIndex || 0;
    let items = await this.segmentDao.listByCriteria(awid, criteria, pageInfo);

    return {
      ...items,
      uuAppErrorMap
    };
  }

}

module.exports = new SegmentAbl();
