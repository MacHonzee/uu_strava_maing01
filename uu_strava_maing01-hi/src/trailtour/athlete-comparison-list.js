//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteTourResultList from "./athlete-tour-result-list";
//@@viewOff:imports

export const AthleteComparisonList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparisonList",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    stravaIdList: UU5.PropTypes.array.isRequired
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
    // strava + trailtour
    // etapa + autor
    // délka
    // převýšení
    // Atlet 1 + Pořadí
    // Body
    // Čas + Tempo
    // Atlet 2 + Pořadí
    // Body
    // Čas + Tempo

    return <AthleteTourResultList data={this.props.data} sex={this.props.sex} trailtour={this.props.trailtour} />;
  }
  //@@viewOff:render
});

export default AthleteComparisonList;
