//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import LoadFeedback from "../bricks/load-feedback";
import BrickTools from "../bricks/tools";
//@@viewOff:imports

export const AthleteComparison = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparison",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      header: {
        cs: "Porovnání výsledků",
        en: "Results comparison"
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
  _saveTitle(data) {
    console.log(data);
    BrickTools.setDocumentTitle(data, "athleteComparison");
    return true;
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
        key={params.firstAthlete}
      >
        <UU5.Common.DataManager
          onLoad={Calls.listAthleteResults}
          data={{ year: params.year, stravaIdList: [params.first, params.second] }}
        >
          {data => <LoadFeedback {...data}>{data.data && this._saveTitle(data.data) && "loaded"}</LoadFeedback>}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default AthleteComparison;
