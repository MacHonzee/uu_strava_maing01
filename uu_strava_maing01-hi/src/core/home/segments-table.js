//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";

import Config from "../config/config.js";
import Calls from "calls";
import "./segments-table.less";
import SegmentTile from "./segment-tile";
import ItemsContext from "../../context/segments-list-context";
//@@viewOff:imports

const SegmentsTable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SegmentsTable",
    classNames: {
      main: Config.CSS + "segments-table",
    }
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
  _getSortItems() {
    return [
      {
        key: "name",
        name: { cs: "Název", en: "Name" }
      },
      {
        key: "distance",
        name: { cs: "Vzdálenost", en: "Distance" }
      },
      {
        key: "total_elevation_gain",
        name: { cs: "Převýšení", en: "Elevation gain" }
      },
      {
        key: "climb_category",
        name: { cs: "Kategorie výstupu", en: "Climb category" }
      },
      {
        key: "rank",
        name: { cs: "Rank", en: "Rank" },
        sortFn: (a, b) => a.own_leaderboard.rank - b.own_leaderboard.rank
      },
    ]
  },

  _getChild(data) {
    return (
      <UU5.Tiles.ListController data={data} selectable={false}>
        {/*<UU5.Tiles.ActionBar title="Seznam segmentů" actions={this._getActions()} />*/}
        {/*<UU5.Tiles.BulkActionBar actions={this._getBulkActions()} />*/}
        {/*<UU5.Tiles.FilterBar simpleFilterPanel filters={this._getFilters()} filterValues={this._getInitFilters()} />*/}
        <UU5.Tiles.InfoBar sortItems={this._getSortItems()} />
        <UU5.Tiles.List
          tile={<SegmentTile />}
          tileHeight={"auto"}
          rowSpacing={8}
          scrollElement={window}
        />
      </UU5.Tiles.ListController>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <ItemsContext.Consumer>
        {({ errorState, errorData, data }) => {
          if (errorState) {
            return <UU5.Bricks.Error errorData={errorData}/>;
          } else if (data) {
            let correctData = data && (data.data || data);
            return this._getChild(correctData);
          } else {
            return <UU5.Bricks.Loading />;
          }
        }}
      </ItemsContext.Consumer>
    );
  }
  //@@viewOff:render
});

export default SegmentsTable;
