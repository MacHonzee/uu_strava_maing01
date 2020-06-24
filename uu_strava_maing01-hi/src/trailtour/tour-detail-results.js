//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TourDetailCard from "./tour-detail-card";
import TourDetailResultList from "./tour-detail-result-list";
import TrailtourMap from "../bricks/trailtour-map";
//@@viewOff:imports

export const TourDetailResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourDetailResults",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired
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
  _getMap() {
    let { segment, tourDetail } = this.props.data;
    let mapConfig = {
      zoom: 12,
      center: segment.start_latlng
    };
    let mapSegment = { ...tourDetail, segment };
    return <TrailtourMap style={{ marginTop: "8px" }} mapConfig={mapConfig} segments={[mapSegment]} showTourDetail />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <TourDetailCard data={this.props.data} />
        {this._getMap()}
        <TourDetailResultList data={this.props.data} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TourDetailResults;
