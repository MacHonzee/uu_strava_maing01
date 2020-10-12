//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import withSetMenuItem from "../bricks/with-set-menu-item";
import BrickTools from "../bricks/tools";
import ResultsTimestamp from "../trailtour/results-timestamp";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
import TrailtourRunsReady from "../trailtour/trailtour-runs-ready";
import DateRangeFilterBar from "../trailtour/date-range-filter-bar";
//@@viewOff:imports

export const TrailtourRuns = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TrailtourRuns",
    classNames: {
      main: (props, state) => Config.Css.css`
        > .uu5-bricks-header:first-child {
          margin-top: 0;
        }

        ${UU5.Utils.ScreenSize.getMaxMediaQueries("xl", "padding: 48px 48px 0 48px;")}
        ${UU5.Utils.ScreenSize.getMaxMediaQueries("m", "padding: 24px 24px 0 24px;")}
        ${UU5.Utils.ScreenSize.getMaxMediaQueries("xs", "padding: 16px 16px 0 16px;")}

        > .uu5-bricks-header > .uu5-common-div {
          display: flex;
          justify-content: space-between;

          ${UU5.Utils.ScreenSize.getMaxMediaQueries("s", `flex-direction: column;`)}
        }
      `
    },
    lsi: {
      header: {
        cs: "Poslední běhy Trailtour %s",
        en: "Last runs of Trailtour %s"
      },
      generatedStamp: {
        cs: "Poslední update: ",
        en: "Last update: "
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      stamp: new Date()
    };
  },

  componentDidMount() {
    let params = this.props.params || {};
    BrickTools.setDocumentTitle({ year: params.year }, "trailtourRuns");
    this.props.setMenuItem("trailtourRuns_" + params.year);
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
    let params = this.props.params || {};
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Div>{this.getLsiComponent("header", null, [params.year])}</UU5.Bricks.Div>
        {this._getUpdateButton(data)}
      </UU5.Bricks.Div>
    );
  },

  _getUpdateButton(data) {
    let params = this.props.params || {};
    if (data.data && data.data.trailtour) {
      return <ResultsTimestamp data={data.data.trailtour} year={params.year} handleReload={this._handleReload} />;
    }
  },

  _handleLoad(dtoIn) {
    let params = this.props.params || {};
    dtoIn.year = params.year;
    ["dateFrom", "dateTo"].forEach(dateKey => {
      if (dtoIn[dateKey] && dtoIn[dateKey] instanceof Date) {
        dtoIn[dateKey] = UU5.Common.Tools.formatDate(dtoIn[dateKey], "Y-mm-dd");
      }
    });
    return Calls.listLastRuns(dtoIn);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let params = this.props.params || {};
    return (
      <UU5.Common.DataManager
        onLoad={this._handleLoad}
        data={DateRangeFilterBar.getDefaultDates()}
        key={params.year + this.state.stamp.toISOString()}
        pessimistic
      >
        {data => {
          return (
            <UU5.Bricks.Container {...this.getMainPropsToPass()} header={this._getHeader(data)} level={3} noSpacing>
              <LoadFeedback {...data}>
                {data.data && <TrailtourRunsReady year={params.year} data={data.data} handleLoad={data.handleLoad} />}
              </LoadFeedback>
            </UU5.Bricks.Container>
          );
        }}
      </UU5.Common.DataManager>
    );
  }
  //@@viewOff:render
});

export default withSetMenuItem(TrailtourRuns);
