/* eslint-disable */
const trailtourSetupDtoInType = shape({
  year: number().isRequired(),
  baseUri: uri().isRequired(),
  totalResultsUri: uri().isRequired()
});

const trailtourUpdateDtoInType = shape({
  year: number().isRequired(),
});
