/* eslint-disable */

const segmentListDtoInType = shape({
  activityType: oneOf(["Run", "Ride", "Hike"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
