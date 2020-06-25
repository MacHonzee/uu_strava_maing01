//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import GoogleTrailtourMap from "../core/google-trailtour-map";
import MapyCzTrailtourMap from "../core/mapy-cz-trailtour-map";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import SegmentDistance from "./segment-distance";
import SegmentElevation from "./segment-elevation";
import BrickTools from "../bricks/tools";
import SegmentPace from "./segment-pace";
//@@viewOff:imports

const Lsi = {
  changeMapToGoogle: {
    cs: "Přepnout na Google Maps",
    en: "Switch to Google Maps"
  },
  changeMapToMapyCz: {
    cs: "Přepnout na Mapy.cz",
    en: "Switch to Mapy.cz"
  }
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
        position: relative;
        height: 400px;
      `,
      mapChangeButton: (props, state) => Config.Css.css`
        position: absolute;
        z-index: 10;
        top: 8px;
        left: 8px;
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
            padding: 0 0 0 8px;
          }

          .uu5-common-div:last-child {
            font-weight: bold;
          }
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
    showTourDetail: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      map: "mapyCz" // oneOf(["google", "mapyCz"])
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getGoogleMap() {
    return (
      <GoogleTrailtourMap
        mapConfig={this.props.mapConfig}
        segments={this.props.segments}
        showOwnResults={this.props.showOwnResults}
        showTourDetail={this.props.showTourDetail}
        openPopover={this._openPopover}
      />
    );
  },

  _getMarkerTitle(result) {
    return "#" + result.order + " " + result.name;
  },

  _getMapyCz() {
    return (
      <MapyCzTrailtourMap
        mapConfig={this.props.mapConfig}
        segments={this.props.segments}
        showOwnResults={this.props.showOwnResults}
        showTourDetail={this.props.showTourDetail}
        openPopover={this._openPopover}
      />
    );
  },

  _handleMapChange() {
    this.setState(prevState => ({
      map: prevState.map === "google" ? "mapyCz" : "google"
    }));
  },

  _getMapChangeButton() {
    // TODO some styling
    return (
      <UU5.Bricks.Button
        className={this.getClassName("mapChangeButton")}
        onClick={this._handleMapChange}
        content={<UU5.Bricks.Lsi lsi={this.state.map === "google" ? Lsi.changeMapToMapyCz : Lsi.changeMapToGoogle} />}
        bgStyle={"filled"}
        colorSchema={"warning"}
      />
    );
  },

  _openPopover(foundSegment, eventTarget) {
    let popover = UU5.Environment.getPage().getPopover();
    popover.open({
      header: (
        <UU5.Bricks.Link href={"tourDetail?id=" + foundSegment.id}>
          <strong>{this._getMarkerTitle(foundSegment)}</strong>
        </UU5.Bricks.Link>
      ),
      content: this._getPopoverContent(foundSegment),
      footer: this._getPopoverFooter(foundSegment),
      aroundElement: eventTarget
    });
  },

  _getPopoverContent(segment) {
    let extraStyle = { paddingLeft: "16px" };
    return (
      <UU5.Bricks.Div className={this.getClassName("popover")}>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div style={extraStyle}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.distance} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentDistance distance={segment.segment.distance} />
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div style={extraStyle}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.elevation} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentElevation elevation={segment.segment.total_elevation_gain} />
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  },

  _getPopoverFooter(segment) {
    let sex;
    if (segment.menResults[0]) sex = "men";
    if (segment.womenResults[0]) sex = "women";
    if (!this.props.showOwnResults || !sex) return;
    let result = segment[sex + "Results"][0];
    let totalResult = segment[sex + "ResultsTotal"];

    return (
      <UU5.Bricks.Div className={this.getClassName("popover")}>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.ownOrder} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            {result.order}&nbsp;/&nbsp;{totalResult}
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.points} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>{result.points}</UU5.Bricks.Div>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.time} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>{BrickTools.formatDuration(result.time)}</UU5.Bricks.Div>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.pace} />
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentPace pace={result.pace} />
          </UU5.Bricks.Div>
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this._getMapChangeButton()}
        {this.state.map === "google" && this._getGoogleMap()}
        {this.state.map === "mapyCz" && this._getMapyCz()}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TrailtourMap;
