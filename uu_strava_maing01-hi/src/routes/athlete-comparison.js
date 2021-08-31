//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import LoadFeedback from "../bricks/load-feedback";
import BrickTools from "../bricks/tools";
import AthleteComparisonReady from "../trailtour/athlete-comparison-ready";
import withSetMenuItem from "../bricks/with-set-menu-item";
//@@viewOff:imports

export const AthleteComparison = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparison",
    classNames: {
      main: (props, state) => Config.Css.css`
        .uu5-bricks-header:first-child {
          margin-top: 0;
        }

        ${UU5.Utils.ScreenSize.getMaxMediaQueries("xl", "padding: 48px 48px 0 48px;")}
        ${UU5.Utils.ScreenSize.getMaxMediaQueries("m", "padding: 24px 24px 0 24px;")}
        ${UU5.Utils.ScreenSize.getMaxMediaQueries("xs", "padding: 16px 16px 0 16px;")}
      `,
    },
    lsi: {
      header: {
        cs: "Porovnání výsledků",
        en: "Results comparison",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    let params = this.props.params || {};
    this.props.setMenuItem("trailtour_" + params.year);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _saveTitle(data) {
    BrickTools.setDocumentTitle(data, "athleteComparison");
    return true;
  },

  _addPaceToResults(results) {
    results.forEach((result) => {
      let distance = result.segment.distance;
      ["womenResults", "menResults"].forEach((resultKey) => {
        if (!result[resultKey]) return;

        result[resultKey].forEach((athlResult) => {
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
    let stravaIdList = [parseInt(params.first), parseInt(params.second)];
    return (
      <UU5.Bricks.Container
        {...this.getMainPropsToPass()}
        header={this.getLsiComponent("header")}
        level={3}
        key={`${params.first}_${params.second}`}
        noSpacing
      >
        <UU5.Common.DataManager onLoad={Calls.listAthleteResults} data={{ year: params.year, stravaIdList }}>
          {(data) => (
            <LoadFeedback {...data}>
              {data.data && this._saveTitle(data.data) && this._addPaceToResults(data.data.athleteResults) && (
                <AthleteComparisonReady
                  trailtour={data.data.trailtour}
                  results={data.data.athleteResults}
                  stravaIdList={stravaIdList}
                />
              )}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  },
  //@@viewOff:render
});

export default withSetMenuItem(AthleteComparison);
