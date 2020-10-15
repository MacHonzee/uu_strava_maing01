//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import InteractiveResultChartPanel from "./interactive-result-chart-panel";
//@@viewOff:imports

// FIXME this should be taken from backend, not from this constant
const TT_DATES = {
  from: "2020-05-01",
  to: "2020-10-20"
};

export const AthleteTourStatistics = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteTourStatistics",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      segmentsByDay: {
        cs: "Počet etap za den",
        en: "Segment count per day"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    trailtour: UU5.PropTypes.object.isRequired
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
  _getPerDayCharts(sortedResultsMap) {
    // line chart
    // x: den, y: vzdálenost
    let data = [];
    let sexKey = this._getSexKey();
    this._iterateOnDays(TT_DATES, dateStr => {
      let runs = sortedResultsMap[dateStr];
      let distance = 0.0;
      let elevation = 0.0;
      let points = 0.0;
      let segments = 0;
      let time = 0.0;

      runs &&
        runs.forEach(run => {
          distance += run.segment.distance;
          elevation += run.segment.total_elevation_gain;
          points += run[sexKey][0].points;
          time += run[sexKey][0].time;
          segments++;
        });

      data.push({
        label: dateStr,
        distance: Math.round(distance),
        elevation: Math.round(elevation),
        points: Math.round(points),
        time: time / 3600,
        segments
      });
    });

    const seriesConfig = {
      segments: { valueKey: "segments", name: "Počet etap" },
      distance: { valueKey: "distance", name: "Vzdálenost" },
      elevation: { valueKey: "elevation", name: "Převýšení" },
      points: { valueKey: "points", name: "Body" },
      time: { valueKey: "time", name: "Strávený čas" }
    };

    const chartProps = {
      data,
      displayLegend: true,
      gradient: false,
      groupingSeparator: " "
    };

    // TODO english labels for names
    return (
      <div>
        <UU5.SimpleChart.BarChart {...chartProps} series={[seriesConfig.segments]} valueRound={1} />
        <UU5.SimpleChart.BarChart
          {...chartProps}
          series={[seriesConfig.distance]}
          valueRound={1000}
          valueUnit={" km"}
        />
        <UU5.SimpleChart.BarChart {...chartProps} series={[seriesConfig.elevation]} valueUnit={" m"} />
        <UU5.SimpleChart.BarChart {...chartProps} series={[seriesConfig.points]} valueRound={1} />
        <UU5.SimpleChart.BarChart {...chartProps} series={[seriesConfig.time]} valueRound={1} valueUnit={" h"} />
      </div>
    );
  },

  _getAvgPointsPerDistance() {
    // line chart
    // x: délka etapy, y: počet bodů
  },

  _getOrderCount() {
    // bar chart
    // x: pořadí, y: kolikrát v daném pořadí
  },

  _getDayOfWeekCount() {
    // pie chart
    // x: den v týdnu, y: počet etap v daném dni
  },

  _getCountPerDayCount() {
    // pie chart
    // x: kolikrát jsme běželi N-krát za den, y: N (např. 27x jsme běželi 1 za den, 10x 2 za den a 1x 3 za den)
  },

  _getSexKey() {
    return this.props.sex === "male" ? "menResults" : "womenResults";
  },

  _getDaySortedResults() {
    let sexKey = this._getSexKey();
    let sortedResults = [...this.props.data].sort((a, b) => {
      let resultA = a[sexKey][0];
      let resultB = b[sexKey][0];
      if (!resultA || !resultB) {
        return -1;
      } else {
        return resultA.runDate.localeCompare(resultB.runDate);
      }
    });

    let sortedResultMap = sortedResults.reduce((map, result) => {
      let gotResult = result[sexKey][0];
      if (gotResult) {
        map[gotResult.runDate] = map[gotResult.runDate] || [];
        map[gotResult.runDate].push(result);
      }
      return map;
    }, {});

    return { sortedResults, sortedResultMap };
  },

  _formatDate(date) {
    return UU5.Common.Tools.formatDate(date, "Y-mm-dd");
  },

  _iterateOnDays(ttDates, callback) {
    let current = new Date(ttDates.from);
    let end = new Date(ttDates.to);
    do {
      let dateStr = this._formatDate(current);
      callback(dateStr);
      current.setDate(current.getDate() + 1);
    } while (current <= end);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let chartProps = {
      results: this.props.data,
      trailtour: this.props.trailtour,
      sex: this.props.sex
    };
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <InteractiveResultChartPanel
          {...chartProps}
          header={this.getLsiComponent("segmentsByDay")}
          xAxis={"chronological"}
          xAxisGroup={"day"}
          yAxises={["segments"]}
        />
        <InteractiveResultChartPanel
          {...chartProps}
          xAxis={"chronological"}
          xAxisGroup={"week"}
          yAxises={["distance"]}
        />
        <InteractiveResultChartPanel
          {...chartProps}
          xAxis={"chronological"}
          xAxisGroup={"month"}
          yAxises={["elevation"]}
        />
        <InteractiveResultChartPanel {...chartProps} xAxis={"dayOfWeek"} yAxises={["points"]} />
        <InteractiveResultChartPanel {...chartProps} xAxis={"chronological"} xAxisGroup={"day"} yAxises={["time"]} />
      </UU5.Bricks.Div>
    );

    console.log("data", this.props.data);
    console.log("trailtour", this.props.trailtour);
    let { sortedResults, sortedResultMap } = this._getDaySortedResults();
    console.log(sortedResultMap);

    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{this._getPerDayCharts(sortedResultMap)}</UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default AthleteTourStatistics;
