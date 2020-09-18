//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SegmentLink from "../bricks/segment-link";
import BrickTools from "../bricks/tools";
import SegmentDistance from "../bricks/segment-distance";
import SegmentElevation from "../bricks/segment-elevation";
import SegmentPace from "../bricks/segment-pace";
import TrailtourTools from "./tools";
import NameFilterBar from "./name-filter-bar";
import CompareResultsButton from "./compare-results-button";
import FlexColumns from "./config/flex-columns";
import TourDetailLsi from "../lsi/tour-detail-lsi";

//@@viewOff:imports

const PAGE_SIZE = 1000;

export const AthleteTourResultList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourResultList",
    classNames: {
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    trailtour: UU5.PropTypes.object.isRequired
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

  _getSmallTile({ data, visibleColumns }) {
    let { results } = FlexColumns.getCorrectResults(data);

    const skippedColumns = ["order", "name", "author"];
    let visibleRows = FlexColumns.processVisibleColumns(visibleColumns, skippedColumns, data);

    return (
      <div>
        {FlexColumns.segmentName().tileComponent(data, results.time)}
        {visibleRows}
      </div>
    );
  },

  _getAthleteForComparison() {
    return this.props.trailtour.totalResults[this.props.sex === "male" ? "menResults" : "womenResults"][0];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const ucSettings = {
      columns: [
        FlexColumns.order(),
        FlexColumns.stravaTtLink(),
        FlexColumns.segmentName(),
        FlexColumns.ownOrder(),
        FlexColumns.ownPoints(),
        FlexColumns.timeAndPace(),
        FlexColumns.distance(),
        FlexColumns.elevation(),
        FlexColumns.lastRun({}, "runDate", true)
      ]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings}>
          <UU5.FlexTiles.List
            bars={[
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
              <NameFilterBar
                key={"nameFilterBar"}
                right={
                  <CompareResultsButton
                    sex={this.props.sex}
                    year={this.props.trailtour.year}
                    firstAthlete={this._getAthleteForComparison()}
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

export default AthleteTourResultList;
