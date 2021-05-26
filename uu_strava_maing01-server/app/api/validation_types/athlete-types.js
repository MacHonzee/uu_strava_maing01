/* eslint-disable */

const athleteCreateDtoInType = shape({
  code: string().isRequired(),
});

const exportActivitiesDtoInType = shape({
  force: boolean().isRequired(),
  after: datetime(),
});
