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
    return (
      <UU5.Bricks.Link href={`https://www.strava.com/segments/${this.props.stravaId}?filter=overall`} target={"_blank"}>
        {this.props.name}
      </UU5.Bricks.Link>
    );
  },

  _getDistance() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-map-marker-distance"}/>
        {this.props.distance}
      </UU5.Bricks.Span>
    );
  },

  _getElevation() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-elevation-rise"}/>
        {this.props.total_elevation_gain}
      </UU5.Bricks.Span>
    );
  },

  _getClimbCategory() {
    return (
      <UU5.Bricks.Number value={this.props.climb_category}/>
    );
  },

  _getOwnPrDate() {
    return (
      <UU5.Bricks.DateTime value={this.props.own_leaderboard.start_date}/>
    );
  },

  _getOwnRank() {
    return (
      <UU5.Bricks.Number value={this.props.own_leaderboard.rank}/>
    );
  },

  _getOwnElapsedTime() {
    return (
      this.props.athlete_segment_stats.pr_elapsed_time
    );
  },

  _getFirstRankDate() {
    return (
      <UU5.Bricks.DateTime value={this.props.first_leaderboard.start_date}/>
    );
  },

  _getFirstRank() {
    return (
      <UU5.Bricks.Number value={1}/>
    );
  },

  _getFirstElapsedTime() {
    return (
      this.props.first_leaderboard.elapsed_time
    );
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
          <UU5.Bricks.Div className={rowClass}>{this.props.activity_type}</UU5.Bricks.Div>
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

    // TODO name (link s id), city, activity_type, distance, total_elevation, climb_category,
    // athlete_segment_stats.pr_date, athlete_segment_stats.effort_count, own_leaderboard.rank,
    // athlete_segment_stats.pr_elapsed_time, first_leaderboard.elapsed_time
  }
  //@@viewOff:render
});

export default SegmentTile;
