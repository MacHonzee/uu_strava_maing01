"use strict";
import * as UU5 from "uu5g04";
const AthleteTourStatistics = UU5.Common.Component.lazy(async () => {
  await window.SystemJS.import("uu5chartg01");
  return import("./athlete-tour-statistics");
});
//@@viewOff:imports

function AthleteTourStatisticsLazy(props) {
  return (
    <UU5.Common.Suspense fallback={<UU5.Bricks.Loading />}>
      <AthleteTourStatistics {...props} />
    </UU5.Common.Suspense>
  );
}

export default AthleteTourStatisticsLazy;
