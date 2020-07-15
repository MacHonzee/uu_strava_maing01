const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper: UuValidationHelper } = require("uu_appg01_server").AppServer;

class ValidationHelper {
  constructor() {
    this.validator = Validator.load();
  }

  validate(warnings, errors, entity, useCase, dtoIn) {
    const dtoInType = `${entity}${useCase[0].toUpperCase()}${useCase.slice(1)}DtoInType`;
    const warning = warnings[`${useCase}UnsupportedKeys`];
    const error = errors[`${useCase[0].toUpperCase()}${useCase.slice(1)}`];

    let validationResult = this.validator.validate(dtoInType, dtoIn);
    return UuValidationHelper.processValidationResult(dtoIn, validationResult, warning.code, error.InvalidDtoIn);
  }
}

module.exports = new ValidationHelper();
