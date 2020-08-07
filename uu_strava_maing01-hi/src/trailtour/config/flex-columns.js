import * as UU5 from "uu5g04";
import AthleteLink from "../../bricks/athlete-link";
import ClubLink from "../../bricks/club-link";
import SegmentDistance from "../../bricks/segment-distance";
import SegmentElevation from "../../bricks/segment-elevation";
import SegmentLink from "../../bricks/segment-link";
import BrickTools from "../../bricks/tools";
import SegmentPace from "../../bricks/segment-pace";
import AthleteTourDetailLsi from "../../lsi/athlete-tour-detail-lsi";

import TourDetailLsi from "../../lsi/tour-detail-lsi";

const Lsi = {
  ...AthleteTourDetailLsi,
  strava: {
    cs: "Strava",
    en: "Strava"
  },
  menOrWomen: {
    cs: "Muži / Ženy",
    en: "Men / Women"
  },
  clubRunners: {
    cs: "Běžci - celkem",
    en: "Count of runners"
  },
  clubPoints: {
    cs: "Body - celkem",
    en: "Total points"
  },
  clubResults: {
    cs: "Etapy - celkem",
    en: "Results - total"
  },
  emptyHeader: {
    cs: "<uu5string/>&nbsp;",
    en: "<uu5string/>&nbsp;"
  }
};

const NUM_TO_STR = new Map();
NUM_TO_STR.set(0, "first");
NUM_TO_STR.set(1, "second");

function mergeColumn(options, column) {
  return Object.assign({}, column, options);
}

function getStravaLink({ stravaId }) {
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
}

function getAthleteLink({ name, stravaId }, year) {
  if (!year) {
    console.error("No year was passed into atheteLink column, not rendering!");
    return;
  }

  return <UU5.Bricks.Link href={`athleteTourDetail?year=${year}&stravaId=${stravaId}`}>{name}</UU5.Bricks.Link>;
}

function getClubLink(clubName, year) {
  if (!year) {
    console.error("No year was passed into atheteLink column, not rendering!");
    return;
  }

  if (clubName) {
    return <ClubLink year={year} club={clubName} />;
  }
}

function getTileComponent(column, data) {
  if (column.tileComponent && column.tileComponent !== column.cellComponent) {
    return column.tileComponent(data);
  } else {
    let component = column.cellComponent(data);
    if (component) {
      return (
        <div>
          <strong>
            <UU5.Bricks.Lsi lsi={column.headers[0].label} />
            :&nbsp;
          </strong>
          {component}
        </div>
      );
    }
  }
}

function getClubPoints({ points, pointsMen, pointsWomen }) {
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
}

function getClubRunners({ runnersTotal, runnersMen, runnersWomen }) {
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
}

function getClubResults({ resultsTotal, resultsMen, resultsWomen }) {
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
}

function getClubAvgPoints({ avgPoints, avgPointsMen, avgPointsWomen }) {
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
}

function getSexTileComponent(column, data, totalKey, menKey, womenKey, maxDecimalLength) {
  return (
    <div>
      <div>
        <strong>
          <UU5.Bricks.Lsi lsi={column.headers[0].label} />
          :&nbsp;
        </strong>
        <UU5.Bricks.Number value={data[totalKey]} maxDecimalLength={maxDecimalLength} />
      </div>
      <div>
        <UU5.Bricks.Lsi lsi={column.headers[1].label} />
        :&nbsp;
        <UU5.Bricks.Number value={data[menKey]} maxDecimalLength={maxDecimalLength} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={data[womenKey]} maxDecimalLength={maxDecimalLength} />
      </div>
    </div>
  );
}

function getDistance({ segment: { distance } }) {
  return <SegmentDistance distance={distance} />;
}

function getElevation({ segment: { total_elevation_gain } }) {
  return <SegmentElevation elevation={total_elevation_gain} />;
}

function getStravaTtLinks({ stravaId, link }) {
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
}

