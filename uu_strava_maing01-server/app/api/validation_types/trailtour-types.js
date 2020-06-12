/* eslint-disable */
const trailtourSetupDtoInType = shape({
  year: string().isRequired(),
  baseUri: uri().isRequired(),
  totalResultsUri: uri().isRequired()
});

const trailtourUpdateDtoInType = shape({
  year: string().isRequired(),
});

const trailtourGetDtoInType = shape({
  year: string().isRequired(),
});

const trailtourGetTourDetailDtoInType = shape({
  id: id().isRequired(),
});

const trailtourGetAthleteResultsDtoInType = shape({
  year: string().isRequired(),
  athleteStravaId: number().isRequired()
});
