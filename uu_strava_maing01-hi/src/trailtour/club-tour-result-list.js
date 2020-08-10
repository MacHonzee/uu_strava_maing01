//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import FlexColumns from "./config/flex-columns";
import NameFilterBar from "./name-filter-bar";
import CompareResultsButton from "./compare-results-button";
import TrailtourTools from "./tools";
//@@viewOff:imports

const PAGE_SIZE = 1000;

export const ClubTourResultList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ClubTourResultList",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    trailtour: UU5.PropTypes.object.isRequired,
    clubResults: UU5.PropTypes.array.isRequired
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
    let dataCopy = JSON.parse(JSON.stringify(this.props.clubResults));

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

  _getSmallTile({ data, visibleColumns }) {
    const skippedColumns = ["order", "name"];
    let visibleRows = FlexColumns.processVisibleColumns(visibleColumns, skippedColumns, data);

    return (
      <div>
        <div style={{ position: "relative" }}>
          {data.order}. {FlexColumns.clubByName({}, this.props.trailtour.year).cellComponent(data)}
        </div>
        {visibleRows}
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const ucSettings = {
      columns: [
        FlexColumns.stravaTtLink(),
        FlexColumns.segmentNameWithOrder(),
        FlexColumns.distance(),
        FlexColumns.elevation(),
        FlexColumns.clubPoints({ width: "s" }, "clubResultsPoints", "menResultsPoints", "womenResultsPoints"),
        FlexColumns.clubResults({ width: "s" }, "clubResultsCount", "menResultsCount", "womenResultsCount"),
        FlexColumns.clubAvgPoints(
          { width: "s" },
          "clubResultsAvgPoints",
          "menResultsAvgPoints",
          "womenResultsAvgPoints"
        )
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
              <NameFilterBar key={"nameFilterBar"} />,
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

export default ClubTourResultList;
