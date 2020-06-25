//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import LoadFeedback from "../bricks/load-feedback";
import polyline from "@mapbox/polyline";
//@@viewOff:imports

const SCRIPT_URL = "https://api.mapy.cz/loader.js";
const MAPY_CZ_ROOT = "mapyCzTrailtourMapRoot";

const MARKERS = {
  red: "/marker/drop-red.png",
  blue: "/marker/drop-blue.png"
};

export const MapyCzTrailtourMap = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "MapyCzTrailtourMap",
    classNames: {
      main: (props, state) => Config.Css.css`
        .smap img[title] {
          cursor: pointer;
        }
      `
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
  getInitialState() {
    return {
      errorState: false,
      errorData: {},
      data: window.SMap
    };
  },

  componentDidMount() {
    if (!this.state.data) {
      // TODO consider using SystemJS for this
      const scriptElement = document.createElement("script");
      scriptElement.setAttribute("src", SCRIPT_URL);
      scriptElement.addEventListener("load", this._onScriptLoaded);
      document.head.appendChild(scriptElement);
    } else {
      this._buildMap();
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onScriptLoaded() {
    const Loader = window.Loader; // from the script
    Loader.async = true;
    Loader.load(null, { poi: false }, this._onLoaderFinished);
  },

  _onLoaderFinished() {
    this.setState({ data: true }, this._buildMap);
  },

  _buildMap() {
    const { SMap, JAK } = window;
    let { center, zoom } = this.props.mapConfig;

    // TODO this might not be necessary if there is some API to compute optimal map view
    if (this.props.showTourDetail) {
      zoom = zoom + 2;
    }

    let mapCenter = SMap.Coords.fromWGS84(center[1], center[0]);
    let map = new SMap(JAK.gel(MAPY_CZ_ROOT), mapCenter, zoom);
    map
      .addDefaultLayer(SMap.DEF_TURIST)
      .enable()
      .setTrail(true);

    this._setControls(map);

    this._addMarkers(map);

    this._addPolyline(map);
  },

  _setControls(map) {
    const { SMap } = window;
    let scale = new SMap.Control.Scale();
    map.addControl(scale, { left: "8px", bottom: "25px" });
    let msOpt = SMap.MOUSE_PAN | SMap.MOUSE_WHEEL | SMap.MOUSE_ZOOM;
    let mouse = new SMap.Control.Mouse(msOpt);
    map.addControl(mouse);
    let keyboard = new SMap.Control.Keyboard(SMap.KB_PAN | SMap.KB_ZOOM);
    map.addControl(keyboard);
    let selection = new SMap.Control.Selection(2);
    map.addControl(selection);
    let zn = new SMap.Control.ZoomNotification();
    map.addControl(zn);
    // TODO Lsi titles
    let zoom = new SMap.Control.Zoom(null, { titles: ["Přiblížit", "Oddálit"], showZoomMenu: false });
    map.addControl(zoom, { right: "2px", top: "10x" });

    if (this.props.showTourDetail) {
      let overview = new SMap.Control.Overview();
      map.addControl(overview, { left: "8px", top: "32px" });
    }
  },

  _getMarkerTitle(result) {
    return "#" + result.order + " " + result.name;
  },

  _addMarkers(map) {
    const { SMap } = window;
    let layer = new SMap.Layer.Marker();
    map.addLayer(layer);
    layer.enable();

    this.props.segments.forEach(result => {
      let segment = result.segment;

      let center = SMap.Coords.fromWGS84(segment.start_longitude, segment.start_latitude);
      let icon = MARKERS.red;
      if (this.props.showOwnResults && (result.menResults[0] || result.womenResults[0])) {
        icon = MARKERS.blue;
      }

      let options = {
        title: this._getMarkerTitle(result),
        url: SMap.CONFIG.img + icon
      };

      // TODO handle on click
      let marker = new SMap.Marker(center, result.stravaId, options);
      layer.addMarker(marker);
    });

    if (this.props.showTourDetail) {
      let segment = this.props.segments[0].segment;
      let icon = MARKERS.blue;
      let center = SMap.Coords.fromWGS84(segment.end_longitude, segment.end_latitude);
      let options = {
        url: SMap.CONFIG.img + icon
      };
      let marker = new SMap.Marker(center, this.props.segments[0].stravaId + "_end", options);
      layer.addMarker(marker);
    }

    map.getSignals().addListener(this, "marker-click", e => {
      let markerId = e.target.getId();
      let foundSegment = this.props.segments.find(segment => segment.stravaId === markerId);
      this.props.openPopover(foundSegment, e.data.event.target);
    });
  },

  _polyline: polyline,

  _addPolyline(map) {
    const { SMap } = window;
    if (!this.props.showTourDetail) return;

    let layer = new SMap.Layer.Geometry();
    map.addLayer(layer);
    layer.enable();

    let segment = this.props.segments[0].segment;
    let decodedCoords = this._polyline.decode(segment.map.polyline);
    let path = decodedCoords.map(coords => SMap.Coords.fromWGS84(coords[1], coords[0]));
    let options = {
      color: "#f00",
      width: 3
    };
    let geometry = new SMap.Geometry(SMap.GEOMETRY_POLYLINE, null, path, options);
    layer.addGeometry(geometry);

    let computedZoom = map.computeCenterZoom(path);
    map.setCenterZoom(computedZoom[0], computedZoom[1]);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { data, errorState, errorData } = this.state;
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <LoadFeedback data={data} errorState={errorState} errorData={errorData}>
          <></>
        </LoadFeedback>
        <div id={MAPY_CZ_ROOT} style={{ height: "400px" }} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default MapyCzTrailtourMap;
