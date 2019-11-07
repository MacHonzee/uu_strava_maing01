/* eslint-disable */

const initDtoInType = shape({
  authoritiesUri: uri().isRequired(),
  configuration: shape({
    clientId: string().isRequired(),
    clientSecret: string().isRequired()
  }).isRequired()
});
