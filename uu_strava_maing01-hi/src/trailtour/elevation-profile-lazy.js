"use strict";
import * as UU5 from "uu5g04";
const ElevationProfile = UU5.Common.Component.lazy(async () => {
  await window.SystemJS.import("uu5chartg01");
  return import("./elevation-profile");
});
//@@viewOff:imports

function ElevationProfileLazy(props) {
  return (
    <UU5.Common.Suspense fallback={<UU5.Bricks.Loading />}>
      <ElevationProfile {...props} />
    </UU5.Common.Suspense>
  );
}

export default ElevationProfileLazy;
