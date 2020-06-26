//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import polyline from "@mapbox/polyline";
import SpaContext from "../context/spa-context";
//@@viewOff:imports

const MARKERS = {
  blue:
    "https://mt.googleapis.com/vt/icon/name=" +
    "icons/onion/SHARED-mymaps-pin-container-bg_4x.png," +
    "icons/onion/SHARED-mymaps-pin-container_4x.png," +
    "icons/onion/1899-blank-shape_pin_4x.png",
  green:
    "https://www.google.com/maps/vt/icon/name=" +
    "assets/icons/poi/tactile/pinlet_shadow_v3-2-medium.png," +
    "assets/icons/poi/tactile/pinlet_outline_v3-2-medium.png," +
    "assets/icons/poi/tactile/pinlet_v3-2-medium.png," +
    "assets/icons/poi/quantum/pinlet/dot_pinlet-2-medium.png&highlight=ff000000,ffffff,4db546,ffffff",
  finish: "./assets/finish-flag.svg"
};

export const GoogleTrailtourMap = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "GoogleTrailtourMap",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    mapConfig: UU5.PropTypes.object.isRequired,
    segments: UU5.PropTypes.array.isRequired,
    showOwnResults: UU5.PropTypes.bool,
    showTourDetail: UU5.PropTypes.bool,
    openPopover: UU5.PropTypes.func
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
  _getChild(context) {
    let mapConfig = this.props.mapConfig;
    return (
      <UU5.Bricks.GoogleMap
        {...this.getMainPropsToPass()}
        width={"100%"}
        latitude={mapConfig.center[0]}
        longitude={mapConfig.center[1]}
        googleApiKey={context.config.googleApiKey}
        zoom={mapConfig.zoom}
        disableDefaultUI
        markers={this._getMarkers()}
        mapRef={this._handleMapRef}
      />
    );
  },

  _getMarkerTitle(result) {
    return "#" + result.order + " " + result.name;
  },

  _getMarkers() {
    let markers = this.props.segments.map(result => {
      let segment = result.segment;
      let icon = MARKERS.blue;
      if (this.props.showOwnResults && (result.menResults[0] || result.womenResults[0])) {
        icon = MARKERS.green;
      }

      return {
        id: result.stravaId,
        latitude: segment.start_latitude,
        longitude: segment.start_longitude,
        title: this._getMarkerTitle(result),
        icon,
        onClick: this._handleMarkerClick
      };
    });

    return markers;
  },

  _handleMarkerClick(_, marker, event) {
    let foundSegment = this.props.segments.find(segment => this._getMarkerTitle(segment) === marker.title);
    this.props.openPopover(foundSegment, event.tb.target);
  },

  _handleMapRef(map) {
    if (this.props.showTourDetail) {
      let google = window.google; // loaded from UU5.Bricks.GoogleMap
      let segment = this.props.segments[0].segment;
      let decodedCoords = this._polyline.decode(segment.map.polyline);
      let path = decodedCoords.map(coords => ({ lat: coords[0], lng: coords[1] }));
      new google.maps.Polyline({
        map,
        path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2
      });

      new google.maps.Marker({
        position: { lat: segment.end_latitude, lng: segment.end_longitude },
        map: map,
        title: this._getMarkerTitle(segment),
        icon: {
          url: MARKERS.finish,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(0, 32)
        }
      });
    }
  },

  // can someone explain why closure does not work properly here?
  _polyline: polyline,
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <SpaContext.Consumer>{this._getChild}</SpaContext.Consumer>;
  }
  //@@viewOff:render
});

export default GoogleTrailtourMap;
