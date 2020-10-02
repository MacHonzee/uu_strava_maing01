/* eslint-disable */

const CURRENT_TRAILTOURS = ["2020_CZ", "2020_SK"];
const ALL_TRAILTOURS = ["2020_CZ", "2020_SK", "2019"];
const STATE_LIST = ["active", "closed"];

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
  force: boolean()
});

const trailtourUpdateConfigDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
  state: oneOf(STATE_LIST),
  mapConfig: shape({
    zoom: number().isRequired(),
    center: array(number(), 2, 2).isRequired()
  })
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

const trailtourDownloadGpxDtoInType = shape({
  gpxLink: uri().isRequired()
});

const trailtourListAthletesDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
});

const trailtourListAthleteResultsDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
  stravaIdList: array(number(), 1, 2).isRequired()
});

const trailtourListClubResultsDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
  clubNameList: array(string(), 1, 2).isRequired()
});

const trailtourListLastRunsDtoInType = shape({
  year: oneOf(ALL_TRAILTOURS).isRequired(),
  dateFrom: date().isRequired(),
  dateTo: date().isRequired()
});
