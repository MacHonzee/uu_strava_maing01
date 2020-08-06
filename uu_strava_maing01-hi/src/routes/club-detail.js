//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import withSetMenuItem from "../bricks/with-set-menu-item";
import BrickTools from "../bricks/tools";
import LoadFeedback from "../bricks/load-feedback";
import AthleteTourResults from "../trailtour/athlete-tour-results";
import ClubTourResults from "../trailtour/club-tour-results";
//@@viewOff:imports

export const ClubDetail = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ClubDetail",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      header: {
        cs: "Výsledky klubu",
        en: "Club results"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    let params = this.props.params || {};
    this.props.setMenuItem("trailtourClubs_" + params.year);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _saveTitle(data) {
    BrickTools.setDocumentTitle(data, "clubDetail");
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
        key={params.name}
      >
        <UU5.Common.DataManager
          onLoad={Calls.listClubResults}
          data={{ year: params.year, clubNameList: [params.name] }}
        >
          {data => (
            <LoadFeedback {...data}>
              {data.data && this._saveTitle(data.data) && <ClubTourResults data={data.data} />}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default withSetMenuItem(ClubDetail);
