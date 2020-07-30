//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteTourCard from "./athlete-tour-card";
import TrailtourMap from "../bricks/trailtour-map";
import AthleteComparisonList from "./athlete-comparison-list";
//@@viewOff:imports

export const AthleteComparisonReady = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparisonReady",
    classNames: {
      main: (props, state) => Config.Css.css``,
      cardsGrid: Config.Css.css`
        display: grid;
        grid-gap: 8px;
        grid-template-columns: auto auto;

        ${UU5.Utils.ScreenSize.getMaxMediaQueries("s", `grid-template-columns: auto;`)}
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    trailtour: UU5.PropTypes.object,
    results: UU5.PropTypes.array,
    stravaIdList: UU5.PropTypes.array
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
  _getCards() {
    let correctKey = this.props.trailtour.totalResults.menResults[0] ? "menResults" : "womenResults";
    let athletes = [];
    this.props.stravaIdList.forEach((stravaId, i) => {
      let numId = parseInt(stravaId);
      let athlete = this.props.trailtour.totalResults[correctKey].find(result => result.stravaId === numId);

      let cardData = { totalResults: {} };
      cardData.totalResults[correctKey] = athlete;
      cardData.totalResults[correctKey + "Total"] = this.props.trailtour.totalResults[correctKey + "Total"];
      athletes.push(
        <AthleteTourCard
          key={stravaId}
          data={cardData}
          forComparison={i === 0 ? "first" : "second"}
          year={this.props.trailtour.year}
        />
      );
    });
    return <div className={this.getClassName("cardsGrid")}>{athletes}</div>;
  },

  _getMap() {
    let correctKey = this.props.trailtour.totalResults.menResults[0] ? "menResults" : "womenResults";
    this.props.results.forEach(result => {
      let resLng = result[correctKey].length;
      if (resLng === 0) {
        result.markerIcon = "noRun";
      } else if (resLng === 1) {
        let isFirst = this.props.stravaIdList.indexOf(result[correctKey][0].stravaId);
        result.markerIcon = isFirst === 0 ? "ownRun" : "otherRun";
      } else {
        result.markerIcon = "commonRun";
      }
    });

    return (
      <TrailtourMap
        style={{ marginTop: "8px" }}
        mapConfig={this.props.trailtour.mapConfig}
        segments={this.props.results}
        multipleResults
        year={this.props.trailtour.year}
      />
    );
  },

  _getTable() {
    let sex = this.props.trailtour.totalResults.menResults[0] ? "male" : "female";
    return (
      <AthleteComparisonList
        data={this.props.results}
        trailtour={this.props.trailtour}
        stravaIdList={this.props.stravaIdList}
        sex={sex}
      />
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div {...this.getMainPropsToPass()}>
        {this._getCards()}
        {this._getMap()}
        {this._getTable()}
      </div>
    );
  }
  //@@viewOff:render
});

export default AthleteComparisonReady;
