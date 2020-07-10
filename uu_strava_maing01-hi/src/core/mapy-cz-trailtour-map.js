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
  blue: "/marker/drop-blue.png",
  finish: "./assets/finish-flag.svg"
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
      `,
      detailButton: Config.Css.css`
        position: absolute;
        left: 8px;
        bottom: 54px;
        z-index: 10;
        width: 200px;
      `
    },
    lsi: {
      mapyCzDetail: {
        cs: "Zobrazit na Mapy.cz",
        en: "Show detail at Mapy.cz"
      }
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
      errorState: undefined,
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
  getMapCenterAndZoom() {
    let center = this._map.getCenter();
    return {
      center: [center.y, center.x],
      zoom: this._map.getZoom()
    };
  },
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
    this.setState({ data: window.SMap }, this._buildMap);
  },

  _buildMap() {
    const { SMap, JAK } = window;
    let { center, zoom } = this.props.mapConfig;

    let mapCenter = SMap.Coords.fromWGS84(center[1], center[0]);
    let map = new SMap(JAK.gel(MAPY_CZ_ROOT), mapCenter, zoom);
    this._map = map;
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
    const { SMap, JAK } = window;
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

      let marker = new SMap.Marker(center, result.stravaId, options);
      layer.addMarker(marker);
    });

    if (this.props.showTourDetail) {
      let segment = this.props.segments[0].segment;
      let center = SMap.Coords.fromWGS84(segment.end_longitude, segment.end_latitude);
      let flagImg = JAK.mel("img", { src: MARKERS.finish }, { width: "32px", height: "32px" });
      let options = {
        url: flagImg,
        anchor: { top: 32, right: 32 }
      };
      let marker = new SMap.Marker(center, this.props.segments[0].stravaId + "_end", options);
      // marker.decorate(SMap.Marker.Feature.RelativeAnchor, {
      //   anchor: { left: 0.5, top: 0.5 }
      // });
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

  _getMapyCzDetailButton() {
    let mapyCzLink = this.props.segments[0].mapyCzLink;
    if (mapyCzLink) {
      return (
        <UU5.Bricks.Button
          className={this.getClassName("detailButton")}
          colorSchema={"red-rich"}
          bgStyle={"filled"}
          href={mapyCzLink}
          target={"_blank"}
        >
          {this.getLsiComponent("mapyCzDetail")}
        </UU5.Bricks.Button>
      );
    }
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
        {this.props.showTourDetail && this._getMapyCzDetailButton()}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default MapyCzTrailtourMap;
