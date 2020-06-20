//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SpaContext from "../context/spa-context";
import BrickTools from "./tools";
import SegmentDistance from "./segment-distance";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import SegmentElevation from "./segment-elevation";
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
    "assets/icons/poi/quantum/pinlet/dot_pinlet-2-medium.png&highlight=ff000000,ffffff,4db546,ffffff"
};

export const TrailtourMap = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TrailtourMap",
    classNames: {
      main: (props, state) => Config.Css.css`
        > div {
          margin: auto;
        }
      `,
      popover: Config.Css.css`
        width: 100%;
        padding: 4px 0;

        > .uu5-common-div {
          width: 100%;
          text-align: left;

          .uu5-common-div {
            display: inline-block;
            width: 50%;
            padding: 0 8px;
          }

          .uu5-common-div:last-child {
            font-weight: bold;
          }
        }
      `
    },
    contextType: SpaContext.Context
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    trailtour: UU5.PropTypes.object.isRequired,
    segments: UU5.PropTypes.array.isRequired
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
  _getMapWidth(screenSize) {
    switch (screenSize) {
      case "xs":
      case "s":
      case "m":
        return "100%";
      case "l":
      case "xl":
        return "75%";
    }
  },

  _getChild(context) {
    let { trailtour } = this.props;
    return (
      <UU5.Bricks.ScreenSize>
        {({ screenSize }) => {
          return (
            <UU5.Bricks.GoogleMap
              {...this.getMainPropsToPass()}
              width={this._getMapWidth(screenSize)}
              latitude={trailtour.mapConfig.center[0]}
              longitude={trailtour.mapConfig.center[1]}
              googleApiKey={context.config.googleApiKey}
              zoom={trailtour.mapConfig.zoom}
              disableDefaultUI
              markers={this._getMarkers()}
            />
          );
        }}
      </UU5.Bricks.ScreenSize>
    );
  },

  _getMarkerTitle(result) {
    return "#" + result.order + " " + result.name;
  },

  _getMarkers() {
    return this.props.segments.map(result => {
      let segment = result.segment;
      return {
        id: result.stravaId,
        latitude: segment.start_latitude,
        longitude: segment.start_longitude,
        title: this._getMarkerTitle(result),
        icon: MARKERS.blue,
        onClick: this._handleMarkerClick
      };
    });
  },

  _handleMarkerClick(_, marker, event) {
    let foundSegment = this.props.segments.find(segment => this._getMarkerTitle(segment) === marker.title);
    let popover = UU5.Environment.getPage().getPopover();
    popover.open({
      header: (
        <UU5.Bricks.Link href={"tourDetail?id=" + foundSegment.id}>
          <strong>{this._getMarkerTitle(foundSegment)}</strong>
        </UU5.Bricks.Link>
      ),
      content: this._getPopoverContent(foundSegment),
      aroundElement: event.tb.target
    });
  },

  _getPopoverContent(segment) {
    return (
      <UU5.Bricks.Div className={this.getClassName("popover")}>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.distance} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentDistance distance={segment.segment.distance} />
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.elevation} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentElevation elevation={segment.segment.total_elevation_gain} />
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <SpaContext.Consumer>{this._getChild}</SpaContext.Consumer>;
  }
  //@@viewOff:render
});

export default TrailtourMap;
