//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-block-layout";
import Config from "./config/config.js";
import AthleteLink from "../bricks/athlete-link";
import MapMarkers from "./config/map-markers";
import ClubLink from "../bricks/club-link";
//@@viewOff:imports

const STRAVA_LINK_STYLE = {
  position: "absolute",
  top: "16px",
  right: "12px",
  width: "32px"
};

export const AthleteTourCard = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourCard",
    classNames: {
      main: (props, state) => Config.Css.css`
        position: relative;
      `
    },
    lsi: {
      name: {
        cs: "Jméno",
        en: "Name"
      },
      order: {
        cs: "Pořadí",
        en: "Order"
      },
      points: {
        cs: "Počet bodů",
        en: "Count of points"
      },
      segments: {
        cs: "Uběhnuto etap",
        en: "Finished segments"
      },
      avgPoints: {
        cs: "Průměrně bodů",
        en: "Average points"
      },
      club: {
        cs: "Klub",
        en: "Club"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    forComparison: UU5.PropTypes.oneOf(["first", "second"]),
    year: UU5.PropTypes.string
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
  _getCorrectResults() {
    let totalResults = this.props.data.totalResults;
    if (totalResults.womenResults) {
      return { results: totalResults.womenResults, sex: "female", total: totalResults.womenResultsTotal };
    } else {
      return { results: totalResults.menResults, sex: "male", total: totalResults.menResultsTotal };
    }
  },

  _getAthleteLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("name")}</UU5.BlockLayout.Text>;
  },

  _getAthleteLink(results) {
    let child;
    if (this.props.forComparison) {
      child = (
        <UU5.Bricks.Link href={`athleteTourDetail?year=${this.props.year}&stravaId=${results.stravaId}`}>
          {results.name}
        </UU5.Bricks.Link>
      );
    } else {
      child = this._getStravaLink(results, true, { position: "relative", top: "2px" });
    }

    return <UU5.BlockLayout.Text weight={"primary"}>{child}</UU5.BlockLayout.Text>;
  },

  _getStravaLink(results, includeName, style) {
    return (
      <AthleteLink stravaId={results.stravaId}>
        <img src={"./assets/strava_symbol_orange.png"} alt={"strava_symbol_orange"} width={"24px"} style={style} />
        {includeName && results.name}
      </AthleteLink>
    );
  },

  _getOrderLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("order")}</UU5.BlockLayout.Text>;
  },

  _getOrder(results, total) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        {results.order}&nbsp;/&nbsp;{total}
      </UU5.BlockLayout.Text>
    );
  },

  _getNameRow(results, sex, total) {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getAthleteLabel(sex)}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getAthleteLink(results)}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getOrderLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getOrder(results, total)}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getPointsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("points")}</UU5.BlockLayout.Text>;
  },

  _getPoints(results) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={results.points} />
      </UU5.BlockLayout.Text>
    );
  },

  _getAvgPointsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("avgPoints")}</UU5.BlockLayout.Text>;
  },

  _getAvgPoints(results, finishedSegments) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={finishedSegments ? results.points / finishedSegments : 0} maxDecimalLength={2} />
      </UU5.BlockLayout.Text>
    );
  },

  _getPointsRow(results, finishedSegments) {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getPointsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getPoints(results)}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getAvgPointsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getAvgPoints(results, finishedSegments)}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getSegmentsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("segments")}</UU5.BlockLayout.Text>;
  },

  _getSegmentsCount(finishedSegments) {
    return <UU5.BlockLayout.Text weight={"primary"}>{finishedSegments}</UU5.BlockLayout.Text>;
  },

  _getSegmentsRow(results, finishedSegments) {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSegmentsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getSegmentsCount(finishedSegments)}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getClubLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getClub(results)}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getClubLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("club")}</UU5.BlockLayout.Text>;
  },

  _getClub(results) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        {results.club && <ClubLink year={this.props.year} club={results.club} />}
      </UU5.BlockLayout.Text>
    );
  },

  _getLargeContent(results, sex, total, finishedSegments) {
    return (
      <UU5.BlockLayout.Block>
        {this._getNameRow(results, sex, total)}
        {this._getPointsRow(results, finishedSegments)}
        {this._getSegmentsRow(results, finishedSegments)}
      </UU5.BlockLayout.Block>
    );
  },

  _getMarkerIcons() {
    let runType = this.props.forComparison === "first" ? "ownRun" : "otherRun";
    return (
      <div style={{ position: "absolute", bottom: "8px", right: "12px" }}>
        <img
          src={MapMarkers.mapyCz[runType]}
          alt={"mapyCzRunMarker"}
          style={{ position: "relative", bottom: "2px", width: "20px" }}
        />
        <img src={MapMarkers.google[runType]} alt={"googleRunMarker"} style={{ marginLeft: "8px" }} />
      </div>
    );
  },

  _getSmallContent(results, sex, total, finishedSegments) {
    const leftColWidth = "130px";
    return (
      <UU5.BlockLayout.Block>
        {this.props.forComparison && this._getStravaLink(results, false, STRAVA_LINK_STYLE)}
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getAthleteLabel(sex)}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getAthleteLink(results)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getOrderLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getOrder(results, total)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getPointsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getPoints(results)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getAvgPointsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getAvgPoints(results, finishedSegments)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSegmentsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSegmentsCount(finishedSegments)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getClubLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getClub(results)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        {this.props.forComparison && this._getMarkerIcons()}
      </UU5.BlockLayout.Block>
    );
  },

  _getResponsiveContent(results, sex, total, finishedSegments) {
    return (
      <UU5.Bricks.ScreenSize>
        <UU5.Bricks.ScreenSize.Item screenSize={["xs", "s"]}>
          {this._getSmallContent(results, sex, total, finishedSegments)}
        </UU5.Bricks.ScreenSize.Item>
        <UU5.Bricks.ScreenSize.Item screenSize={["m", "l", "xl"]}>
          {this._getLargeContent(results, sex, total, finishedSegments)}
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { results, sex, total } = this._getCorrectResults();
    let finishedSegments = results.totalCount;
    return (
      <UU5.BlockLayout.Tile {...this.getMainPropsToPass()}>
        {this.props.forComparison
          ? this._getSmallContent(results, sex, total, finishedSegments)
          : this._getResponsiveContent(results, sex, total, finishedSegments)}
      </UU5.BlockLayout.Tile>
    );
  }
  //@@viewOff:render
});

export default AthleteTourCard;