function getSegmentName({ name, author, id }) {
  return (
    <UU5.Common.Fragment>
      <div>
        <UU5.Bricks.Link href={"tourDetail?id=" + id}>{name}</UU5.Bricks.Link>
      </div>
      <div>{author}</div>
    </UU5.Common.Fragment>
  );
}

function getSegmentNameTile({ name, author, id, order }, shouldBeBold, labelWidth) {
  return (
    <UU5.Common.Fragment>
      <div style={{ fontWeight: shouldBeBold ? "bold" : "normal" }}>
        #{order} <UU5.Bricks.Link href={"tourDetail?id=" + id}>{name}</UU5.Bricks.Link>
      </div>
      <div>
        <strong style={labelWidth ? { display: "inline-block", width: labelWidth } : {}}>
          <UU5.Bricks.Lsi lsi={TourDetailLsi.author} />
          :&nbsp;
        </strong>
        {author}
      </div>
    </UU5.Common.Fragment>
  );
}

function getSegmentNameWithOrder({ name, author, id, order }) {
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
}

function getLocation({ segment }) {
  return (
    <UU5.Common.Fragment>
      <div>{segment.state}</div>
      <div>{segment.city}</div>
    </UU5.Common.Fragment>
  );
}

function getLocationTile({ segment }) {
  return (
    <UU5.Common.Fragment>
      <div>
        <strong>
          <UU5.Bricks.Lsi lsi={TourDetailLsi.state} />
          :&nbsp;
        </strong>
        {segment.state}
      </div>
      <div>
        <strong>
          <UU5.Bricks.Lsi lsi={TourDetailLsi.city} />
          :&nbsp;
        </strong>
        {segment.city}
      </div>
    </UU5.Common.Fragment>
  );
}

function getCorrectResults(data) {
  if (data.womenResults[0]) {
    return { results: data.womenResults[0] || {}, sex: "female", total: data.womenResultsTotal };
  } else {
    return { results: data.menResults[0] || {}, sex: "male", total: data.menResultsTotal };
  }
}

function getOwnOrder(data) {
  let { results, total } = getCorrectResults(data);
  if (results.order) {
    return (
      <UU5.Common.Fragment>
        <UU5.Bricks.Strong>{results.order}</UU5.Bricks.Strong>&nbsp;/&nbsp;{total}
      </UU5.Common.Fragment>
    );
  }
}

function getOwnPoints(data) {
  let { results } = getCorrectResults(data);
  return results.points && <UU5.Bricks.Number value={results.points} />;
}

function getTimeAndPace(data) {
  let { results } = getCorrectResults(data);
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
}

function getTimeAndPaceTile(data) {
  let { results } = getCorrectResults(data);
  if (results.time) {
    return (
      <UU5.Common.Fragment>
        <div>
          <strong>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.time} />
            :&nbsp;
          </strong>
          {BrickTools.formatDuration(results.time)}
        </div>
        <div>
          <strong>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.pace} />
            :&nbsp;
          </strong>
          <SegmentPace pace={results.pace} />
        </div>
      </UU5.Common.Fragment>
    );
  }
}

function getAthleteHeader(athletes, index) {
  return `
      <uu5string/>
      <UU5.Bricks.Span style="white-space: nowrap; font-weight: bold;">
        ${athletes[index].name}
      </UU5.Bricks.Span>
    `;
}

function getComparisonResults(data, resultIndex, athletes) {
  let sex, resultKey;
  if (data.womenResults.length > 0) {
    sex = "female";
    resultKey = "womenResults";
  } else {
    sex = "male";
    resultKey = "menResults";
  }
  let stravaId = athletes[resultIndex].stravaId;
  let result = data[resultKey].find(res => res.stravaId === stravaId);
  return { results: result || {}, sex, total: data[resultKey + "Total"] };
}

function getComparisonOrder(data, resultIndex, athletes) {
  let { results, total } = getComparisonResults(data, resultIndex, athletes);
  if (results.order) {
    return (
      <UU5.Common.Fragment>
        <strong>{results.order}</strong>&nbsp;/&nbsp;{total}
      </UU5.Common.Fragment>
    );
  }
}

