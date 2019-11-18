//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "../config/config.js";
import "./segment-tile.less";
//@@viewOff:imports

const SegmentTile = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SegmentsTile",
    classNames: {
      main: Config.CSS + "segments-tile",
      row: Config.CSS + "segments-tile-row"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getName() {
    let icon;
    switch (this.props.activity_type) {
      case "Ride":
        icon = "mdi-bike";
        break;
      case "Run":
        icon = "mdi-run-fast";
        break;
      case "Hike":
        icon = "mdi-walk";
        break;
      case "NordicSki":
        icon = "mdi-pause";
        break;
      default:
        icon = "mdi-account-question";
    }

    return (
      <UU5.Bricks.Link href={`https://www.strava.com/segments/${this.props.stravaId}?filter=overall`} target={"_blank"}>
        <UU5.Bricks.Icon icon={icon}/>
        {this.props.name}
      </UU5.Bricks.Link>
    );
  },

  _getDistance() {
    // FIXME tohle je špatně, např na Furesøstien - mod Farum/Marinaen
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-map-marker-distance"}/>
        <UU5.Bricks.Number value={Math.round(this.props.distance)}/> m
      </UU5.Bricks.Span>
    );
  },

  _getElevation() {
    // FIXME tohle je špatně, např na Furesøstien - mod Farum/Marinaen
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-elevation-rise"}/>
        <UU5.Bricks.Number value={Math.round(this.props.total_elevation_gain)}/> m
      </UU5.Bricks.Span>
    );
  },

  _getClimbCategory() {
    return (
      <UU5.Bricks.Number value={this.props.climb_category}/>
    );
  },

  _getOwnPrDate() {
    let ownLeaderboard = this.props.own_leaderboard;
    if (!ownLeaderboard) return "-";
    return (
      <UU5.Bricks.DateTime value={ownLeaderboard.start_date}/>
    );
  },

  _getOwnRank() {
    // FIXME tohle je špatně, např na Furesøstien - mod Farum/Marinaen
    let ownLeaderboard = this.props.own_leaderboard;
    if (!ownLeaderboard) return "-";
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Number value={ownLeaderboard.rank}/> / <UU5.Bricks.Number value={this.props.athlete_count}/>
      </UU5.Bricks.Span>
    );
  },

  _getOwnElapsedTime() {
    return (
      this._formatDuration(this.props.athlete_segment_stats.pr_elapsed_time)
    );
  },

  _getFirstRankDate() {
    let firstLeaderboard = this.props.first_leaderboard;
    if (!firstLeaderboard) return "-";
    return (
      <UU5.Bricks.DateTime value={firstLeaderboard.start_date}/>
    );
  },

  _getFirstRank() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Number value={1}/> / <UU5.Bricks.Number value={this.props.athlete_count}/>
      </UU5.Bricks.Span>
    );
  },

  _getFirstElapsedTime() {
    let firstLeaderboard = this.props.first_leaderboard;
    if (!firstLeaderboard) return "-";
    return (
      this._formatDuration(firstLeaderboard.elapsed_time)
    );
  },

  _formatDuration(seconds) {
    let hours = Math.round(seconds / 3600);
    let secondsLeft = seconds % 3600;
    let minutes = Math.round(secondsLeft / 60);
    let lastSeconds = secondsLeft % 60;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${lastSeconds < 10 ? "0" + lastSeconds : lastSeconds}`
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let rowClass = this.getClassName("row");
    return (
      <UU5.Bricks.Card {...this.getMainPropsToPass()}>
        <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
          <UU5.Bricks.Div className={rowClass}>{this._getName()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this.props.city}</UU5.Bricks.Div>
        </UU5.Bricks.Column>

        <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
          <UU5.Bricks.Div className={rowClass}>{this._getDistance()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getElevation()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getClimbCategory()}</UU5.Bricks.Div>
        </UU5.Bricks.Column>

        <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
          <UU5.Bricks.Div className={rowClass}>{this._getOwnPrDate()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getOwnRank()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getOwnElapsedTime()}</UU5.Bricks.Div>
        </UU5.Bricks.Column>

        <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
          <UU5.Bricks.Div className={rowClass}>{this._getFirstRankDate()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getFirstRank()}</UU5.Bricks.Div>
          <UU5.Bricks.Div className={rowClass}>{this._getFirstElapsedTime()}</UU5.Bricks.Div>
        </UU5.Bricks.Column>
      </UU5.Bricks.Card>
    );
  }
  //@@viewOff:render
});

export default SegmentTile;
