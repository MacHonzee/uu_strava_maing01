//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TourDetailCard from "./tour-detail-card";
import TourDetailResultList from "./tour-detail-result-list";
import TrailtourMap from "../bricks/trailtour-map";
import ElevationProfile from "./elevation-profile";
//@@viewOff:imports

const Lsi = {
  elevationHeader: {
    cs: "Graf převýšení",
    en: "Elevation profile"
  }
};

export const TourDetailResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourDetailResults",
    classNames: {
      main: (props, state) => Config.Css.css``,
      elevationPanel: Config.Css.css`
        .uu5-bricks-panel-header {
          padding: 16px 12px 16px 20px;
          font-family: ClearSans-Medium, sans-serif;
        }
      `
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
  componentDidMount() {
    this.props.setMenuItem("trailtourSegments_" + this.props.data.trailtour.year);
    return true;
  },
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
    return (
      <TrailtourMap
        ref_={inst => (this._map = inst)}
        style={{ marginTop: "8px" }}
        mapConfig={mapConfig}
        segments={[mapSegment]}
        showTourDetail
      />
    );
  },

  _getElevationPanel() {
    return (
      <UU5.Bricks.Panel
        className={this.getClassName("elevationPanel")}
        bgStyleHeader={"underline"}
        bgStyleContent={"underline"}
        iconExpanded={"mdi-chevron-up"}
        iconCollapsed={"mdi-chevron-down"}
        mountContent={"onFirstExpand"}
        header={<UU5.Bricks.Lsi lsi={Lsi.elevationHeader} />}
      >
        <ElevationProfile
          segment={this.props.data.segment}
          drawMapMarker={this._drawMapMarker}
          undrawMapMarker={this._undrawMapMarker}
        />
      </UU5.Bricks.Panel>
    );
  },

  _drawMapMarker(coordsIndex) {
    this._map.drawMapMarker(coordsIndex);
    return this;
  },

  _undrawMapMarker() {
    this._map.undrawMapMarker();
    return this;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <TourDetailCard data={this.props.data} />
        {this._getMap()}
        {this._getElevationPanel()}
        <TourDetailResultList data={this.props.data} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TourDetailResults;
