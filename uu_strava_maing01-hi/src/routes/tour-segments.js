//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
import OverallSegments from "../trailtour/overall-segments";
import UpdateTrailtourButton from "../trailtour/update-trailtour-button";
import TrailtourMap from "../bricks/trailtour-map";
//@@viewOff:imports

export const TourSegments = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourSegments",
    classNames: {
      main: (props, state) => Config.Css.css`
        > .uu5-bricks-header > .uu5-common-div {
          display: flex;
          justify-content: space-between;

          ${UU5.Utils.ScreenSize.getMaxMediaQueries("s", `flex-direction: column;`)}
        }
      `
    },
    lsi: {
      header: {
        cs: "Etapy Trailtour %s",
        en: "Trailtour %s segments"
      },
      generatedStamp: {
        cs: "Poslední update: ",
        en: "Last update: "
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    year: UU5.PropTypes.string.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      stamp: new Date()
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleReload() {
    // easiest way to force complete reload including UU5.Bricks.Loading
    this.setState({ stamp: new Date() });
  },

  _getHeader(data) {
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Div>{this.getLsiComponent("header", null, [this.props.year])}</UU5.Bricks.Div>
        {this._getUpdateButton(data)}
      </UU5.Bricks.Div>
    );
  },

  _getUpdateButton(data) {
    return (
      // TODO refactor to component
      <UU5.Bricks.Div>
        <UU5.Bricks.Span style={{ fontSize: "12px", fontStyle: "italic", marginRight: "8px" }}>
          {this.getLsiComponent("generatedStamp")}
          {data.data && <UU5.Bricks.DateTime value={data.data.trailtour.lastUpdate} secondsDisabled />}
        </UU5.Bricks.Span>
        <UU5.Bricks.Authenticated authenticated>
          <UpdateTrailtourButton year={this.props.year} onUpdateDone={this._handleReload} />
        </UU5.Bricks.Authenticated>
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.DataManager onLoad={Calls.getTourSegments} data={{ year: this.props.year }}>
        {data => {
          return (
            <UU5.Bricks.Container
              {...this.getMainPropsToPass()}
              header={this._getHeader(data)}
              level={3}
              key={this.props.year + this.state.stamp.toISOString()}
            >
              <LoadFeedback {...data}>
                {data.data && (
                  <UU5.Bricks.Div>
                    <TrailtourMap mapConfig={data.data.trailtour.mapConfig} segments={data.data.tourSegments} />
                    <OverallSegments data={data.data} year={this.props.year} handleReload={this._handleReload} />
                  </UU5.Bricks.Div>
                )}
              </LoadFeedback>
            </UU5.Bricks.Container>
          );
        }}
      </UU5.Common.DataManager>
    );
  }
  //@@viewOff:render
});

export default TourSegments;
