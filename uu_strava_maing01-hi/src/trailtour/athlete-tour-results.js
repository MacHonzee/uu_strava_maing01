//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteTourCard from "./athlete-tour-card";
import AthleteTourResultList from "./athlete-tour-result-list";
//@@viewOff:imports

export const AthleteTourResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourResults",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired
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
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <AthleteTourCard data={this.props.data.trailtour} athleteResults={this.props.data.athleteResults} />
        <AthleteTourResultList data={this.props.data.athleteResults} sex={this.props.sex} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default AthleteTourResults;
