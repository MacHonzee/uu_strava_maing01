//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

export const ClubTourCard = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ClubTourCard",
    classNames: {
      main: (props, state) => Config.Css.css``,
    },
    lsi: {
      name: {
        cs: "Jméno",
        en: "Name",
      },
      order: {
        cs: "Pořadí",
        en: "Order",
      },
      points: {
        cs: "Celkem bodů",
        en: "Total points",
      },
      sexLabel: {
        cs: "Muži / Ženy",
        en: "Men / Women",
      },
      runners: {
        cs: "Počet běžců",
        en: "Runners count",
      },
      results: {
        cs: "Počet etap",
        en: "Results count",
      },
      avgPoints: {
        cs: "Průměrně bodů",
        en: "Average points",
      },
      totalKmLabel: {
        cs: "Celkem km",
        en: "Total km",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
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
  _getSmallContent() {
    const leftColWidth = "130px";
    let { menKm, womenKm } = this._countTotalKm();

    return (
      <UU5.BlockLayout.Block>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getNameLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getName()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getOrderLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getOrder()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getPointsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getPoints()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSexLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSexPoints()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getRunnersLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getRunners()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSexLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSexRunners()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSegmentsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSegments()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSexLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSexSegments()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getTotalKmLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getTotalKm(menKm + womenKm)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSexLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSexKm(menKm, womenKm)}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getAvgPointsLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getAvgPoints()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
        <UU5.BlockLayout.Row>
          <UU5.BlockLayout.Column width={leftColWidth}>{this._getSexLabel()}</UU5.BlockLayout.Column>
          <UU5.BlockLayout.Column>{this._getSexAvgPoints()}</UU5.BlockLayout.Column>
        </UU5.BlockLayout.Row>
      </UU5.BlockLayout.Block>
    );
  },

  _getLargeContent() {
    return (
      <UU5.BlockLayout.Block>
        {this._getNameRow()}
        {this._getPointsRow()}
        {this._getRunnersRow()}
        {this._getSegmentsRow()}
        {this._getTotalKmRow()}
        {this._getAvgPointsRow()}
      </UU5.BlockLayout.Block>
    );
  },

  _getNameRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getNameLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getName()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getOrderLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getOrder()}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getNameLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("name")}</UU5.BlockLayout.Text>;
  },

  _getName() {
    return <UU5.BlockLayout.Text weight={"primary"}>{this.props.club.name}</UU5.BlockLayout.Text>;
  },

  _getOrderLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("order")}</UU5.BlockLayout.Text>;
  },

  _getOrder() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        {this.props.club.order}&nbsp;/&nbsp;{this.props.trailtour.totalResults.clubResultsTotal}
      </UU5.BlockLayout.Text>
    );
  },

  _getPointsRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getPointsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getPoints()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSexLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSexPoints()}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getPointsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("points")}</UU5.BlockLayout.Text>;
  },

  _getPoints() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.points} maxDecimalLength={0} />
      </UU5.BlockLayout.Text>
    );
  },

  _getSexLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("sexLabel")}</UU5.BlockLayout.Text>;
  },

  _getSexPoints() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.pointsMen} maxDecimalLength={0} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={this.props.club.pointsWomen} maxDecimalLength={0} />
      </UU5.BlockLayout.Text>
    );
  },

  _getRunnersRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getRunnersLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getRunners()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSexLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSexRunners()}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getRunnersLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("runners")}</UU5.BlockLayout.Text>;
  },

  _getRunners() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.runnersTotal} />
      </UU5.BlockLayout.Text>
    );
  },

  _getSexRunners() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.runnersMen} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={this.props.club.runnersWomen} />
      </UU5.BlockLayout.Text>
    );
  },

  _getSegmentsRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSegmentsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getSegments()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSexLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSexSegments()}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getSegmentsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("results")}</UU5.BlockLayout.Text>;
  },

  _getSegments() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.resultsTotal} />
      </UU5.BlockLayout.Text>
    );
  },

  _countTotalKm() {
    let menKm = 0;
    let womenKm = 0;
    this.props.clubResults.forEach((clubResult) => {
      let distance = clubResult.segment.distance;
      menKm += distance * clubResult.menResultsCount;
      womenKm += distance * clubResult.womenResultsCount;
    });
    return { menKm, womenKm };
  },

  _getTotalKmRow() {
    let { menKm, womenKm } = this._countTotalKm();

    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getTotalKmLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getTotalKm(menKm + womenKm)}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSexLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSexKm(menKm, womenKm)}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getTotalKmLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("totalKmLabel")}</UU5.BlockLayout.Text>;
  },

  _getTotalKm(totalKm) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        {UU5.Common.Tools.formatNumber(totalKm / 1000, { maxDecimals: 2 }) + " km"}
      </UU5.BlockLayout.Text>
    );
  },

  _getSexKm(menKm, womenKm) {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={menKm / 1000} maxDecimalLength={2} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={womenKm / 1000} maxDecimalLength={2} />
      </UU5.BlockLayout.Text>
    );
  },

  _getSexSegments() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.resultsMen} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={this.props.club.resultsWomen} />
      </UU5.BlockLayout.Text>
    );
  },

  _getAvgPointsRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>{this._getAvgPointsLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>{this._getAvgPoints()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>{this._getSexLabel()}</UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>{this._getSexAvgPoints()}</UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getAvgPointsLabel() {
    return <UU5.BlockLayout.Text weight={"secondary"}>{this.getLsiComponent("avgPoints")}</UU5.BlockLayout.Text>;
  },

  _getAvgPoints() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.avgPoints} maxDecimalLength={2} />
      </UU5.BlockLayout.Text>
    );
  },

  _getSexAvgPoints() {
    return (
      <UU5.BlockLayout.Text weight={"primary"}>
        <UU5.Bricks.Number value={this.props.club.avgPointsMen} maxDecimalLength={2} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={this.props.club.avgPointsWomen} maxDecimalLength={2} />
      </UU5.BlockLayout.Text>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BlockLayout.Tile {...this.getMainPropsToPass()}>
        <UU5.Bricks.ScreenSize>
          <UU5.Bricks.ScreenSize.Item screenSize={["xs", "s"]}>{this._getSmallContent()}</UU5.Bricks.ScreenSize.Item>
          <UU5.Bricks.ScreenSize.Item screenSize={["m", "l", "xl"]}>
            {this._getLargeContent()}
          </UU5.Bricks.ScreenSize.Item>
        </UU5.Bricks.ScreenSize>
      </UU5.BlockLayout.Tile>
    );
  },
  //@@viewOff:render
});

export default ClubTourCard;
