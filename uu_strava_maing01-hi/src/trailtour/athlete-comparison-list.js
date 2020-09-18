//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TrailtourTools from "./tools";
import BrickTools from "../bricks/tools";
import NameFilterBar from "./name-filter-bar";
import CompareResultsButton from "./compare-results-button";
import FlexColumns from "./config/flex-columns";
import TourDetailLsi from "../lsi/tour-detail-lsi";
//@@viewOff:imports

const PAGE_SIZE = 1000;

export const AthleteComparisonList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparisonList",
    classNames: {
      main: (props, state) => Config.Css.css``,
      smallTileRows: Config.Css.css`
        strong {
          display: inline-block;
          width: 80px;
        }
      `,
      smallTileTable: Config.Css.css`
        display: flex;
        flex-direction: column;

        > div {
          display: flex;

          > div:first-child {
            width: 80px;
            font-weight: bold;
          }

          > div:not(:first-child) {
            ${UU5.Utils.ScreenSize.getMediaQueries("m", `width: calc(35% - 80px);`)}
            ${UU5.Utils.ScreenSize.getMaxMediaQueries("s", `width: calc((100% - 80px)/2);`)}
          }
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    stravaIdList: UU5.PropTypes.array.isRequired
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
  async _handleLoad(dtoIn) {
    // this is unfortunately needed for the Flextiles to be working without server calls
    let dataCopy = JSON.parse(JSON.stringify(this.props.data));

    dataCopy = TrailtourTools.handleFiltering(dataCopy, dtoIn.filterMap);

    dataCopy = TrailtourTools.handleSorting(dataCopy, dtoIn.sorterList, this.props.sex);

    return {
      itemList: dataCopy,
      pageInfo: {
        pageSize: PAGE_SIZE,
        pageIndex: 0,
        total: dataCopy.length
      }
    };
  },

  _getCorrectResults(data, resultIndex) {
    let sex, resultKey;
    if (data.womenResults.length > 0) {
      sex = "female";
      resultKey = "womenResults";
    } else {
      sex = "male";
      resultKey = "menResults";
    }
    let stravaId = this.props.stravaIdList[resultIndex];
    let result = data[resultKey].find(res => res.stravaId === stravaId);
    return { results: result || {}, sex, total: data[resultKey + "Total"] };
  },

  _getSmallTile({ data, visibleColumns }) {
    let athletes = this._getAthletes();
    let { results: resultsFirst } = FlexColumns.getComparisonResults(data, 0, athletes);
    let { results: resultsSecond } = FlexColumns.getComparisonResults(data, 1, athletes);

    let tableRows = [];
    if (resultsFirst.time || resultsSecond.time) {
      tableRows.push(
        <div style={{ fontWeight: "bold" }}>
          <div>&nbsp;</div>
          <div>{athletes[0].name}</div>
          <div>{athletes[1].name}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.ownOrder} />:
          </div>
          <div>{FlexColumns.comparisonOrder({}, athletes, 0).cellComponent(data)}</div>
          <div>{FlexColumns.comparisonOrder({}, athletes, 1).cellComponent(data)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.points} />:
          </div>
          <div>{FlexColumns.comparisonPoints({}, athletes, 0).cellComponent(data)}</div>
          <div>{FlexColumns.comparisonPoints({}, athletes, 1).cellComponent(data)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.time} />:
          </div>
          <div>{BrickTools.formatDuration(resultsFirst.time)}</div>
          <div>{BrickTools.formatDuration(resultsSecond.time)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.pace} />:
          </div>
          <div>{FlexColumns.comparisonPace({}, athletes, 0).cellComponent(data)}</div>
          <div>{FlexColumns.comparisonPace({}, athletes, 1).cellComponent(data)}</div>
        </div>
      );
    }

    const skippedColumns = [
      "order",
      "name",
      "author",
      "firstAthleteOrder",
      "firstAthletePoints",
      "firstAthletePace",
      "secondAthleteOrder",
      "secondAthletePoints",
      "secondAthletePace"
    ];
    let visibleRows = FlexColumns.processVisibleColumns(visibleColumns, skippedColumns, data);

    return (
      <div>
        {FlexColumns.segmentName().tileComponent(data, true, "80px")}
        <div className={this.getClassName("smallTileRows")}>{visibleRows}</div>
        <div className={this.getClassName("smallTileTable")}>{tableRows}</div>
      </div>
    );
  },

  _getAthletes() {
    let correctKey = this.props.trailtour.totalResults.menResults[0] ? "menResults" : "womenResults";
    return this.props.stravaIdList.map(stravaId => {
      return this.props.trailtour.totalResults[correctKey].find(result => result.stravaId === stravaId);
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let athletes = this._getAthletes();
    const ucSettings = {
      columns: [
        FlexColumns.stravaTtLink(),
        FlexColumns.segmentNameWithOrder(),
        FlexColumns.distance(),
        FlexColumns.elevation({ width: "s" }),
        FlexColumns.comparisonOrder({}, athletes, 0),
        FlexColumns.comparisonPoints({}, athletes, 0),
        FlexColumns.comparisonPace({}, athletes, 0),
        FlexColumns.comparisonRunDate({}, athletes, 0),
        FlexColumns.comparisonOrder({}, athletes, 1),
        FlexColumns.comparisonPoints({}, athletes, 1),
        FlexColumns.comparisonPace({}, athletes, 1),
        FlexColumns.comparisonRunDate({}, athletes, 1)
      ]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings}>
          <UU5.FlexTiles.List
            fixedHeader
            height={"800px"}
            bars={[
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
              <NameFilterBar
                key={"nameFilterBar"}
                right={
                  <CompareResultsButton
                    year={this.props.trailtour.year}
                    firstAthlete={athletes[0]}
                    secondAthlete={athletes[1]}
                  />
                }
              />,
              <UU5.FlexTiles.InfoBar key={"infoBar"} />
            ]}
            tile={this._getSmallTile}
          />
        </UU5.FlexTiles.ListController>
      </UU5.FlexTiles.DataManager>
    );
  }
  //@@viewOff:render
});

export default AthleteComparisonList;
