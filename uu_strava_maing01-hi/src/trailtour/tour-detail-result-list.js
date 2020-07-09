//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SexFilterBar from "./sex-filter-bar";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import BrickTools from "../bricks/tools";
import SegmentPace from "../bricks/segment-pace";
import AthleteLink from "../bricks/athlete-link";
import AthleteTourDetailLsi from "../lsi/athlete-tour-detail-lsi";
import TrailtourTools from "./tools";
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
      main: (props, state) => Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired
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

  _getName({ name, stravaId }) {
    let year = this.props.data.trailtour.year;
    return <UU5.Bricks.Link href={`athleteTourDetail?year=${year}&stravaId=${stravaId}`}>{name}</UU5.Bricks.Link>;
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
        #{order} {this._getName(data)}
      </div>
    );

    const skippedColumns = ["order", "name"];
    visibleColumns.forEach(column => {
      if (skippedColumns.includes(column.id)) return;
      let cellComponent = column.cellComponent(data);
      if (!cellComponent) return;

      if (column.id === "strava") {
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
              label: TourDetailLsi.order,
              sorterKey: "order"
            }
          ],
          cellComponent: ({ order }) => order,
          width: "xs",
          visibility: "always"
        },
        {
          id: "strava",
          headers: [
            {
              label: TourDetailLsi.strava
            }
          ],
          cellComponent: this._getStravaLink,
          width: "xs"
        },
        {
          id: "name",
          headers: [
            {
              label: AthleteTourDetailLsi.name,
              sorterKey: "name"
            }
          ],
          cellComponent: this._getName,
          width: "l",
          visibility: "always"
        },
        {
          id: "club",
          headers: [
            {
              label: AthleteTourDetailLsi.club,
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
              label: TourDetailLsi.points,
              sorterKey: "points"
            }
          ],
          cellComponent: ({ points }) => <UU5.Bricks.Number value={points} />,
          width: "xs"
        },
        {
          id: "time",
          headers: [
            {
              label: TourDetailLsi.time,
              sorterKey: "time"
            }
          ],
          cellComponent: ({ time }) => BrickTools.formatDuration(time),
          width: "xs"
        },
        {
          id: "pace",
          headers: [
            {
              label: TourDetailLsi.pace,
              sorterKey: "pace"
            }
          ],
          cellComponent: ({ pace }) => <SegmentPace pace={pace} />,
          width: "xs"
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
              <SexFilterBar key={"sexFilterBar"} />,
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

export default TourDetailResultList;
