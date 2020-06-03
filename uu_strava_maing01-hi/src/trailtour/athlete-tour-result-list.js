//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SegmentLink from "../bricks/segment-link";
import BrickTools from "../bricks/tools";
//@@viewOff:imports

const PAGE_SIZE = 1000;

const Lsi = {
  order: {
    cs: "#",
    en: "#"
  },
  name: {
    cs: "Etapa",
    en: "Segment"
  },
  strava: {
    cs: "Strava",
    en: "Strava"
  },
  trailtour: {
    cs: "Trailtour",
    en: "Trailtour"
  },
  author: {
    cs: "Autor",
    en: "Author"
  },
  ownOrder: {
    cs: "Pořadí",
    en: "Order"
  },
  points: {
    cs: "Body",
    en: "Points"
  },
  time: {
    cs: "Čas",
    en: "Time"
  },
  runnerCount: {
    cs: "Počet běžců",
    en: "Runner count"
  },
  gpx: {
    cs: "GPX",
    en: "GPX"
  }
};

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
            let result = multiplier * item1.name.localeCompare(item2.name);
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
        <SegmentLink stravaId={stravaId} style={{ marginRight: "8px" }}>
          <UU5.Bricks.Image src={"./assets/strava-logo.png"} responsive={false} alt={"strava-logo"} width={"24px"} />
        </SegmentLink>
        <UU5.Bricks.Link href={link} target={"_blank"}>
          <UU5.Bricks.Image src={"./assets/inov8-logo.png"} responsive={false} alt={"strava-logo"} width={"24px"} />
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
    let { results } = this._getCorrectResults(data);
    return results.order;
  },

  _getPoints(data) {
    let { results } = this._getCorrectResults(data);
    return results.points && <UU5.Bricks.Number value={results.points} />;
  },

  _getTime(data) {
    let { results } = this._getCorrectResults(data);
    return results.time && BrickTools.formatDuration(results.time);
  },

  _getRunnerCount(data) {
    let { total } = this._getCorrectResults(data);
    return total;
  },

  _getGpx(data) {
    return (
      // TODO nestahuje to
      <UU5.Bricks.Link href={data.gpxLink} download target={"_blank"}>
        <UU5.Bricks.Lsi lsi={Lsi.gpx} />
      </UU5.Bricks.Link>
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
              label: Lsi.order,
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
              label: Lsi.strava
            },
            {
              label: Lsi.trailtour
            }
          ],
          cellComponent: this._getLinksCell,
          width: "xs"
        },
        {
          id: "name",
          headers: [
            {
              label: Lsi.name,
              sorterKey: "name"
            },
            {
              label: Lsi.author,
              sorterKey: "author"
            }
          ],
          cellComponent: this._getNameCell,
          width: "xl"
        },
        {
          id: "ownOrder",
          headers: [
            {
              label: Lsi.ownOrder,
              sorterKey: "ownOrder"
            }
          ],
          cellComponent: this._getOwnOrder,
          width: "xs"
        },
        {
          id: "points",
          headers: [
            {
              label: Lsi.points,
              sorterKey: "points"
            }
          ],
          cellComponent: this._getPoints,
          width: "xs"
        },
        {
          id: "time",
          headers: [
            {
              label: Lsi.time,
              sorterKey: "time"
            }
          ],
          cellComponent: this._getTime,
          width: "xs"
        },
        {
          id: "runnerCount",
          headers: [
            {
              label: Lsi.runnerCount,
              sorterKey: "runnerCount"
            }
          ],
          cellComponent: this._getRunnerCount,
          width: "xs"
        },
        {
          id: "gpx",
          headers: [
            {
              label: Lsi.gpx
            }
          ],
          cellComponent: this._getGpx,
          width: "xs"
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