function getComparisonPoints(data, resultIndex, athletes) {
  let { results } = getComparisonResults(data, resultIndex, athletes);
  return results.points && <UU5.Bricks.Number value={results.points} />;
}

function getComparisonPace(data, resultIndex, athletes) {
  let { results } = getComparisonResults(data, resultIndex, athletes);
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
}

const FlexColumns = {
  processVisibleColumns(visibleColumns, skippedColumns, data) {
    let rows = [];
    visibleColumns.forEach(column => {
      if (skippedColumns.includes(column.id)) return;
      let cellComponent = getTileComponent(column, data);
      if (!cellComponent) return;
      rows.push(cellComponent);
    });
    return rows;
  },

  order(options = {}) {
    const column = {
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
    };
    return mergeColumn(options, column);
  },

  stravaLink(options = {}) {
    const column = {
      id: "stravaLink",
      headers: [
        {
          label: Lsi.strava
        }
      ],
      cellComponent: getStravaLink,
      width: "xxs"
    };
    column.tileComponent = data => (
      <div style={{ position: "absolute", top: "4px", right: "4px" }}>{column.cellComponent(data)}</div>
    );
    return mergeColumn(options, column);
  },

  stravaTtLink(options = {}) {
    const column = {
      id: "strava",
      headers: [
        {
          label: TourDetailLsi.strava
        },
        {
          label: TourDetailLsi.trailtour
        }
      ],
      cellComponent: getStravaTtLinks,
      width: "xs"
    };
    column.tileComponent = data => (
      <div style={{ position: "absolute", top: "4px", right: "4px" }}>{column.cellComponent(data)}</div>
    );
    return mergeColumn(options, column);
  },

  athleteLink(options = {}, year) {
    const column = {
      id: "name",
      headers: [
        {
          label: Lsi.name,
          sorterKey: "name"
        }
      ],
      cellComponent: data => getAthleteLink(data, year),
      width: "l",
      visibility: "always"
    };
    return mergeColumn(options, column);
  },

  clubLink(options = {}, year) {
    const column = {
      id: "club",
      headers: [
        {
          label: Lsi.club,
          sorterKey: "club"
        }
      ],
      cellComponent: data => getClubLink(data.club, year),
      width: "m"
    };
    return mergeColumn(options, column);
  },

  clubByName(options = {}, year) {
    const column = {
      id: "name",
      headers: [
        {
          label: Lsi.name,
          sorterKey: "name"
        }
      ],
      cellComponent: data => getClubLink(data.name, year),
      width: "m",
      visibility: "always"
    };
    return mergeColumn(options, column);
  },

  points(options = {}) {
    const column = {
      id: "points",
      headers: [
        {
          label: Lsi.points,
          sorterKey: "points"
        }
      ],
      cellComponent: ({ points }) => <UU5.Bricks.Number value={points} />,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  totalCount(options = {}) {
    const column = {
      id: "totalCount",
      headers: [
        {
          label: Lsi.runCount,
          sorterKey: "totalCount"
        }
      ],
      cellComponent: ({ totalCount }) => totalCount,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  avgPoints(options = {}) {
    const column = {
      id: "avgPoints",
      headers: [
        {
          label: Lsi.avgPoints,
          sorterKey: "avgPoints"
        }
      ],
      cellComponent: ({ avgPoints }) => <UU5.Bricks.Number value={avgPoints} maxDecimalLength={2} />,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  clubPoints(options = {}) {
    const column = {
      id: "clubPoints",
      headers: [
        {
          label: Lsi.clubPoints,
          sorterKey: "points"
        },
        {
          label: Lsi.menOrWomen
        }
      ],
      cellComponent: getClubPoints,
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, "points", "pointsMen", "pointsWomen", 0);
    };
    return mergeColumn(options, column);
  },

  clubRunners(options = {}) {
    const column = {
      id: "clubRunners",
      headers: [
        {
          label: Lsi.clubRunners,
          sorterKey: "runnersTotal"
        },
        {
          label: Lsi.menOrWomen
        }
      ],
      cellComponent: getClubRunners,
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, "runnersTotal", "runnersMen", "runnersWomen");
    };
    return mergeColumn(options, column);
  },

  clubResults(options = {}) {
    const column = {
      id: "clubResults",
      headers: [
        {
          label: Lsi.clubResults,
          sorterKey: "resultsTotal"
        },
        {
          label: Lsi.menOrWomen
        }
      ],
      cellComponent: getClubResults,
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, "resultsTotal", "resultsMen", "resultsWomen");
    };
    return mergeColumn(options, column);
  },

  clubAvgPoints(options = {}) {
    const column = {
      id: "clubAvgPoints",
      headers: [
        {
          label: Lsi.avgPoints,
          sorterKey: "avgPoints"
        },
        {
          label: Lsi.menOrWomen
        }
      ],
      cellComponent: getClubAvgPoints,
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, "avgPoints", "avgPointsMen", "avgPointsWomen", 2);
    };
    return mergeColumn(options, column);
  },

  segmentName(options = {}) {
    const column = {
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
      cellComponent: getSegmentName,
      tileComponent: getSegmentNameTile,
      width: "l",
      visibility: "always"
    };
    return mergeColumn(options, column);
  },

  segmentNameWithOrder() {
    return FlexColumns.segmentName({ cellComponent: getSegmentNameWithOrder });
  },

  distance(options = {}) {
    const column = {
      id: "distance",
      headers: [
        {
          label: TourDetailLsi.distance,
          sorterKey: "distance"
        }
      ],
      cellComponent: getDistance,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  elevation(options = {}) {
    const column = {
      id: "elevation",
      headers: [
        {
          label: TourDetailLsi.elevation,
          sorterKey: "total_elevation_gain"
        }
      ],
      cellComponent: getElevation,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  location(options = {}) {
    const column = {
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
      cellComponent: getLocation,
      tileComponent: getLocationTile,
      width: "m"
    };
    return mergeColumn(options, column);
  },

  getCorrectResults,

  getComparisonResults,

  ownOrder(options = {}) {
    const column = {
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
      cellComponent: getOwnOrder,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  ownPoints(options = {}) {
    const column = {
      id: "points",
      headers: [
        {
          label: TourDetailLsi.points,
          sorterKey: "points"
        }
      ],
      cellComponent: getOwnPoints,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  time(options = {}) {
    const column = {
      id: "time",
      headers: [
        {
          label: TourDetailLsi.time,
          sorterKey: "time"
        }
      ],
      cellComponent: ({ time }) => BrickTools.formatDuration(time),
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  pace(options = {}) {
    const column = {
      id: "pace",
      headers: [
        {
          label: TourDetailLsi.pace,
          sorterKey: "pace"
        }
      ],
      cellComponent: ({ pace }) => <SegmentPace pace={pace} />,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  timeAndPace(options = {}) {
    const column = {
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
      cellComponent: getTimeAndPace,
      tileComponent: getTimeAndPaceTile,
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  comparisonOrder(options = {}, athletes, index) {
    const column = {
      id: NUM_TO_STR.get(index) + "AthleteOrder",
      headers: [
        {
          label: getAthleteHeader(athletes, index)
        },
        {
          label: TourDetailLsi.ownOrder
        }
      ],
      cellComponent: data => getComparisonOrder(data, index, athletes),
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  comparisonPoints(options = {}, athletes, index) {
    const column = {
      id: NUM_TO_STR.get(index) + "AthletePoints",
      headers: [
        {
          label: Lsi.emptyHeader
        },
        {
          label: TourDetailLsi.points
        }
      ],
      cellComponent: data => getComparisonPoints(data, index, athletes),
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  comparisonPace(options = {}, athletes, index) {
    const column = {
      id: NUM_TO_STR.get(index) + "AthletePace",
      headers: [
        {
          label: Lsi.emptyHeader
        },
        {
          label: TourDetailLsi.time
        }
      ],
      cellComponent: data => getComparisonPace(data, index, athletes),
      width: "xs"
    };
    return mergeColumn(options, column);
  }
};

export default FlexColumns;