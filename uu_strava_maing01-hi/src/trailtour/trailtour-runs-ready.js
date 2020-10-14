//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import FlexColumns from "./config/flex-columns";
import SexFilterBar from "./sex-filter-bar";
import TrailtourTools from "./tools";
import NameFilter from "./name-filter";
import BrickTools from "../bricks/tools";
import DateRangeFilterBar from "./date-range-filter-bar";
import TourDetailLsi from "../lsi/tour-detail-lsi";
//@@viewOff:imports

const PAGE_SIZE = 100;

export const TrailtourRunsReady = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TrailtourRunsReady",
    classNames: {
      main: (props, state) => Config.Css.css``,
      stravaLinkTile: Config.Css.css`
        display: flex;
        position: relative;

        > div > div:nth-child(2) {
          display: inline;
        }

        > div:last-child {
          position: absolute;
          right: 8px;
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    handleLoad: UU5.PropTypes.func.isRequired,
    year: UU5.PropTypes.string.isRequired
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
    // handle sex filtering
    let targetData = dtoIn.filterMap.sex === "male" ? "menResults" : "womenResults";
    let itemList = [];
    this.props.data.trailtourResults.forEach(allTtResults => {
      allTtResults[targetData].forEach(ttResult => {
        ttResult.segment = allTtResults.segment;
        ttResult.link = allTtResults.link;
        ttResult.tourName = allTtResults.name;
        ttResult.tourStravaId = allTtResults.stravaId;
        ttResult.tourOrder = allTtResults.order;
        ttResult.author = allTtResults.author;
        ttResult.id = allTtResults._id;
        ttResult.pace = BrickTools.countPace(ttResult.time, ttResult.segment.distance);
        itemList.push(ttResult);
      });
    });
    itemList.sort((itemA, itemB) => itemB.runDate.localeCompare(itemA.runDate));

    itemList = TrailtourTools.handleFiltering(itemList, dtoIn.filterMap);

    itemList = TrailtourTools.handleSorting(itemList, dtoIn.sorterList);

    return {
      itemList,
      pageInfo: {
        pageSize: PAGE_SIZE,
        pageIndex: 0,
        total: itemList.length
      }
    };
  },

  _getSmallTile({ data, visibleColumns }) {
    const skippedColumns = ["tourName"];
    let visibleRows = FlexColumns.processVisibleColumns(visibleColumns, skippedColumns, data);

    return <div>{visibleRows}</div>;
  },

  _getOrderCell({ order }) {
    return (
      <>
        <strong>{order}</strong>&nbsp;
        {order === 1 && `🥇`}
        {order === 2 && `🥈`}
        {order === 3 && `🥉`}
      </>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let segmentNameColumn = FlexColumns.segmentName(
      { id: "tourName", width: "l" },
      { name: "tourName", order: "tourOrder" }
    );
    let stravaTtColumn = FlexColumns.stravaTtLink({}, { stravaId: "tourStravaId" });

    stravaTtColumn.tileComponent = data => (
      <div className={this.getClassName("stravaLinkTile")}>
        <div>
          <strong>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.name} />
            :&nbsp;
          </strong>
          {segmentNameColumn.tileComponent(data)}
        </div>
        <div> {stravaTtColumn.cellComponent(data)}</div>
      </div>
    );
    segmentNameColumn.headers[0].sorterKey = "tourName";

    const ucSettings = {
      columns: [
        FlexColumns.lastRun({}, "runDate"),
        FlexColumns.stravaLink(),
        FlexColumns.athleteLink({ width: "m" }, this.props.year),
        FlexColumns.clubLink({ width: "m" }, this.props.year),
        stravaTtColumn,
        segmentNameColumn,
        FlexColumns.distance(),
        FlexColumns.elevation({ width: "s" }),
        FlexColumns.order({ cellComponent: this._getOrderCell }),
        FlexColumns.points(),
        FlexColumns.time(),
        FlexColumns.pace()
      ]
    };

    const defaultView = {
      filters: [{ key: "sex", value: SexFilterBar.getDefaultValue() }]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings} defaultView={defaultView}>
          <UU5.FlexTiles.List
            bars={[
              <SexFilterBar key={"sexFilterBar"} right={<NameFilter />} />,
              <DateRangeFilterBar key={"dateRangeFilterBar"} onChangeCb={this.props.handleLoad} />,
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
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

export default TrailtourRunsReady;
