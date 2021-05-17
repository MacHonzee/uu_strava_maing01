//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
//@@viewOff:imports

export const ElevationProfile = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ElevationProfile",
    classNames: {
      main: (props, state) => Config.Css.css``,
      tooltip: Config.Css.css`
        padding: 8px;
        border: 1px solid rgb(189, 189, 189);
        background-color: white;
        opacity: 0.9;
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    segment: UU5.PropTypes.object.isRequired,
    drawMapMarker: UU5.PropTypes.func,
    undrawMapMarker: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      elevationProfile: this.props.segment.elevationProfile
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _prepareData(profile, totalLength) {
    let min = profile[0].elevation;
    let max = profile[0].elevation;
    let percentSegments = [];
    let previousDistance, previusElevation;
    let data = profile.map((result, i) => {
      let value = Math.round(result.elevation);
      if (min > value) min = value;
      if (max < value) max = value;
      let percOfDistance = i / profile.length;
      let exactDistance = percOfDistance * totalLength;
      let distance = Math.round(exactDistance);

      // prepare percentage data for colors
      if (previousDistance) {
        let distDiff = exactDistance - previousDistance;
        let elevDiff = result.elevation - previusElevation;
        let elevPerc = Math.floor(Math.abs(elevDiff / distDiff) * 10) / 10;
        let previousSegment = percentSegments[percentSegments.length - 1];
        if (previousSegment && previousSegment.elevationPercent === elevPerc) {
          previousSegment.distance += distDiff;
          previousSegment.elevation += elevDiff;
          previousSegment.distancePerc = percOfDistance;
        } else {
          percentSegments.push({
            distance: distDiff,
            elevationPercent: elevPerc,
            elevation: elevDiff,
            distancePerc: percOfDistance
          });
        }
      }

      previousDistance = exactDistance;
      previusElevation = result.elevation;

      return {
        name: distance,
        value
      };
    });

    if (percentSegments.length > 0) {
      percentSegments.unshift({
        distance: 0,
        elevationPercent: percentSegments[0].elevationPercent,
        elevation: 0,
        distancePerc: 0
      });
    }

    return { min, max, data, percentSegments };
  },

  _prepareTicks(max, min) {
    let diff = max - min;
    let roundedMin = Math.round(min);
    return [
      roundedMin,
      roundedMin + Math.round(diff / 5),
      roundedMin + Math.round((2 * diff) / 5),
      roundedMin + Math.round((3 * diff) / 5),
      roundedMin + Math.round((4 * diff) / 5),
      Math.round(max)
    ];
  },

  _getSegmentColor(segment) {
    switch (segment.elevationPercent) {
      case 0:
        return "green";
      case 0.1:
        return "orange";
      case 0.2:
        return "red";
      default:
        return "black";
    }
  },

  _prepareGradient(percentSegments) {
    let stops = percentSegments.map((segment, i) => {
      let stopPairs = [];
      if (i !== 0 && i !== percentSegments.length - 1) {
        let color = this._getSegmentColor(segment);
        let nextColor = this._getSegmentColor(percentSegments[i + 1]);
        let offset = Math.round(segment.distancePerc * 100) + "%";
        stopPairs.push(<stop key={i + "_this"} offset={offset} stopColor={color} />);
        stopPairs.push(<stop key={i + "_next"} offset={offset} stopColor={nextColor} />);
      }
      return stopPairs;
    });

    return (
      <defs>
        <linearGradient id="profileGradient" x1="0%" y1="0" x2="100%" y2="0">
          {stops}
        </linearGradient>
      </defs>
    );
  },

  _getChart() {
    let profile = this.state.elevationProfile;
    let totalLength = this.props.segment.distance;

    let { min, max, data, percentSegments } = this._prepareData(profile, totalLength);
    let ticks = this._prepareTicks(max, min);
    let gradient = this._prepareGradient(percentSegments);

    // TODO lazyload na grafy
    return (
      <UU5.Chart.ResponsiveContainer height={300}>
        <UU5.Chart.AreaChart data={data} onMouseMove={this._handleMouseMove} onMouseLeave={this._handleMouseLeave}>
          {gradient}
          <UU5.Chart.XAxis dataKey="name" type={"number"} tickCount={20} unit={" m"} domain={[0, "dataMax"]} />
          <UU5.Chart.YAxis domain={["dataMin - 5", "dataMax + 5"]} ticks={ticks} unit={" m"} />
          <UU5.Chart.Area
            type={"linear"}
            dataKey={"value"}
            fill="url(#profileGradient)"
            stroke="url(#profileGradient)"
          />
          <UU5.Chart.Tooltip content={this._formatTooltip} />
        </UU5.Chart.AreaChart>
      </UU5.Chart.ResponsiveContainer>
    );
  },

  _formatTooltip(data) {
    if (data.active) {
      return (
        <div className={this.getClassName("tooltip")}>
          {UU5.Common.Tools.formatNumber(data.label)}&nbsp;m
          <br />
          {data.payload[0].value}&nbsp;m.n.m.
        </div>
      );
    }
    return null;
  },

  // _handleClick(data, event) {
  // console.log(data, event);
  // },

  _handleMouseMove(data) {
    requestAnimationFrame(() => {
      if (data.activeTooltipIndex != null) {
        let coords = this.state.elevationProfile[data.activeTooltipIndex].location;
        this.props.drawMapMarker([coords.lat, coords.lng]);
      } else {
        this.props.undrawMapMarker();
      }
    });
  },

  _handleMouseLeave() {
    this.props.undrawMapMarker();
  },

  _getLoader() {
    return (
      <UU5.Common.DataManager onLoad={Calls.calculateElevation} data={{ stravaId: this.props.segment.stravaId }}>
        {data => (
          <LoadFeedback {...data}>
            {data.data && (this.setState({ elevationProfile: data.data.elevationProfile }) || "loaded")}
          </LoadFeedback>
        )}
      </UU5.Common.DataManager>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.state.elevationProfile ? this._getChart() : this._getLoader();
  }
  //@@viewOff:render
});

export default ElevationProfile;
