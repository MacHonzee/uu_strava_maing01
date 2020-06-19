//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SegmentLink from "../bricks/segment-link";
import BrickTools from "../bricks/tools";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import SegmentDistance from "../bricks/segment-distance";
import SegmentElevation from "../bricks/segment-elevation";
import SegmentPace from "../bricks/segment-pace";
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
    data: UU5.PropTypes.object.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired
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

    // handle any sorting necessary
    if (dtoIn.sorterList && dtoIn.sorterList.length > 0) {
      dataCopy.sort((item1, item2) => {
        for (let i = 0; i < dtoIn.sorterList.length; i++) {
          let { key, descending } = dtoIn.sorterList[i];
          let multiplier = descending ? -1 : 1;

          let result;
          if (key === "name" || key === "author") {
            let result = multiplier * item1[key].localeCompare(item2[key]);
            if (result !== 0) return result;
          }

          if (key === "ownOrder" || key === "points" || key === "time") {
            if (key === "ownOrder") key = "order";
            let resultKey = this.props.sex === "male" ? "menResults" : "womenResults";
            let defaultResult = {
              order: 0,
              points: 0,
              time: 0
            };
            let item1Result = item1[resultKey][0] || defaultResult;
            let item2Result = item2[resultKey][0] || defaultResult;
            if (item1Result[key] > item2Result[key]) {
              result = multiplier;
            } else if (item1Result[key] < item2Result[key]) {
              result = -1 * multiplier;
            } else {
              result = 0;
            }
            if (result !== 0) return result;
          }

          if (key === "runnerCount") {
            key = this.props.sex === "male" ? "menResultsTotal" : "womenResultsTotal";
          }

          if (item1[key] > item2[key]) {
            result = multiplier;
          } else if (item1[key] < item2[key]) {
            result = -1 * multiplier;
          } else {
            result = 0;
          }
          if (result !== 0) return result;
        }
      });
    }

    return {
      itemList: dataCopy,
      pageInfo: {
        pageSize: PAGE_SIZE,
        pageIndex: 0,
        total: dataCopy.length
      }
    };
  },

  _getNameCell({ name, author, id }) {
    return (
      <UU5.Common.Fragment>
        <UU5.Bricks.Div>
          <UU5.Bricks.Link href={"tourDetail?id=" + id}>{name}</UU5.Bricks.Link>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div>{author}</UU5.Bricks.Div>
      </UU5.Common.Fragment>
    );
  },

  _getLinksCell({ stravaId, link }) {
    return (
      <UU5.Common.Fragment>
        <SegmentLink stravaId={stravaId} style={{ marginRight: "4px" }}>
          <UU5.Bricks.Image
            src={"./assets/strava_symbol_orange.png"}
            responsive={false}
            alt={"strava_symbol_orange"}
            width={"32px"}
          />
        </SegmentLink>
        <UU5.Bricks.Link href={link} target={"_blank"}>
          <UU5.Bricks.Image src={"./assets/inov8-logo.png"} responsive={false} alt={"trailtour-logo"} width={"24px"} />
        </UU5.Bricks.Link>
      </UU5.Common.Fragment>
    );
  },

  _getCorrectResults(data) {
    if (data.womenResults[0]) {
      return { results: data.womenResults[0] || {}, sex: "female", total: data.womenResultsTotal };
    } else {
      return { results: data.menResults[0] || {}, sex: "male", total: data.menResultsTotal };
    }
  },

  _getOwnOrder(data) {
    let { results, total } = this._getCorrectResults(data);
    if (results.order) {
      return (
        <UU5.Common.Fragment>
          <UU5.Bricks.Strong>{results.order}</UU5.Bricks.Strong>&nbsp;/&nbsp;{total}
        </UU5.Common.Fragment>
      );
    }
  },

  _getPoints(data) {
    let { results } = this._getCorrectResults(data);
    return results.points && <UU5.Bricks.Number value={results.points} />;
  },

  _getTime(data) {
    let { results } = this._getCorrectResults(data);
    if (results.time) {
      return (
        <UU5.Common.Fragment>
          <UU5.Bricks.Div>{BrickTools.formatDuration(results.time)}</UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <SegmentPace pace={results.pace} />
          </UU5.Bricks.Div>
        </UU5.Common.Fragment>
      );
    }
  },

  _getGpx(data) {
    return (
      // TODO nestahuje to
      <UU5.Bricks.Link href={data.gpxLink} download target={"_blank"}>
        <UU5.Bricks.Lsi lsi={TourDetailLsi.gpx} />
      </UU5.Bricks.Link>
    );
  },

  _getDistance({ segment: { distance } }) {
    return <SegmentDistance distance={distance} />;
  },

  _getElevation({ segment: { total_elevation_gain } }) {
    return <SegmentElevation elevation={total_elevation_gain} />;
  },

  _getState({ segment }) {
    return (
      <UU5.Common.Fragment>
        <UU5.Bricks.Div>{segment.state}</UU5.Bricks.Div>
        <UU5.Bricks.Div>{segment.city}</UU5.Bricks.Div>
      </UU5.Common.Fragment>
    );
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
          width: "xs"
        },
        {
          id: "strava",
          headers: [
            {
              label: TourDetailLsi.strava
            },
            {
              label: TourDetailLsi.trailtour
            }
          ],
          cellComponent: this._getLinksCell,
          width: "xs"
        },
        {
          id: "name",
          headers: [
            {
              label: TourDetailLsi.name,
              sorterKey: "name"
            },
            {
              label: TourDetailLsi.author,
              sorterKey: "author"
            }
          ],
          cellComponent: this._getNameCell,
          width: "l"
        },
        {
          id: "ownOrder",
          headers: [
            {
              label: TourDetailLsi.ownOrder,
              sorterKey: "ownOrder"
            },
            {
              label: TourDetailLsi.runnerCount,
              sorterKey: "runnerCount"
            }
          ],
          cellComponent: this._getOwnOrder,
          width: "xs"
        },
        {
          id: "points",
          headers: [
            {
              label: TourDetailLsi.points,
              sorterKey: "points"
            }
          ],
          cellComponent: this._getPoints,
          width: "xs"
        },
        {
          id: "pace",
          headers: [
            {
              label: TourDetailLsi.time,
              sorterKey: "time"
            },
            {
              label: TourDetailLsi.pace,
              sorterKey: "pace"
            }
          ],
          cellComponent: this._getTime,
          width: "xs"
        },
        {
          id: "distance",
          headers: [
            {
              label: TourDetailLsi.distance,
              sorterKey: "distance"
            }
          ],
          cellComponent: this._getDistance,
          width: "xs"
        },
        {
          id: "elevation",
          headers: [
            {
              label: TourDetailLsi.elevation,
              sorterKey: "total_elevation_gain"
            }
          ],
          cellComponent: this._getElevation,
          width: "xs"
        },
        {
          id: "location",
          headers: [
            {
              label: TourDetailLsi.state,
              sorterKey: "state"
            },
            {
              label: TourDetailLsi.city,
              sorterKey: "city"
            }
          ],
          cellComponent: this._getState,
          width: "m"
        }
      ]
    };

    return (
      <UU5.FlexTiles.DataManager {...this.getMainPropsToPass()} onLoad={this._handleLoad} pageSize={PAGE_SIZE}>
        <UU5.FlexTiles.ListController ucSettings={ucSettings}>
          <UU5.FlexTiles.List
            bars={[<UU5.FlexTiles.SorterBar key={"sorterBar"} />, <UU5.FlexTiles.InfoBar key={"infoBar"} />]}
          />
        </UU5.FlexTiles.ListController>
      </UU5.FlexTiles.DataManager>
    );
  }
  //@@viewOff:render
});

export default AthleteTourResultList;
