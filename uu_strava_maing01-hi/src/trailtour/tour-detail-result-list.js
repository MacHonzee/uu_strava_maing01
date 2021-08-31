//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SexFilterBar from "./sex-filter-bar";
import TrailtourTools from "./tools";
import NameFilter from "./name-filter";
import FlexColumns from "./config/flex-columns";
//@@viewOff:imports

const PAGE_SIZE = 1000;

export const TourDetailResultList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourDetailResultList",
    classNames: {
      main: (props, state) => Config.Css.css``,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
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
    // handle sex filtering
    let targetData = dtoIn.filterMap.sex === "male" ? "menResults" : "womenResults";
    let dataCopy = JSON.parse(JSON.stringify(this.props.data.tourDetail[targetData]));

    dataCopy = TrailtourTools.handleFiltering(dataCopy, dtoIn.filterMap);

    dataCopy = TrailtourTools.handleSorting(dataCopy, dtoIn.sorterList);

    return {
      itemList: dataCopy,
      pageInfo: {
        pageSize: PAGE_SIZE,
        pageIndex: 0,
        total: dataCopy.length,
      },
    };
  },

  _getSmallTile({ data, visibleColumns }) {
    const skippedColumns = ["order", "name"];
    let visibleRows = FlexColumns.processVisibleColumns(visibleColumns, skippedColumns, data);

    return (
      <div>
        <div>
          #{data.order} {FlexColumns.athleteLink({}, this.props.data.trailtour.year).cellComponent(data)}
        </div>
        {visibleRows}
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let year = this.props.data.trailtour.year;
    const ucSettings = {
      columns: [
        FlexColumns.order(),
        FlexColumns.stravaLink(),
        FlexColumns.athleteLink({}, year),
        FlexColumns.clubLink({}, year),
        FlexColumns.points(),
        FlexColumns.time(),
        FlexColumns.pace(),
        FlexColumns.lastRun({}, "runDate"),
      ],
    };
    const defaultView = {
      filters: [{ key: "sex", value: SexFilterBar.getDefaultValue() }],
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings} defaultView={defaultView}>
          <UU5.FlexTiles.List
            bars={[
              <SexFilterBar key={"sexFilterBar"} right={<NameFilter />} />,
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
              <UU5.FlexTiles.InfoBar key={"infoBar"} />,
            ]}
            tile={this._getSmallTile}
          />
        </UU5.FlexTiles.ListController>
      </UU5.FlexTiles.DataManager>
    );
  },
  //@@viewOff:render
});

export default TourDetailResultList;
