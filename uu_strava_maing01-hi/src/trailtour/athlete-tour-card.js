//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-block-layout";
import Config from "./config/config.js";
import AthleteLink from "../bricks/athlete-link";
//@@viewOff:imports

export const AthleteTourCard = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourCard",
    classNames: {
      main: (props, state) => Config.Css.css``
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
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    athleteResults: UU5.PropTypes.array.isRequired
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
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <AthleteLink stravaId={results.stravaId}>
          <img
            src={"./assets/strava_symbol_orange.png"}
            alt={"strava_symbol_orange"}
            width={"24px"}
            style={{ position: "relative", top: "2px" }}
          />
          {results.name}
        </AthleteLink>
      </UU5.BlockLayout.Text>
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
        <UU5.Bricks.Number value={results.points / finishedSegments} maxDecimalLength={2} />
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

  _getSegmentsRow(finishedSegments) {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSegmentsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSegmentsCount(finishedSegments)}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getFinishedSegments(sex) {
    let finishedSegments = 0;
    let resultKey = sex === "male" ? "menResults" : "womenResults";
    this.props.athleteResults.forEach(segment => {
      if (segment[resultKey][0]) finishedSegments++;
    });
    return finishedSegments;
  },

  _getLargeContent(results, sex, total, finishedSegments) {
    return (
      <UU5.BlockLayout.Block>
        {this._getNameRow(results, sex, total)}
        {this._getPointsRow(results, finishedSegments)}
        {this._getSegmentsRow(finishedSegments)}
      </UU5.BlockLayout.Block>
    );
  },

  _getSmallContent(results, sex, total, finishedSegments) {
    let leftColWidth = "130px";
    return (
      <UU5.BlockLayout.Block>
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
      </UU5.BlockLayout.Block>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { results, sex, total } = this._getCorrectResults();
    let finishedSegments = this._getFinishedSegments(sex);
    return (
      <UU5.BlockLayout.Tile {...this.getMainPropsToPass()}>
        <UU5.Bricks.ScreenSize>
          <UU5.Bricks.ScreenSize.Item screenSize={["xs", "s"]}>
            {this._getSmallContent(results, sex, total, finishedSegments)}
          </UU5.Bricks.ScreenSize.Item>
          <UU5.Bricks.ScreenSize.Item screenSize={["m", "l", "xl"]}>
            {this._getLargeContent(results, sex, total, finishedSegments)}
          </UU5.Bricks.ScreenSize.Item>
        </UU5.Bricks.ScreenSize>
      </UU5.BlockLayout.Tile>
    );
  }
  //@@viewOff:render
});

export default AthleteTourCard;
