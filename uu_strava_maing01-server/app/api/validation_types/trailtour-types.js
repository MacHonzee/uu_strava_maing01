/* eslint-disable */

const CURRENT_TRAILTOURS = ["2020_CZ", "2020_SK"];
const ALL_TRAILTOURS = ["2020_CZ", "2020_SK", "2019"]

const trailtourSetupDtoInType = shape({
  year: oneOf(CURRENT_TRAILTOURS).isRequired(),
  baseUri: uri().isRequired(),
  totalResultsUri: uri().isRequired(),
  mapConfig: shape({
    zoom: number().isRequired(),
    center: array(number(), 2, 2).isRequired()
  }).isRequired()
});

const trailtourUpdateDtoInType = shape({
  year: oneOf(CURRENT_TRAILTOURS).isRequired(),
});

const trailtourGetDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
});

const trailtourGetSegmentsDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
});

const trailtourGetTourDetailDtoInType = shape({
  id: id().isRequired()
});

const trailtourGetAthleteResultsDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
  athleteStravaId: number().isRequired()
});
