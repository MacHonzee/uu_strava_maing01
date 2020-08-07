//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TrailtourTools from "./tools";
import NameFilter from "./name-filter";
import FlexColumns from "./config/flex-columns";
//@@viewOff:imports

const PAGE_SIZE = 1000;

const Lsi = {
  nameFilter: {
    cs: "Vyhledávání",
    en: "Search"
  }
};

export const ClubResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ClubResults",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    year: UU5.PropTypes.string.isRequired,
    handleReload: UU5.PropTypes.func
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
    let dataCopy = JSON.parse(JSON.stringify(this.props.data.totalResults.clubResults));

    dataCopy = TrailtourTools.handleFiltering(dataCopy, dtoIn.filterMap);

    dataCopy = TrailtourTools.handleSorting(dataCopy, dtoIn.sorterList);

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
          {data.order}. {FlexColumns.clubByName({}, this.props.year).cellComponent(data)}
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
        FlexColumns.order(),
        FlexColumns.clubByName({}, this.props.year),
        FlexColumns.clubPoints(),
        FlexColumns.clubRunners(),
        FlexColumns.clubResults(),
        FlexColumns.clubAvgPoints()
      ]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings}>
          <UU5.FlexTiles.List
            fixedHeader
            height={"800px"}
            bars={[
              <UU5.FlexTiles.Bar
                key={"nameFilter"}
                title={Lsi.nameFilter}
                layout="xs-vertical s-vertical m-horizontal"
                left={<NameFilter showLabel={false} />}
              />,
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

export default ClubResults;
