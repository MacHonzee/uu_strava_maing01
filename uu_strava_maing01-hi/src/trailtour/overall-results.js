//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteLink from "../bricks/athlete-link";
import SexFilterBar from "./sex-filter-bar";
import AthleteTourDetailLsi from "../lsi/athlete-tour-detail-lsi";
import UpdateTrailtourButton from "./update-trailtour-button";
import TrailtourTools from "./tools";
import NameFilter from "./name-filter";
//@@viewOff:imports

const Lsi = {
  ...AthleteTourDetailLsi,
  strava: {
    cs: "Strava",
    en: "Strava"
  },
  generatedStamp: {
    cs: "Poslední update: ",
    en: "Last update: "
  }
};

const PAGE_SIZE = 1000;

export const OverallResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "OverallResults",
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
    // handle sex filtering
    let targetData = dtoIn.filterMap.sex === "male" ? "menResults" : "womenResults";
    let dataCopy = JSON.parse(JSON.stringify(this.props.data.totalResults[targetData]));

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

  _getAthleteLink({ name, stravaId }) {
    return (
      <UU5.Bricks.Link href={`athleteTourDetail?year=${this.props.year}&stravaId=${stravaId}`}>{name}</UU5.Bricks.Link>
    );
  },

  _getStravaLink({ stravaId }) {
    return (
      <AthleteLink stravaId={stravaId}>
        <UU5.Bricks.Image
          src={"./assets/strava_symbol_orange.png"}
          responsive={false}
          alt={"strava_symbol_orange"}
          width={"32px"}
        />
      </AthleteLink>
    );
  },

  _getSmallTile({ data, visibleColumns }) {
    let { order } = data;

    let rows = [];
    rows.push(
      <div style={{ position: "relative" }}>
        {order}. {this._getAthleteLink(data)}
      </div>
    );

    const skippedColumns = ["order", "name"];
    visibleColumns.forEach(column => {
      if (skippedColumns.includes(column.id)) return;
      let cellComponent = column.cellComponent(data);
      if (!cellComponent) return;

      if (column.id === "stravaLink") {
        rows.push(<div style={{ position: "absolute", top: "4px", right: "4px" }}>{cellComponent}</div>);
        return;
      }

      rows.push(
        <div>
          <strong>
            <UU5.Bricks.Lsi lsi={column.headers[0].label} />
            :&nbsp;
          </strong>
          {cellComponent}
        </div>
      );
    });

    return <div>{rows}</div>;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
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
          width: "xs",
          visibility: "always"
        },
        {
          id: "stravaLink",
          headers: [
            {
              label: Lsi.strava
            }
          ],
          cellComponent: this._getStravaLink,
          width: "xs"
        },
        {
          id: "name",
          headers: [
            {
              label: Lsi.name,
              sorterKey: "name"
            }
          ],
          cellComponent: this._getAthleteLink,
          width: "l",
          visibility: "always"
        },
        {
          id: "club",
          headers: [
            {
              label: Lsi.club,
              sorterKey: "club"
            }
          ],
          cellComponent: ({ club }) => club,
          width: "m"
        },
        {
          id: "points",
          headers: [
            {
              label: Lsi.points,
              sorterKey: "points"
            }
          ],
          cellComponent: ({ points }) => <UU5.Bricks.Number value={points} />,
          width: "s"
        },
        {
          id: "totalCount",
          headers: [
            {
              label: Lsi.runCount,
              sorterKey: "totalCount"
            }
          ],
          cellComponent: ({ totalCount }) => totalCount,
          width: "s"
        },
        {
          id: "avgPoints",
          headers: [
            {
              label: Lsi.avgPoints,
              sorterKey: "avgPoints"
            }
          ],
          cellComponent: ({ avgPoints }) => <UU5.Bricks.Number value={avgPoints} maxDecimalLength={2} />,
          width: "s"
        }
      ]
    };

    const defaultView = {
      filters: [{ key: "sex", value: "female" }]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings} defaultView={defaultView}>
          <UU5.FlexTiles.List
            bars={[
              <SexFilterBar key={"sexFilterBar"} right={<NameFilter />} />,
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

export default OverallResults;
