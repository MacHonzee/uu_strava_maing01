//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TrailtourTools from "./tools";
import NameFilterBar from "./name-filter-bar";
import FlexColumns from "./config/flex-columns";
//@@viewOff:imports

const PAGE_SIZE = 1000;

export const OverallSegments = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "OverallSegments",
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
    let dataCopy = JSON.parse(JSON.stringify(this.props.data.tourSegments));

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
        {FlexColumns.segmentName().tileComponent(data)}
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
        FlexColumns.stravaTtLink(),
        FlexColumns.segmentName(),
        FlexColumns.distance(),
        FlexColumns.elevation(),
        FlexColumns.location()
      ]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings}>
          <UU5.FlexTiles.List
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

export default OverallSegments;
