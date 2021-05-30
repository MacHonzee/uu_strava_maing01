/* eslint-disable */

const segmentCreateDtoInType = shape({
  stravaId: number().isRequired(),
  force: boolean(),
  leaderboard: array(
    shape({
      athlete_name: string().isRequired(),
      elapsed_time: number().isRequired(),
      moving_time: number().isRequired(),
      start_date: datetime().isRequired(),
      start_date_local: datetime().isRequired(),
      rank: number().isRequired(),
    })
  ),
});

const segmentRefreshOneDtoInType = shape({
  stravaId: number().isRequired(),
  force: boolean().isRequired(),
});

const segmentListDtoInType = shape({
  activityType: oneOf(["Run", "Ride", "Hike"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const segmentCalculateElevationDtoInType = shape({
  stravaId: number().isRequired(),
});
