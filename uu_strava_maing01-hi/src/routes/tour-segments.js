//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import OverallResults from "../trailtour/overall-results";
import Calls from "calls";
//@@viewOff:imports

export const TourSegments = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourSegments",
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
    year: UU5.PropTypes.string.isRequired
  },
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Container
        {...this.getMainPropsToPass()}
        header={this.getLsiComponent("header", null, [this.props.year])}
        level={3}
        key={this.props.year}
      >
        <UU5.Common.DataManager onLoad={Calls.getTrailtour} data={{ year: this.props.year }}>
          {data => (
            <LoadFeedback {...data}>
              {data.data && (
                <UU5.Bricks.Pre>{JSON.stringify(data.data, null, 2)}</UU5.Bricks.Pre>
              )}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default TourSegments;
