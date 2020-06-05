//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SexFilterBar from "./sex-filter-bar";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import BrickTools from "../bricks/tools";
import SegmentPace from "../bricks/segment-pace";
import AthleteLink from "../bricks/athlete-link";
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

    // handle any sorting necessary
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

  _getName({ name, stravaId }) {
    return <UU5.Bricks.Link href={`athleteTourDetail?year=${2020}&stravaId=${stravaId}`}>{name}</UU5.Bricks.Link>;
  },

  _getStravaLink({ stravaId }) {
    return (
      <AthleteLink stravaId={stravaId}>
        <UU5.Bricks.Image src={"./assets/strava-logo.png"} responsive={false} alt={"strava-logo"} width={"24px"} />
      </AthleteLink>
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
            }
          ],
          cellComponent: this._getStravaLink,
          width: "xs"
        },
        {
          id: "name",
          headers: [
            {
              label: TourDetailLsi.name,
              sorterKey: "name"
            }
          ],
          cellComponent: this._getName,
          width: "xl"
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
          width: "s"
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
          width: "s"
        },
        {
          id: "pace",
          headers: [
            {
              label: TourDetailLsi.pace,
              sorterKey: "pace"
            }
          ],
          cellComponent: ({ time }) => <SegmentPace time={time} distance={this.props.data.segment.distance} />,
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
              <SexFilterBar key={"sexFilterBar"} />,
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

export default TourDetailResultList;
