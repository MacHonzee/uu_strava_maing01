//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as FlexTiles from "uu5flextilesg01";
UU5.FlexTiles = FlexTiles;
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import Calls from "calls";
import OverallResults from "../trailtour/overall-results";
import BrickTools from "../bricks/tools";
import UpdateTrailtourButton from "../trailtour/update-trailtour-button";
import ResultsTimestamp from "../trailtour/results-timestamp";
//@@viewOff:imports

export const Trailtour = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Trailtour",
    classNames: {
      main: (props, state) => Config.Css.css`
        > .uu5-bricks-header > .uu5-common-div {
          display: flex;
          justify-content: space-between;

          ${UU5.Utils.ScreenSize.getMaxMediaQueries("s", `flex-direction: column;`)}
        }
      `
    },
    lsi: {
      header: {
        cs: "Průběžné výsledky Trailtour %s"
      },
      generatedStamp: {
        cs: "Poslední update: ",
        en: "Last update: "
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

  componentDidMount() {
    BrickTools.setDocumentTitle({ year: this.props.year }, "overallResults");
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
    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Div>{this.getLsiComponent("header", null, [this.props.year])}</UU5.Bricks.Div>
        {this._getUpdateButton(data)}
      </UU5.Bricks.Div>
    );
  },

  _getUpdateButton(data) {
    if (data.data) {
      return <ResultsTimestamp data={data.data} year={this.props.year} handleReload={this._handleReload} />;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.DataManager
        onLoad={Calls.getTrailtour}
        data={{ year: this.props.year }}
        key={this.props.year + this.state.stamp.toISOString()}
      >
        {data => (
          <UU5.Bricks.Container {...this.getMainPropsToPass()} header={this._getHeader(data)} level={3}>
            <LoadFeedback {...data}>
              {data.data && (
                <OverallResults data={data.data} year={this.props.year} handleReload={this._handleReload} />
              )}
            </LoadFeedback>
          </UU5.Bricks.Container>
        )}
      </UU5.Common.DataManager>
    );
  }
  //@@viewOff:render
});

export default Trailtour;
