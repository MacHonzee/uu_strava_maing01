//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import SegmentLink from "../bricks/segment-link";
import TrailtourTools from "./tools";
import SegmentDistance from "../bricks/segment-distance";
import SegmentElevation from "../bricks/segment-elevation";
import BrickTools from "../bricks/tools";
import SegmentPace from "../bricks/segment-pace";
import NameFilterBar from "./name-filter-bar";
import CompareResultsButton from "./compare-results-button";
import TourDetailLsi from "../lsi/tour-detail-lsi";
//@@viewOff:imports

const Lsi = {
  emptyHeader: {
    cs: "<uu5string/>&nbsp;",
    en: "<uu5string/>&nbsp;"
  }
};

const PAGE_SIZE = 1000;

export const AthleteComparisonList = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteComparisonList",
    classNames: {
      main: (props, state) => Config.Css.css``,
      smallTileTable: Config.Css.css`
        display: flex;
        flex-direction: column;

        > div {
          display: flex;

          > div:first-child {
            width: 80px;
            font-weight: bold;
          }

          > div:not(:first-child) {
            width: calc(50% - 80px);
          }
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    stravaIdList: UU5.PropTypes.array.isRequired
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

  _getNameCell({ name, author, id, order }) {
    return (
      <UU5.Common.Fragment>
        <div>
          <UU5.Bricks.Link href={"tourDetail?id=" + id}>
            #{order} {name}
          </UU5.Bricks.Link>
        </div>
        <div>{author}</div>
      </UU5.Common.Fragment>
    );
  },

  _getDistance({ segment: { distance } }) {
    return <SegmentDistance distance={distance} />;
  },

  _getElevation({ segment: { total_elevation_gain } }) {
    return <SegmentElevation elevation={total_elevation_gain} />;
  },

  _getCorrectResults(data, resultIndex) {
    let sex, resultKey;
    if (data.womenResults.length > 0) {
      sex = "female";
      resultKey = "womenResults";
    } else {
      sex = "male";
      resultKey = "menResults";
    }
    let stravaId = this.props.stravaIdList[resultIndex];
    let result = data[resultKey].find(res => res.stravaId === stravaId);
    return { results: result || {}, sex, total: data[resultKey + "Total"] };
  },

  _getOwnOrder(data, resultIndex) {
    let { results, total } = this._getCorrectResults(data, resultIndex);
    if (results.order) {
      return (
        <UU5.Common.Fragment>
          <strong>{results.order}</strong>&nbsp;/&nbsp;{total}
        </UU5.Common.Fragment>
      );
    }
  },

  _getPoints(data, resultIndex) {
    let { results } = this._getCorrectResults(data, resultIndex);
    return results.points && <UU5.Bricks.Number value={results.points} />;
  },

  _getTime(data, resultIndex) {
    let { results } = this._getCorrectResults(data, resultIndex);
    if (results.time) {
      return (
        <UU5.Common.Fragment>
          <div>{BrickTools.formatDuration(results.time)}</div>
          <div>
            <SegmentPace pace={results.pace} />
          </div>
        </UU5.Common.Fragment>
      );
    }
  },

  _getSmallTile({ data, visibleColumns }) {
    let { id, name, author, order } = data;
    let { results: resultsFirst } = this._getCorrectResults(data, 0);
    let { results: resultsSecond } = this._getCorrectResults(data, 1);

    let rows = [];
    rows.push(
      <div style={{ position: "relative" }}>
        <div>
          #{order} <UU5.Bricks.Link href={"tourDetail?id=" + id}>{name}</UU5.Bricks.Link>
        </div>
        <div>
          <div style={{ display: "inline-block", width: "80px" }}>
            <strong>
              <UU5.Bricks.Lsi lsi={TourDetailLsi.author} />
              :&nbsp;
            </strong>
          </div>
          {author}
        </div>
      </div>
    );

    let tableRows = [];
    if (resultsFirst.time || resultsSecond.time) {
      let athletes = this._getAthletes();

      tableRows.push(
        <div style={{ fontWeight: "bold" }}>
          <div>&nbsp;</div>
          <div>{athletes[0].name}</div>
          <div>{athletes[1].name}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.ownOrder} />:
          </div>
          <div>{this._getOwnOrder(data, 0)}</div>
          <div>{this._getOwnOrder(data, 1)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.points} />:
          </div>
          <div>{this._getPoints(data, 0)}</div>
          <div>{this._getPoints(data, 1)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.time} />:
          </div>
          <div>{BrickTools.formatDuration(resultsFirst.time)}</div>
          <div>{BrickTools.formatDuration(resultsSecond.time)}</div>
        </div>
      );

      tableRows.push(
        <div>
          <div>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.pace} />:
          </div>
          <div>
            <SegmentPace pace={resultsFirst.pace} />
          </div>
          <div>
            <SegmentPace pace={resultsSecond.pace} />
          </div>
        </div>
      );
    }

    const skippedColumns = [
      "order",
      "name",
      "author",
      "firstAthleteOrder",
      "firstAthletePoints",
      "firstAthletePace",
      "secondAthleteOrder",
      "secondAthletePoints",
      "secondAthletePace"
    ];
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
            <div style={{ display: "inline-block", width: "80px" }}>
              <UU5.Bricks.Lsi lsi={column.headers[0].label} />
              :&nbsp;
            </div>
          </strong>
          {cellComponent}
        </div>
      );
    });

    return (
      <div>
        {rows}
        <div className={this.getClassName("smallTileTable")}>{tableRows}</div>
      </div>
    );
  },

  _getAthletes() {
    let correctKey = this.props.trailtour.totalResults.menResults[0] ? "menResults" : "womenResults";
    return this.props.stravaIdList.map(stravaId => {
      return this.props.trailtour.totalResults[correctKey].find(result => result.stravaId === stravaId);
    });
  },

  _getAthleteHeader(athletes, index) {
    return `
      <uu5string/>
      <UU5.Bricks.Span style="white-space: nowrap; font-weight: bold;">
        ${athletes[index].name}
      </UU5.Bricks.Span>
    `;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    // strava + trailtour
    // etapa + autor
    // délka
    // převýšení
    // Atlet 1 + Pořadí
    // Body
    // Čas + Tempo
    // Atlet 2 + Pořadí
    // Body
    // Čas + Tempo

    let athletes = this._getAthletes();

    const ucSettings = {
      columns: [
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
          width: "l",
          visibility: "always"
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
          id: "firstAthleteOrder",
          headers: [
            {
              label: this._getAthleteHeader(athletes, 0)
            },
            {
              label: TourDetailLsi.ownOrder
              // sorterKey: "ownOrder"
            }
          ],
          cellComponent: data => this._getOwnOrder(data, 0),
          width: "xs"
        },
        {
          id: "firstAthletePoints",
          headers: [
            {
              label: Lsi.emptyHeader
            },
            {
              label: TourDetailLsi.points
              // sorterKey: "points"
            }
          ],
          cellComponent: data => this._getPoints(data, 0),
          width: "xs"
        },
        {
          id: "firstAthletePace",
          headers: [
            {
              label: Lsi.emptyHeader
            },
            {
              label: TourDetailLsi.time
              // sorterKey: "time"
            }
          ],
          cellComponent: data => this._getTime(data, 0),
          width: "xs"
        },

        {
          id: "secondAthleteOrder",
          headers: [
            {
              label: this._getAthleteHeader(athletes, 1)
            },
            {
              label: TourDetailLsi.ownOrder
              // sorterKey: "ownOrder"
            }
          ],
          cellComponent: data => this._getOwnOrder(data, 1),
          width: "xs"
        },
        {
          id: "secondAthletePoints",
          headers: [
            {
              label: Lsi.emptyHeader
            },
            {
              label: TourDetailLsi.points
              // sorterKey: "points"
            }
          ],
          cellComponent: data => this._getPoints(data, 1),
          width: "xs"
        },
        {
          id: "secondAthletePace",
          headers: [
            {
              label: Lsi.emptyHeader
            },
            {
              label: TourDetailLsi.time
              // sorterKey: "time"
            }
          ],
          cellComponent: data => this._getTime(data, 1),
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
              <UU5.FlexTiles.SorterBar key={"sorterBar"} />,
              <NameFilterBar
                key={"nameFilterBar"}
                right={
                  <CompareResultsButton
                    year={this.props.trailtour.year}
                    firstAthlete={athletes[0]}
                    secondAthlete={athletes[1]}
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

export default AthleteComparisonList;
