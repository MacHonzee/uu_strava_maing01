/* eslint-disable */

const createDtoInType = shape({
  stravaId: number().isRequired(),
  force: boolean(),
  leaderboard: array(
    shape({
      athlete_name: string().isRequired(),
      elapsed_time: number().isRequired(),
      moving_time: number().isRequired(),
      start_date: datetime().isRequired(),
      start_date_local: datetime().isRequired(),
      rank: number().isRequired()
    })
  )
});

const refreshOneDtoInType = shape({
  stravaId: number().isRequired(),
  force: boolean().isRequired()
});

const segmentListDtoInType = shape({
  activityType: oneOf(["Run", "Ride", "Hike"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});
