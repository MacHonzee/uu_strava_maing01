//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SpaContext from "../context/spa-context";
import AllMarkers from "../trailtour/config/map-markers";
import GeolocationButton from "./geolocation-button";
//@@viewOff:imports

const MARKERS = AllMarkers.google;

export const GoogleTrailtourMap = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "GoogleTrailtourMap",
    classNames: {
      main: (props, state) => Config.Css.css``,
      geolocation: Config.Css.css`
        position: absolute;
        right: 10px;
        bottom: 110px;
        z-index: 10;

        &.uu5-bricks-button {
          border-bottom-left-radius: 2px;
          border-top-left-radius: 2px;
          width: 40px;
          height: 32px;
          min-height: 32px;
          text-align: center;
          line-height: 27px;
          font-weight: 400;
          background: #fff;
          color: #6b7580;
          border: none;
          outline: 0;

          > * {
            vertical-align: baseline;
          }

          .uu5-bricks-icon {
            font-size: 24px;
          }

          &:active {
            font-size: 23px;
          }

          &:hover {
            color: #29ac07;
            background: #f7f7f7;
          }
        }
      `,
      activeGeolocation: Config.Css.css`
        &.uu5-bricks-button.uu5-bricks-button-m {
          color: #29ac07;
          background: #f7f7f7;
          line-height: 24px;
        }
      `,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    mapConfig: UU5.PropTypes.object.isRequired,
    segments: UU5.PropTypes.array.isRequired,
    showOwnResults: UU5.PropTypes.bool,
    showTourDetail: UU5.PropTypes.bool,
    openPopover: UU5.PropTypes.func,
    decodedPolyline: UU5.PropTypes.array,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getMapCenterAndZoom() {
    let center = this._map.getCenter();
    return {
      center: [center.lat(), center.lng()],
      zoom: this._map.getZoom(),
    };
  },

  drawMapMarker(coords) {
    let marker = this._getCurrentLocationMarker();
    if (!marker.getMap()) marker.setMap(this._map);
    marker.setPosition({ lat: coords[0], lng: coords[1] });
  },

  undrawMapMarker() {
    this._getCurrentLocationMarker().setMap(null);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChild(context) {
    let mapConfig = this.props.mapConfig;
    return (
      <>
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
        <GeolocationButton
          className={this.getClassName("geolocation")}
          activeClassName={this.getClassName("activeGeolocation")}
          drawPosition={this._drawCurrentPosition}
        />
      </>
    );
  },

  _drawCurrentPosition(position) {
    let marker = this._geolocMarker;
    if (!marker) {
      let google = window.google; // loaded from UU5.Bricks.GoogleMap
      marker = new google.maps.Marker({
        map: this._map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "blue",
          fillOpacity: 0.6,
          scale: 8,
          strokeWeight: 2,
          strokeColor: "white",
        },
      });
      this._geolocMarker = marker;
    }

    let coords = position.coords;
    marker.setPosition({ lat: coords.latitude, lng: coords.longitude });
  },

  _getMarkerTitle(result) {
    return "#" + result.order + " " + result.name;
  },

  _getMarkers() {
    return this.props.segments.map((result) => {
      let segment = result.segment;
      let icon;
      if (this.props.showOwnResults) {
        icon = result.menResults[0] || result.womenResults[0] ? MARKERS.ownRun : MARKERS.noRun;
      } else if (result.markerIcon) {
        icon = MARKERS[result.markerIcon];
      } else {
        icon = MARKERS.ownRun;
      }

      return {
        id: result.stravaId,
        latitude: segment.start_latlng[0],
        longitude: segment.start_latlng[1],
        title: this._getMarkerTitle(result),
        icon,
        onClick: this._handleMarkerClick,
      };
    });
  },

  _handleMarkerClick(_, marker, event) {
    let foundSegment = this.props.segments.find((segment) => this._getMarkerTitle(segment) === marker.title);
    let target = Object.values(event).find((ev) => ev instanceof MouseEvent || ev instanceof TouchEvent).target;
    this.props.openPopover(foundSegment, target);
  },

  _handleMapRef(map) {
    this._map = map;
    if (this.props.showTourDetail) {
      let google = window.google; // loaded from UU5.Bricks.GoogleMap
      let segment = this.props.segments[0].segment;
      let decodedPolyline = this.props.decodedPolyline;
      let path = decodedPolyline.map((coords) => ({ lat: coords[0], lng: coords[1] }));
      new google.maps.Polyline({
        map,
        path,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
      });

      new google.maps.Marker({
        position: { lat: segment.end_latitude, lng: segment.end_longitude },
        map: map,
        title: this._getMarkerTitle(segment),
        icon: {
          url: MARKERS.finish,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(0, 32),
        },
      });
    }
  },

  _getCurrentLocationMarker() {
    let marker = this._currentMarker;
    if (!marker) {
      let google = window.google; // loaded from UU5.Bricks.GoogleMap
      marker = new google.maps.Marker({});
      this._currentMarker = marker;
    }
    return marker;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <SpaContext.Consumer>{this._getChild}</SpaContext.Consumer>;
  },
  //@@viewOff:render
});

export default GoogleTrailtourMap;
