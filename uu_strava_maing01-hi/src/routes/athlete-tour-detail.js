//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
import AthleteTourResults from "../trailtour/athlete-tour-results";
import BrickTools from "../bricks/tools";
//@@viewOff:imports

export const AthleteTourDetail = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourDetail",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      header: {
        cs: "Výsledky atleta",
        en: "Athlete results"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
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
  _getSex(data) {
    let totalResults = data.trailtour.totalResults;
    return totalResults.womenResults ? "female" : "male";
  },

  _addPaceToResults(results) {
    results.forEach(result => {
      let distance = result.segment.distance;
      ["womenResults", "menResults"].forEach(resultKey => {
        if (!result[resultKey]) return;

        result[resultKey].forEach(athlResult => {
          let seconds = athlResult.time;
          athlResult.pace = BrickTools.countPace(seconds, distance);
        });
      });
    });
    return results;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let params = this.props.params || {};
    return (
      <UU5.Bricks.Container
        {...this.getMainPropsToPass()}
        header={this.getLsiComponent("header")}
        level={3}
        key={params.stravaId}
      >
        <UU5.Common.DataManager
          onLoad={Calls.getAthleteTourResults}
          data={{ year: params.year, athleteStravaId: params.stravaId }}
        >
          {data => (
            <LoadFeedback {...data}>
              {data.data && this._addPaceToResults(data.data.athleteResults) && (
                <AthleteTourResults data={data.data} sex={this._getSex(data.data)} />
              )}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default AthleteTourDetail;
