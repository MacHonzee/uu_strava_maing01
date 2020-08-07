import * as UU5 from "uu5g04";
import AthleteLink from "../../bricks/athlete-link";
import ClubLink from "../../bricks/club-link";
import AthleteTourDetailLsi from "../../lsi/athlete-tour-detail-lsi";

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
  }
};

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

function getPoints({ points, pointsMen, pointsWomen }) {
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

function getRunnerCount({ runnersTotal, runnersMen, runnersWomen }) {
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

function getResultCount({ resultsTotal, resultsMen, resultsWomen }) {
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

function getAvgPoints({ avgPoints, avgPointsMen, avgPointsWomen }) {
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
      cellComponent: getPoints,
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
      cellComponent: getRunnerCount,
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
      cellComponent: getResultCount,
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
      cellComponent: getAvgPoints,
      width: "xs"
    };
    column.tileComponent = data => {
      return getSexTileComponent(column, data, "avgPoints", "avgPointsMen", "avgPointsWomen", 2);
    };
    return mergeColumn(options, column);
  }
};

export default FlexColumns;
