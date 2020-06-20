//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import UpdateTrailtourButton from "./update-trailtour-button";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import SegmentDistance from "../bricks/segment-distance";
import SegmentElevation from "../bricks/segment-elevation";
import SegmentLink from "../bricks/segment-link";
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
    let dataCopy = [...this.props.data.tourSegments];

    // handle any sorting necessary
    // TODO refactor to some sorting tools
    if (dtoIn.sorterList && dtoIn.sorterList.length > 0) {
      dataCopy.sort((item1, item2) => {
        for (let i = 0; i < dtoIn.sorterList.length; i++) {
          let { key, descending } = dtoIn.sorterList[i];
          let multiplier = descending ? -1 : 1;

          let result;
          if (key === "name") {
            let result = multiplier * item1.name.localeCompare(item2.name);
            if (result !== 0) return result;
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

  // FIXME lots of copy paste for columns between the routes
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
            bars={[
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
              <UU5.FlexTiles.InfoBar key={"infoBar"} />
            ]}
          />
        </UU5.FlexTiles.ListController>
      </UU5.FlexTiles.DataManager>
    );
  }
  //@@viewOff:render
});

export default OverallSegments;