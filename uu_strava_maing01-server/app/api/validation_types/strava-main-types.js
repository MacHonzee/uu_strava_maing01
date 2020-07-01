/* eslint-disable */

const initDtoInType = shape({
  authoritiesUri: uri().isRequired(),
  configuration: shape({
    clientId: string().isRequired(),
    clientSecret: string().isRequired(),
    googleApiKey: string().isRequired()
  }).isRequired()
});

const updateConfigDtoInType = shape({
  clientId: string(),
  clientSecret: string(),
  googleApiKey: string()
});

const redirectToPlus4uNetApiDtoInType = shape({
  originalUri: uri().isRequired(),
  originalData: any()
});
