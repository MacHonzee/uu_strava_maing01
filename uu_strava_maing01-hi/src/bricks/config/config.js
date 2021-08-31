import Config from "../../config/config.js";

const TAG = Config.TAG + "Bricks.";

export default {
  ...Config,

  STRAVA_ATHLETE_LINK: "https://www.strava.com/athletes/",
  STRAVA_SEGMENT_LINK: "https://www.strava.com/segments/",
  TAG,
  Css: UU5.Common.Css.createCssModule(
    TAG.replace(/\.$/, "")
      .toLowerCase()
      .replace(/\./g, "-")
      .replace(/[^a-z-]/g, ""),
    process.env.NAME + "/" + process.env.OUTPUT_NAME + "@" + process.env.VERSION // this helps preserve proper order of styles among loaded libraries
  ),
};
