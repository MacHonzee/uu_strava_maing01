/* eslint-disable */

const refreshOneDtoInType = shape({
  stravaId: number().isRequired(),
  force: boolean().isRequired(),
  token: string(),
  athlete: shape({
    firstname: string().isRequired(),
    lastname: string().isRequired()
  })
});

const segmentListDtoInType = shape({
  activityType: oneOf(["Run", "Ride", "Hike"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
