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

function getAthleteAndClubLink({ name, stravaId, club }, year) {
  if (!year) {
    console.error("No year was passed into atheteLink column, not rendering!");
    return;
  }

  return (
    <UU5.Common.Fragment>
      <div>{getAthleteLink({ name, stravaId }, year)}</div>
      <div>{getClubLink(club, year)}</div>
    </UU5.Common.Fragment>
  );
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

function getSexCellComponent(data, totalKey, menKey, womenKey, maxDecimalLength) {
  return (
    <UU5.Common.Fragment>
      <div>
        <UU5.Bricks.Number value={data[totalKey]} maxDecimalLength={maxDecimalLength} />
      </div>
      <div>
        <UU5.Bricks.Number value={data[menKey]} maxDecimalLength={maxDecimalLength} />
        &nbsp;/&nbsp;
        <UU5.Bricks.Number value={data[womenKey]} maxDecimalLength={maxDecimalLength} />
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

function getStravaTtLinks(data, keyOverrides) {
  let stravaIdKey = keyOverrides.stravaId || "stravaId";
  let linkKey = keyOverrides.link || "link";
  return (
    <UU5.Common.Fragment>
      <SegmentLink stravaId={data[stravaIdKey]} style={{ marginRight: "4px" }}>
        <UU5.Bricks.Image
          src={"./assets/strava_symbol_orange.png"}
          responsive={false}
          alt={"strava_symbol_orange"}
          width={"32px"}
        />
      </SegmentLink>
      <UU5.Bricks.Link href={data[linkKey]} target={"_blank"}>
        <UU5.Bricks.Image src={"./assets/inov8-logo.png"} responsive={false} alt={"trailtour-logo"} width={"24px"} />
      </UU5.Bricks.Link>
    </UU5.Common.Fragment>
  );
}

function getSegmentName(data, keyOverrides) {
  let nameKey = keyOverrides.name || "name";
  let authorKey = keyOverrides.author || "author";
  let idKey = keyOverrides.id || "id";
  return (
    <UU5.Common.Fragment>
      <div>
        <UU5.Bricks.Link href={"tourDetail?id=" + data[idKey]}>{data[nameKey]}</UU5.Bricks.Link>
      </div>
      <div>{data[authorKey]}</div>
    </UU5.Common.Fragment>
  );
}

function getSegmentNameTile(data, shouldBeBold, labelWidth, keyOverrides) {
  let nameKey = keyOverrides.name || "name";
  let authorKey = keyOverrides.author || "author";
  let idKey = keyOverrides.id || "id";
  let orderKey = keyOverrides.order || "order";
  return (
    <UU5.Common.Fragment>
      <div style={{ fontWeight: shouldBeBold ? "bold" : "normal" }}>
        #{data[orderKey]} <UU5.Bricks.Link href={"tourDetail?id=" + data[idKey]}>{data[nameKey]}</UU5.Bricks.Link>
      </div>
      <div>
        <strong style={labelWidth ? { display: "inline-block", width: labelWidth } : {}}>
          <UU5.Bricks.Lsi lsi={TourDetailLsi.author} />
          :&nbsp;
        </strong>
        {data[authorKey]}
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
        <UU5.Bricks.Strong>{results.order}</UU5.Bricks.Strong>&nbsp;/&nbsp;{total}&nbsp;
        {results.order === 1 && `🥇`}
        {results.order === 2 && `🥈`}
        {results.order === 3 && `🥉`}
      </UU5.Common.Fragment>
    );
  }
}

function getOwnPoints(data) {
  let { results } = getCorrectResults(data);
  return results.points && <UU5.Bricks.Number value={results.points} />;
}

function getOwnRunDate(data) {
  let { results } = getCorrectResults(data);
  return results.runDate && <UU5.Bricks.DateTime value={results.runDate} dateOnly />;
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

function getComparisonRunDate(data, resultIndex, athletes) {
  let { results } = getComparisonResults(data, resultIndex, athletes);
  if (results.runDate) {
    return <UU5.Bricks.DateTime value={results.runDate} dateOnly />;
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

  stravaTtLink(options = {}, keyOverrides = {}) {
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
      cellComponent: data => getStravaTtLinks(data, keyOverrides),
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

  athleteAndClubLink(options = {}, year) {
    const column = {
      id: "name",
      headers: [
        {
          label: Lsi.name,
          sorterKey: "name"
        },
        {
          label: Lsi.club,
          sorterKey: "club"
        }
      ],
      cellComponent: data => getAthleteAndClubLink(data, year),
      width: "m",
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

  clubPoints(options = {}, totalKey, pointsMen, pointsWomen) {
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
      cellComponent: data => getSexCellComponent(data, totalKey, pointsMen, pointsWomen, 0),
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, totalKey, pointsMen, pointsWomen, 0);
    };
    return mergeColumn(options, column);
  },

  clubRunners(options = {}, totalKey, pointsMen, pointsWomen) {
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
      cellComponent: data => getSexCellComponent(data, totalKey, pointsMen, pointsWomen),
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, totalKey, pointsMen, pointsWomen);
    };
    return mergeColumn(options, column);
  },

  clubResults(options = {}, totalKey, pointsMen, pointsWomen) {
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
      cellComponent: data => getSexCellComponent(data, totalKey, pointsMen, pointsWomen),
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, totalKey, pointsMen, pointsWomen);
    };
    return mergeColumn(options, column);
  },

  clubAvgPoints(options = {}, totalKey, pointsMen, pointsWomen) {
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
      cellComponent: data => getSexCellComponent(data, totalKey, pointsMen, pointsWomen, 2),
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, totalKey, pointsMen, pointsWomen, 2);
    };
    return mergeColumn(options, column);
  },

  segmentName(options = {}, keyOverrides = {}) {
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
      cellComponent: data => getSegmentName(data, keyOverrides),
      tileComponent: data => getSegmentNameTile(data, false, false, keyOverrides),
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
  },

  lastRun(options = {}, runDateKey, getOwn = false) {
    const column = {
      id: "lastRun",
      headers: [
        {
          label: Lsi[runDateKey],
          sorterKey: runDateKey
        }
      ],
      cellComponent: data => {
        if (getOwn) {
          return getOwnRunDate(data);
        } else {
          return data[runDateKey] && <UU5.Bricks.DateTime value={data[runDateKey]} dateOnly />;
        }
      },
      width: "xs"
    };
    return mergeColumn(options, column);
  },

  comparisonRunDate(options = {}, athletes, index) {
    const column = {
      id: NUM_TO_STR.get(index) + "RunDate",
      headers: [
        {
          label: Lsi.emptyHeader
        },
        {
          label: Lsi.runDate
        }
      ],
      cellComponent: data => getComparisonRunDate(data, index, athletes),
      width: "s"
    };
    return mergeColumn(options, column);
  }
};

export default FlexColumns;
