/* eslint-disable */
const trailtourSetupDtoInType = shape({
  year: number().isRequired(),
  baseUri: uri().isRequired(),
  totalResultsUri: uri().isRequired()
});

const trailtourUpdateDtoInType = shape({
  year: number().isRequired(),
});

const trailtourGetDtoInType = shape({
  year: number().isRequired(),
});

const trailtourGetTourDetailDtoInType = shape({
  id: id().isRequired(),
});

const trailtourGetAthleteResultsDtoInType = shape({
  year: number().isRequired(),
  athleteStravaId: number().isRequired()
});
