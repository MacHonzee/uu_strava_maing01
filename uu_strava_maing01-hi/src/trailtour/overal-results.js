//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import AthleteLink from "../bricks/athlete-link";
//@@viewOff:imports

const Lsi = {
  name: {
    cs: "Jméno",
    en: "Name"
  },
  strava: {
    cs: "Strava",
    en: "Strava"
  },
  order: {
    cs: "Pořadí",
    en: "Order"
  },
  points: {
    cs: "Body",
    en: "Points"
  },
  sexFilter: {
    cs: "Pohlaví",
    en: "Sex"
  },
  sex: {
    males: {
      cs: "Muži",
      en: "Males"
    },
    females: {
      cs: "Ženy",
      en: "Females"
    }
  }
};

const PAGE_SIZE = 1000;

export const OveralResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "OveralResults",
    classNames: {
      main: (props, state) => Config.Css.css``,
      filterBar: (props, state) => Config.Css.css`
        .uu5-common-div.uu5-bricks-resize {
          display: inline;
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    year: UU5.PropTypes.number.isRequired
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

  _getFilter(context) {
    let currentValue = context.activeFilters.find(filter => filter.key === "sex") || {};
    let value = currentValue.value;

    return (
      <UU5.Forms.SwitchSelector
        inputWidth={"300px"}
        value={value}
        items={[
          { value: "male", content: <UU5.Bricks.Lsi lsi={Lsi.sex.males} /> },
          { value: "female", content: <UU5.Bricks.Lsi lsi={Lsi.sex.females} /> }
        ]}
        onChange={opt => this._handleOnFilterChange(opt, context)}
      />
    );
  },

  _handleOnFilterChange(opt, context) {
    context.addFilter("sex", opt.value);
  },

  _getAthleteLink({ name, stravaId }) {
    return (
      <UU5.Bricks.Link href={`athleteTourDetail?year=${this.props.year}&stravaId=${stravaId}`}>{name}</UU5.Bricks.Link>
    );
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
              label: Lsi.order,
              sorterKey: "order"
            }
          ],
          cellComponent: ({ order }) => order,
          width: "xs"
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
          width: "xl"
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
          width: "m"
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
              <UU5.FlexTiles.Bar
                key={"sexFilterBar"}
                className={this.getClassName("filterBar")}
                title={Lsi.sexFilter}
                layout="xs-horizontal s-vertical m-horizontal"
                left={this._getFilter}
              />,
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

export default OveralResults;
