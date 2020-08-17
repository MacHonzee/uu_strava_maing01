//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import GoogleTrailtourMap from "../core/google-trailtour-map";
import MapyCzTrailtourMap from "../core/mapy-cz-trailtour-map";
import SegmentDistance from "./segment-distance";
import SegmentElevation from "./segment-elevation";
import BrickTools from "../bricks/tools";
import SegmentPace from "./segment-pace";
import TourDetailLsi from "../lsi/tour-detail-lsi";

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

const BREAK_POINT_FOR_MAP = 768;

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
        width: 200px;
   `,
      popover: Config.Css.css`
        width: 100%;
        padding: 4px 16px;

        > .uu5-common-div {
          text-align: left;
          display: grid;
          grid-template-columns: 96px auto auto;

          .uu5-common-div:not(:first-child) {
            font-weight: bold;
            padding: 0 0 0 8px;
          }
        }
      `,
      popoverFooter: Config.Css.css`
        padding: 0;
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
    multipleResults: UU5.PropTypes.bool,
    year: UU5.PropTypes.string,
    stravaIdList: UU5.PropTypes.array
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._mapRef = UU5.Common.Reference.create();

    let width = window.innerWidth;
    return {
      map: width < BREAK_POINT_FOR_MAP ? "google" : "mapyCz", // oneOf(["google", "mapyCz"])
      mapConfig: this.props.mapConfig
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
        ref_={this._mapRef}
        mapConfig={this.state.mapConfig}
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
        ref_={this._mapRef}
        mapConfig={this.state.mapConfig}
        segments={this.props.segments}
        showOwnResults={this.props.showOwnResults}
        showTourDetail={this.props.showTourDetail}
        openPopover={this._openPopover}
      />
    );
  },

  _handleMapChange() {
    let currentMapConfig = this._mapRef.current.getMapCenterAndZoom();
    this.setState(prevState => ({
      map: prevState.map === "google" ? "mapyCz" : "google",
      mapConfig: currentMapConfig
    }));
  },

  _getMapChangeButton() {
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
        <UU5.Bricks.Link href={"tourDetail?id=" + foundSegment.id} onClick={this._closePopover}>
          <strong>{this._getMarkerTitle(foundSegment)}</strong>
        </UU5.Bricks.Link>
      ),
      content: this._getPopoverContent(foundSegment),
      footer: this._getPopoverFooter(foundSegment),
      footerClassName: this.getClassName("popoverFooter"),
      aroundElement: eventTarget
    });
  },

  _closePopover() {
    UU5.Environment.getPage()
      .getPopover()
      .close();
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

  _getPopoverFooter(segment) {
    let sex;
    if (segment.menResults && segment.menResults[0]) sex = "men";
    if (segment.womenResults && segment.womenResults[0]) sex = "women";

    if (this.props.showOwnResults && sex) {
      return this._getSinglePopoverResult(segment, sex);
    } else if (this.props.multipleResults && sex) {
      return this._getMultiplePopoverResults(segment, sex);
    }
  },

  _getSinglePopoverResult(segment, sex) {
    let result = segment[sex + "Results"][0];
    let totalResult = segment[sex + "ResultsTotal"];

    return (
      <UU5.Bricks.Div className={this.getClassName("popover")}>
        {this.props.multipleResults && (
          <UU5.Bricks.Div>
            <UU5.Bricks.Div />
            <UU5.Bricks.Div>
              <UU5.Bricks.Link href={`athleteTourDetail?year=${this.props.year}&stravaId=${result.stravaId}`}>
                {result.name}
              </UU5.Bricks.Link>
            </UU5.Bricks.Div>
          </UU5.Bricks.Div>
        )}
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

  _getMultiplePopoverResults(segment, sex) {
    let stravaIdList = this.props.stravaIdList;
    let results = [...segment[sex + "Results"]].sort(
      (a, b) => stravaIdList.indexOf(a.stravaId) - stravaIdList.indexOf(b.stravaId)
    );
    let totalResult = segment[sex + "ResultsTotal"];

    let headers = results.map(result => (
      <UU5.Bricks.Div key={result.stravaId}>
        <UU5.Bricks.Link href={`athleteTourDetail?year=${this.props.year}&stravaId=${result.stravaId}`}>
          {result.name}
        </UU5.Bricks.Link>
      </UU5.Bricks.Div>
    ));

    let orders = results.map(result => (
      <UU5.Bricks.Div key={result.stravaId}>
        {result.order}&nbsp;/&nbsp;{totalResult}
      </UU5.Bricks.Div>
    ));

    let points = results.map(result => <UU5.Bricks.Div key={result.stravaId}>{result.points}</UU5.Bricks.Div>);

    let durations = results.map(result => (
      <UU5.Bricks.Div key={result.stravaId}>{BrickTools.formatDuration(result.time)}</UU5.Bricks.Div>
    ));

    let paces = results.map(result => (
      <UU5.Bricks.Div key={result.stravaId}>
        <SegmentPace pace={result.pace} />
      </UU5.Bricks.Div>
    ));

    return (
      <UU5.Bricks.Div className={this.getClassName("popover")}>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div />
          {headers}
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.ownOrder} />
          </UU5.Bricks.Div>
          {orders}
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.points} />
          </UU5.Bricks.Div>
          {points}
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.time} />
          </UU5.Bricks.Div>
          {durations}
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.pace} />
          </UU5.Bricks.Div>
          {paces}
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
