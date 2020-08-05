//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TrailtourTools from "./tools";
import NameFilter from "./name-filter";
import AthleteTourDetailLsi from "../lsi/athlete-tour-detail-lsi";
//@@viewOff:imports

const PAGE_SIZE = 1000;

const Lsi = {
  ...AthleteTourDetailLsi,
  nameFilter: {
    cs: "Vyhledávání",
    en: "Search"
  },
  points: {
    cs: "Celkem bodů",
    en: "Total points"
  },
  runnersTotal: {
    cs: "Počet běžců",
    en: "Count of runners"
  },
  menOrWomen: {
    cs: "Muži / Ženy",
    en: "Men / Women"
  },
  resultsTotal: {
    cs: "Etapy - celkem",
    en: "Results - total"
  },
  resultsMen: {
    cs: "Etapy - muži",
    en: "Results - men"
  },
  resultsWomen: {
    cs: "Etapy - ženy",
    en: "Results - women"
  },
  avgPoints: {
    cs: "Průměr bodů",
    en: "Average points"
  },
  avgPointsMen: {
    cs: "Průměr - muži",
    en: "Average - men"
  },
  avgPointsWomen: {
    cs: "Průměr - ženy",
    en: "Average - women"
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

  _getClubLink({ name }) {
    return <UU5.Bricks.Link href={`clubDetail?year=${this.props.year}&name=${name}`}>{name}</UU5.Bricks.Link>;
  },

  _getPoints({ points, pointsMen, pointsWomen }) {
    return (
      <UU5.Common.Fragment>
        <div>
          <UU5.Bricks.Number value={points} maxDecimalLength={0} />
        </div>
        <div>
          <UU5.Bricks.Number value={pointsMen} maxDecimalLength={0} /> /{" "}
          <UU5.Bricks.Number value={pointsWomen} maxDecimalLength={0} />
        </div>
      </UU5.Common.Fragment>
    );
  },

  _getRunnerCount({ runnersTotal, runnersMen, runnersWomen }) {
    return (
      <UU5.Common.Fragment>
        <div>
          <UU5.Bricks.Number value={runnersTotal} />
        </div>
        <div>
          <UU5.Bricks.Number value={runnersMen} /> / <UU5.Bricks.Number value={runnersWomen} />
        </div>
      </UU5.Common.Fragment>
    );
  },

  _getResultCount({ resultsTotal, resultsMen, resultsWomen }) {
    return (
      <UU5.Common.Fragment>
        <div>
          <UU5.Bricks.Number value={resultsTotal} />
        </div>
        <div>
          <UU5.Bricks.Number value={resultsMen} /> / <UU5.Bricks.Number value={resultsWomen} />
        </div>
      </UU5.Common.Fragment>
    );
  },

  _getAvgPoints({ avgPoints, avgPointsMen, avgPointsWomen }) {
    return (
      <UU5.Common.Fragment>
        <div>
          <UU5.Bricks.Number value={avgPoints} maxDecimalLength={2} />
        </div>
        <div>
          <UU5.Bricks.Number value={avgPointsMen} maxDecimalLength={2} /> /{" "}
          <UU5.Bricks.Number value={avgPointsWomen} maxDecimalLength={2} />
        </div>
      </UU5.Common.Fragment>
    );
  },

  _getSmallTile() {
    return "small tile";
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    // počet zaběhnutých etap
    // počet etap muži, ženy
    // průměr bodů
    // průměr bodů muži, ženy
    const ucSettings = {
      columns: [
        {
          id: "order",
          headers: [
            {
              label: Lsi.order,
              sorterKey: "order"
            }
          ],
          cellComponent: ({ order }) => order,
          width: "xxs",
          visibility: "always"
        },
        {
          id: "name",
          headers: [
            {
              label: Lsi.name,
              sorterKey: "name"
            }
          ],
          cellComponent: this._getClubLink,
          width: "m",
          visibility: "always"
        },
        {
          id: "points",
          headers: [
            {
              label: Lsi.points,
              sorterKey: "points"
            },
            {
              label: Lsi.menOrWomen
            }
          ],
          cellComponent: this._getPoints,
          width: "xs"
        },
        {
          id: "runnersTotal",
          headers: [
            {
              label: Lsi.runnersTotal,
              sorterKey: "runnersTotal"
            },
            {
              label: Lsi.menOrWomen
            }
          ],
          cellComponent: this._getRunnerCount,
          width: "xs"
        },
        {
          id: "resultsTotal",
          headers: [
            {
              label: Lsi.resultsTotal,
              sorterKey: "resultsTotal"
            },
            {
              label: Lsi.menOrWomen
            }
          ],
          cellComponent: this._getResultCount,
          width: "xs"
        },
        {
          id: "avgPoints",
          headers: [
            {
              label: Lsi.avgPoints,
              sorterKey: "avgPoints"
            },
            {
              label: Lsi.menOrWomen
            }
          ],
          cellComponent: this._getAvgPoints,
          width: "xs"
        }
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
