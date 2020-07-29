//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import CompareResultsHoc from "./compare-results-hoc";
//@@viewOff:imports

export const CompareResultsButton = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "CompareResultsButton",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      label: {
        cs: "Porovnat výsledky",
        en: "Compare results"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    firstAthlete: UU5.PropTypes.object,
    handleCompare: UU5.PropTypes.func // from HoC
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
      <UU5.Bricks.Button
        {...this.getMainPropsToPass()}
        onClick={this.props.handleCompare}
        colorSchema={"orange"}
        bgStyle={"filled"}
      >
        {this.getLsiComponent("label")}
      </UU5.Bricks.Button>
    );
  }
  //@@viewOff:render
});

export default CompareResultsHoc(CompareResultsButton);
