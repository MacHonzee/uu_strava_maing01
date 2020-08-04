//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteTourCard from "./athlete-tour-card";
import AthleteTourResultList from "./athlete-tour-result-list";
import TrailtourMap from "../bricks/trailtour-map";
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
    let ttData = this.props.data.trailtour;
    let newTtData = {
      year: ttData.year,
      totalResults: {
        menResults: ttData.totalResults.menResults[0],
        menResultsTotal: ttData.totalResults.menResultsTotal,
        womenResults: ttData.totalResults.womenResults[0],
        womenResultsTotal: ttData.totalResults.womenResultsTotal
      }
    };

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <AthleteTourCard data={newTtData} athleteResults={this.props.data.athleteResults} />
        <TrailtourMap
          style={{ marginTop: "8px" }}
          mapConfig={ttData.mapConfig}
          segments={this.props.data.athleteResults}
          showOwnResults
        />
        <AthleteTourResultList data={this.props.data.athleteResults} sex={this.props.sex} trailtour={ttData} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default AthleteTourResults;
