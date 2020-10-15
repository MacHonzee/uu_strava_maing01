//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

export const InteractiveResultChartPanel = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "InteractiveResultChartPanel",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    results: UU5.PropTypes.array.isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    header: UU5.PropTypes.node,
    xAxis: UU5.PropTypes.oneOf(["chronological", "dayOfWeek"]).isRequired,
    xAxisGroup: UU5.PropTypes.oneOf([""]) // TODO zde pokračovat
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
    return <UU5.Bricks.Panel {...this.getMainPropsToPass()}>Component {this.getTagName()}</UU5.Bricks.Panel>;
  }
  //@@viewOff:render
});

export default InteractiveResultChartPanel;
