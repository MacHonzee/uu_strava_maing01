//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "../config/config.js";
import SegmentListContext from "../../context/segment-list-context";
//@@viewOff:imports

const SegmentTile = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SegmentsTile",
    classNames: {
      main: Config.Css.css`
        position: relative;
        width: 99%;
        float: left;
        padding: 8px;
      `,
      row: Config.Css.css`
        padding-bottom: 8px;

        .uu5-bricks-icon {
          font-size: 18px;
          margin-right: 8px;
        }
      `,
      actionButton: Config.Css.css`
        position: absolute;
        top: 8px;
        right: 8px;
      `
    },
    lsi: {
      unspecifiedClimb: {
        cs: "Nespecifikováno",
        en: "Unspecified"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      callFeedback: "ready"
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getName() {
    let icon;
    switch (this.props.activityType) {
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
        <UU5.Bricks.Icon icon={icon} />
        {this.props.segment.name}
      </UU5.Bricks.Link>
    );
  },

  _getDistance() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-map-marker-distance"} />
        <UU5.Bricks.Number value={Math.round(this.props.segment.distance)} /> m
      </UU5.Bricks.Span>
    );
  },

  _getElevation() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Icon icon={"mdi-elevation-rise"} />
        <UU5.Bricks.Number value={Math.round(this.props.segment.total_elevation_gain)} /> m
      </UU5.Bricks.Span>
    );
  },

  _getClimbCategory() {
    if (!this.props.segment.climb_category) {
      return this.getLsiComponent("unspecifiedClimb");
    }
    let content = [];
    for (let i = 0; i < this.props.segment.climb_category; i++) {
      content.push(<UU5.Bricks.Icon icon={"mdi-slope-uphill"} key={i} />);
    }
    return content;
  },

  _getOwnPrDate() {
    let ownLeaderboard = this.props.ownLeaderboard;
    if (!ownLeaderboard) return "-";
    return <UU5.Bricks.DateTime value={ownLeaderboard.start_date} />;
  },

  _getOwnRank() {
    let ownLeaderboard = this.props.ownLeaderboard;
    if (!ownLeaderboard) return "-";
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Number value={ownLeaderboard.rank} /> /{" "}
        <UU5.Bricks.Number value={this.props.segment.athlete_count} />
      </UU5.Bricks.Span>
    );
  },

  _getOwnElapsedTime() {
    return this._formatDuration(this.props.athleteSegmentStats.pr_elapsed_time);
  },

  _getOwnPace() {
    return this._getPace(this.props.athleteSegmentStats.pr_elapsed_time);
  },

  _getFirstRankDate() {
    let firstLeaderboard = this.props.segment.firstLeaderboard;
    if (!firstLeaderboard) return "-";
    return <UU5.Bricks.DateTime value={firstLeaderboard.start_date} />;
  },

  _getFirstRank() {
    return (
      <UU5.Bricks.Span>
        <UU5.Bricks.Number value={1} /> / <UU5.Bricks.Number value={this.props.segment.athlete_count} />
      </UU5.Bricks.Span>
    );
  },

  _getFirstElapsedTime() {
    let firstLeaderboard = this.props.segment.firstLeaderboard;
    if (!firstLeaderboard) return "-";
    return this._formatDuration(firstLeaderboard.elapsed_time);
  },

  _getFirstPace() {
    let firstLeaderboard = this.props.segment.firstLeaderboard;
    if (!firstLeaderboard) return "-";
    return this._getPace(firstLeaderboard.elapsed_time);
  },

  _formatDuration(seconds) {
    let hours = Math.round(seconds / 3600);
    let secondsLeft = seconds % 3600;
    let minutes = Math.round(secondsLeft / 60);
    let lastSeconds = secondsLeft % 60;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}:${lastSeconds < 10 ? "0" + lastSeconds : lastSeconds}`;
  },

  _getPace(seconds) {
    switch (this.props.activityType) {
      case "Ride":
      case "NordicSki": {
        let speed = +(this.props.segment.distance / (seconds / 3.6)).toFixed(2);
        return speed + " km/h";
      }
      case "Run":
      case "Hike":
      default: {
        let pace = +(seconds / 60 / (this.props.segment.distance / 1000)).toFixed(2);
        let mins = Math.round(pace);
        let lastSeconds = Math.round((pace % 1) * 60);
        return `${mins < 10 ? "0" + mins : mins}:${lastSeconds < 10 ? "0" + lastSeconds : lastSeconds}/km`;
      }
    }
  },

  _handleSegmentRefreshOne(handleUpdate) {
    this._updatedItem = true;
    handleUpdate(
      this.props.id,
      {
        stravaId: this.props.stravaId,
        force: true
      },
      true,
      null,
      "refreshOne"
    )
      .then(result => {
        this._updatedItem = false;
        return result;
      })
      .catch(result => {
        this._updatedItem = false;
        return result;
      });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let rowClass = this.getClassName("row");
    return (
      <SegmentListContext.Consumer>
        {({ viewState, handleUpdate }) => {
          return (
            <UU5.Bricks.Card {...this.getMainPropsToPass()} disabled={this._updatedItem && viewState === "update"}>
              <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
                <UU5.Bricks.Div className={rowClass}>{this._getName()}</UU5.Bricks.Div>
                <UU5.Bricks.Div className={rowClass}>{this.props.segment.city}</UU5.Bricks.Div>
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
                <UU5.Bricks.Div className={rowClass}>{this._getOwnPace()}</UU5.Bricks.Div>
              </UU5.Bricks.Column>

              <UU5.Bricks.Column colWidth={"s-3 xs-12"}>
                <UU5.Bricks.Div className={rowClass}>{this._getFirstRankDate()}</UU5.Bricks.Div>
                <UU5.Bricks.Div className={rowClass}>{this._getFirstRank()}</UU5.Bricks.Div>
                <UU5.Bricks.Div className={rowClass}>{this._getFirstElapsedTime()}</UU5.Bricks.Div>
                <UU5.Bricks.Div className={rowClass}>{this._getFirstPace()}</UU5.Bricks.Div>
              </UU5.Bricks.Column>

              <UU5.Bricks.Button
                className={this.getClassName("actionButton")}
                content={<UU5.Bricks.Icon icon={"mdi-reload"} />}
                onClick={() => this._handleSegmentRefreshOne(handleUpdate)}
              />
            </UU5.Bricks.Card>
          );
        }}
      </SegmentListContext.Consumer>
    );
  }
  //@@viewOff:render
});

export default SegmentTile;
