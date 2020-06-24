//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import LoadFeedback from "../bricks/load-feedback";
import TourDetailResults from "../trailtour/tour-detail-results";
import BrickTools from "../bricks/tools";
//@@viewOff:imports

export const TourDetail = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourDetail",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      header: {
        cs: "Detail etapy",
        en: "Segment detail"
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
  _addPaceToResults(results, segment) {
    let distance = segment.distance;
    ["womenResults", "menResults"].forEach(resultKey => {
      if (!results[resultKey]) return;

      results[resultKey].forEach(athlResult => {
        let seconds = athlResult.time;
        athlResult.pace = BrickTools.countPace(seconds, distance);
      });
    });
    return results;
  },

  _saveTitle(data) {
    BrickTools.setDocumentTitle(data, "tourDetail");
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
        key={params.id}
      >
        <UU5.Common.DataManager onLoad={Calls.getTourDetail} data={{ id: params.id }}>
          {data => (
            <LoadFeedback {...data}>
              {data.data &&
                this._addPaceToResults(data.data.tourDetail, data.data.segment) &&
                this._saveTitle(data.data) && <TourDetailResults data={data.data} />}
            </LoadFeedback>
          )}
        </UU5.Common.DataManager>
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default TourDetail;
