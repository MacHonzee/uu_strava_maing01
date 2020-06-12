//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as FlexTiles from "uu5flextilesg01";
UU5.FlexTiles = FlexTiles;
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
import OverallResults from "../trailtour/overall-results";
//@@viewOff:imports

export const Trailtour = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Trailtour",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      header: {
        cs: "Průběžné výsledky Trailtour %s"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    year: UU5.PropTypes.string
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Container
        {...this.getMainPropsToPass()}
        header={this.getLsiComponent("header", null, [this.props.year])}
        level={3}
        key={this.props.year + this.state.stamp.toISOString()}
      >
        <UU5.Common.DataManager onLoad={Calls.getTrailtour} data={{ year: this.props.year }}>
          {data => (
            <LoadFeedback {...data}>
              {data.data && <OverallResults data={data.data} year={this.props.year} handleReload={this._handleReload} />}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default Trailtour;
