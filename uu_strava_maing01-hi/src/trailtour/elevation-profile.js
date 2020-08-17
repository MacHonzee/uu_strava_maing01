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
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    segment: UU5.PropTypes.object.isRequired
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
  _getChart() {
    let profile = this.state.elevationProfile;
    let totalLength = this.props.segment.distance;

    let min = profile[0].elevation;
    let max = profile[0].elevation;
    let data = profile.map((result, i) => {
      let value = Math.round(result.elevation);
      if (min > value) min = value;
      if (max < value) max = value;
      let label = Math.round(((i + 1) / profile.length) * totalLength);

      return {
        name: label,
        value
      };
    });

    console.log(min, max);
    let diff = max - min;
    let ticks = [
      min,
      min + Math.round(diff / 5),
      min + Math.round((2 * diff) / 5),
      min + Math.round((3 * diff) / 5),
      min + Math.round((4 * diff) / 5),
      max
    ];

    // TODO lazyload na grafy
    return (
      <UU5.Chart.ResponsiveContainer height={300}>
        <UU5.Chart.LineChart data={data} onClick={this._handleClick}>
          <UU5.Chart.XAxis dataKey="name" type={"number"} tickCount={20} unit={" m"} domain={[0, "dataMax"]} />
          <UU5.Chart.YAxis domain={["dataMin - 5", "dataMax + 5"]} ticks={ticks} unit={" m"} />
          <UU5.Chart.Line type={"linear"} dataKey={"value"} dot={false} />
          <UU5.Chart.Tooltip />
        </UU5.Chart.LineChart>
      </UU5.Chart.ResponsiveContainer>
    );
  },

  _handleClick(data, event) {
    console.log(data, event);
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
