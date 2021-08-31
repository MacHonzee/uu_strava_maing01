//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import withLanguage from "../bricks/with-language";
import BrickTools from "../bricks/tools";
import MonthsLsi from "../lsi/months-lsi";
import DaysLsi from "../lsi/days-lsi";
//@@viewOff:imports

const Lsi = {
  defaultHeader: {
    cs: "Graf výsledků",
    en: "Results chart",
  },
  xAxisInputLabel: {
    cs: "Popisky na ose X",
    en: "Labels of X axis",
  },
  yAxisInputLabel: {
    cs: "Jednotky osy Y",
    en: "Units of Y axis",
  },
  yAxisMathTypeInputLabel: {
    cs: "Výpočet pro osu Y",
    en: "Calculation of Y axis",
  },
  xAxisTooltip: {
    cs:
      "Způsob, jakým budou sloučeny výsledky na osu X. Např. v případě zvolení týdne budou všechny" +
      " výsledky z jednoho týdne sečteny (nebo zprůměrovány), analogicky den (pro případ více běhů" +
      ' v jeden den), měsíc a den v týdnu. Při zaškrnutí "Popořade" nedojde k žádné agregaci a výsledky' +
      " budou pouze chronologicky seřazeny.",
    en:
      "Way in which the results will be aggregated on X axis. Ie. when you select week, all the results" +
      " in same week will be summed (or averaged). Analogically it goes for day (in case for multiple runs" +
      ' in one day), month and day of week. In case of selecting "In order" there will be no aggregation' +
      " and results will be only chronologically sorted.",
  },
  yAxisTooltip: {
    cs: "Určuje, co bude na grafu zobrazeno ve sloupečkách a na ose Y.",
    en: "Decides what will be displayed in chart bars and on Y axis.",
  },
  yAxisMathTypeTooltip: {
    cs:
      "Určuje, jakým způsobem budou agregovány data pro jednotlivé sloupečky, zda bude proveden součet" +
      " nebo průměr sledované veličiny z výsledků (např. součet vzdálenosti za měsíc, nebo průměrné" +
      " převýšení na den v týdnu apod).",
    en:
      "Decides the way of aggregating data for individual charts, whether the resulted data and unit will " +
      "be summed or averaged (ie. sum of average in month or average elevation gain per day of week).",
  },
  xAxisLabels: {
    none: {
      cs: "Popořadě",
      en: "In order",
    },
    day: {
      cs: "Den",
      en: "Day",
    },
    week: {
      cs: "Týden",
      en: "Week",
    },
    month: {
      cs: "Měsíc",
      en: "Month",
    },
    dayOfWeek: {
      cs: "Den v týdnu",
      en: "Day of week",
    },
  },
  yAxisLabels: {
    segments: {
      cs: "Počet etap",
      en: "Segment count",
    },
    distance: {
      cs: "Vzdálenost",
      en: "Distance",
    },
    elevation: {
      cs: "Převýšení",
      en: "Elevation",
    },
    points: {
      cs: "Body",
      en: "Points",
    },
    time: {
      cs: "Strávený čas",
      en: "Elapsed time",
    },
  },
  yAxisMathTypeLabels: {
    sum: {
      cs: "Součet",
      en: "Sum",
    },
    avg: {
      cs: "Průměr",
      en: "Average",
    },
  },
  units: {
    segments: {
      1: {
        cs: "etapa",
        en: "segment",
      },
      "2to4": {
        cs: "etapy",
        en: "segments",
      },
      5: {
        cs: "etap",
        en: "segments",
      },
    },
  },
};

const X_AXIS_TYPES = ["none", "day", "week", "month", "dayOfWeek"];
const Y_AXIS_TYPES = ["segments", "distance", "elevation", "points", "time"];
const Y_AXIS_MATH_TYPES = ["sum", "avg"];

const DAY_IN_SECONDS = 86400000;

export const InteractiveResultChartPanel = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "InteractiveResultChartPanel",
    classNames: {
      main: (props, state) => Config.Css.css`
        margin-bottom: 16px;
      `,
      tooltip: Config.Css.css`
        background-color: white;
        border: 1px solid ${UU5.Environment.colors.grey.c500};
        border-radius: 2px;
        padding: 4px;
      `,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    results: UU5.PropTypes.array.isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    header: UU5.PropTypes.node,
    xAxis: UU5.PropTypes.oneOf(X_AXIS_TYPES).isRequired,
    yAxis: UU5.PropTypes.oneOf(Y_AXIS_TYPES).isRequired,
    yAxisMathType: UU5.PropTypes.oneOf(Y_AXIS_MATH_TYPES).isRequired,
    editable: UU5.PropTypes.bool,
    expanded: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: <UU5.Bricks.Lsi lsi={Lsi.defaultHeader} />,
      expanded: true,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let stateKeys = ["xAxis", "yAxis", "yAxisMathType", "editable"];
    return stateKeys.reduce((map, key) => {
      map[key] = this.props[key];
      return map;
    }, {});
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChart() {
    let chartData = this._prepareData();
    return (
      <UU5.Chart.ResponsiveContainer height={300}>
        <UU5.Chart.BarChart data={chartData}>
          <UU5.Chart.XAxis dataKey="name" label={this._getXAxisLabel()} />
          {this._getYAxis(chartData)}
          <UU5.Chart.Tooltip content={this._getTooltipContent} />
          <UU5.Chart.Legend />
          <UU5.Chart.Bar dataKey={this.state.yAxis} name={this._getBarName()} />
        </UU5.Chart.BarChart>
      </UU5.Chart.ResponsiveContainer>
    );
  },

  _getTooltipContent(opt) {
    if (opt.active && opt.payload[0].payload.runs) {
      let data = opt.payload[0];
      let runs = data.payload.runs.map((run) => {
        return <div key={run.stravaId}>{run.name}</div>;
      });

      if (runs.length >= 11) {
        runs = runs.slice(0, 10);
        runs.push("...");
      }

      let value = data.payload[data.dataKey];
      if (this.state.yAxis === "segments") {
        value = this._formatSegments(value);
      } else {
        value = this._formatUnit(value);
      }

      return (
        <div className={this.getClassName("tooltip")}>
          <div>
            <strong>{opt.label}</strong>
          </div>
          <div>{value}</div>
          {runs}
        </div>
      );
    }
    return null;
  },

  _getXAxisLabel() {
    let content = UU5.Common.Tools.getLsiValueByLanguage(Lsi.xAxisLabels[this.state.xAxis], this.props.language);
    return { value: content, position: "insideBottomRight", offset: 4 };
  },

  _getYAxis(chartData) {
    if (this.state.yAxis === "segments") {
      let max = Math.max(...chartData.map((item) => item.segments), 0);
      let ticks = Array.from(Array(max + 1).keys());
      return <UU5.Chart.YAxis tickFormatter={this._formatUnit} ticks={ticks} />;
    } else {
      return <UU5.Chart.YAxis tickFormatter={this._formatUnit} />;
    }
  },

  _formatUnit(value) {
    switch (this.state.yAxis) {
      case "segments":
        return value;
      case "distance":
        return UU5.Common.Tools.formatNumber(value / 1000, { maxDecimals: 2 }) + " km";
      case "elevation":
        return UU5.Common.Tools.formatNumber(value, { maxDecimals: 2 }) + " m";
      case "points":
        return UU5.Common.Tools.formatNumber(value, { maxDecimals: 2 });
      case "time":
        return BrickTools.formatDuration(value);
    }
  },

  _formatSegments(value) {
    let lsi;
    if (value === 0 || value >= 5) {
      lsi = Lsi.units.segments["5"];
    } else if (value === 1) {
      lsi = Lsi.units.segments["1"];
    } else {
      lsi = Lsi.units.segments["2to4"];
    }
    let content = UU5.Common.Tools.getLsiValueByLanguage(lsi, this.props.language);
    return value + " " + content;
  },

  _getBarName() {
    return UU5.Common.Tools.getLsiValueByLanguage(Lsi.yAxisLabels[this.state.yAxis], this.props.language);
  },

  _prepareData() {
    let grouppedData = this._groupRunsByUnit();
    let chartData = [];
    let sexKey = this._getSexKey();
    this._iterateByUnit((groupKey) => {
      let runs = grouppedData[groupKey];
      let chartDataItem = this._getChartDataItem(runs, sexKey, groupKey);
      chartData.push(chartDataItem);
    });

    return chartData;
  },

  _getChartDataItem(runs, sexKey, groupKey) {
    let chartDataItem = {
      name: groupKey,
      runs,
    };

    let counterMap = {};
    counterMap[this.state.yAxis] = 0.0;

    let yAxisKey = this.state.yAxis;
    runs &&
      runs.forEach((run) => {
        let result = run[sexKey][0];

        switch (yAxisKey) {
          case "points":
          case "time":
            counterMap[yAxisKey] += result[yAxisKey];
            break;
          case "segments":
            counterMap[yAxisKey]++;
            break;
          case "distance":
            counterMap[yAxisKey] += run.segment.distance;
            break;
          case "elevation":
            counterMap[yAxisKey] += run.segment.total_elevation_gain;
            break;
        }
      });

    switch (this.state.xAxis) {
      case "none": {
        let date = new Date(runs[0][sexKey][0].runDate); // in this case, there is always a run
        chartDataItem.name = UU5.Common.Tools.formatDateByCountry(date, this.props.language);
        break;
      }
      case "month": {
        let monthLsi = MonthsLsi[chartDataItem.name];
        chartDataItem.name = UU5.Common.Tools.getLsiValueByLanguage(monthLsi, this.props.language);
        break;
      }
      case "dayOfWeek": {
        let dayLsi = DaysLsi[chartDataItem.name];
        chartDataItem.name = UU5.Common.Tools.getLsiValueByLanguage(dayLsi, this.props.language);
        break;
      }
    }

    if (runs && this.state.yAxisMathType === "avg" && this.state.yAxis !== "segments") {
      counterMap[yAxisKey] = counterMap[yAxisKey] / runs.length;
    }

    Object.assign(chartDataItem, counterMap);
    return chartDataItem;
  },

  _formatDateByUnit(date) {
    switch (this.state.xAxis) {
      case "day":
        return UU5.Common.Tools.formatDateByCountry(date, this.props.language);
      case "month":
        return "" + (date.getMonth() + 1);
      case "week":
        return this._getWeekNumber(date);
      case "dayOfWeek": {
        let day = date.getDay();
        return day ? day : 7;
      }
    }
  },

  _getSexKey() {
    return this.props.sex === "male" ? "menResults" : "womenResults";
  },

  _sortChronologically() {
    let sexKey = this._getSexKey();
    return [...this.props.results].sort((a, b) => {
      let resultA = a[sexKey][0];
      let resultB = b[sexKey][0];
      if (!resultA || !resultB) {
        return -1;
      } else {
        return resultA.runDate.localeCompare(resultB.runDate);
      }
    });
  },

  _groupRunsByUnit() {
    let sortedData = this._sortChronologically();
    let sexKey = this._getSexKey();
    let grouppedRuns = {};
    let counter = 0;
    sortedData.forEach((ttRun) => {
      let result = ttRun[sexKey][0];
      if (result) {
        let groupKey;
        if (this.state.xAxis === "none") {
          groupKey = counter;
          counter++;
        } else {
          groupKey = this._formatDateByUnit(new Date(result.runDate));
        }
        grouppedRuns[groupKey] = grouppedRuns[groupKey] || [];
        grouppedRuns[groupKey].push(ttRun);
      }
    });

    return grouppedRuns;
  },

  _iterateByUnit(callback) {
    let current = new Date(this.props.trailtour.validFrom);
    let end = new Date(this.props.trailtour.validTo);
    let groupKeys = [];
    if (this.state.xAxis === "dayOfWeek") {
      for (let i = 1; i <= 7; i++) {
        groupKeys.push(i);
      }
    } else if (this.state.xAxis === "day") {
      do {
        groupKeys.push(this._formatDateByUnit(current));
        current.setDate(current.getDate() + 1);
      } while (current <= end);
    } else if (this.state.xAxis === "week") {
      let firstWeekNum = this._getWeekNumber(current);
      let lastWeekNum = this._getWeekNumber(end);
      for (let i = firstWeekNum; i <= lastWeekNum; i++) {
        groupKeys.push("" + i);
      }
    } else if (this.state.xAxis === "month") {
      let firstMonth = current.getMonth() + 1;
      let lastMonth = end.getMonth() + 1;
      for (let i = firstMonth; i <= lastMonth; i++) {
        groupKeys.push("" + i);
      }
    } else if (this.state.xAxis === "none") {
      let sexKey = this._getSexKey();
      let counter = 0;
      this.props.results.forEach((ttRun) => {
        let result = ttRun[sexKey][0];
        if (result) {
          groupKeys.push("" + counter);
          counter++;
        }
      });
    }

    groupKeys.forEach(callback);
  },

  _getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / DAY_IN_SECONDS + 1) / 7);
  },

  _getEditableInputs() {
    return (
      <UU5.Bricks.Row>
        <UU5.Bricks.Column colWidth={"xs-12 m-4"}>
          <UU5.Forms.Radios
            labelColWidth={"xs-12"}
            inputColWidth={"xs-12"}
            label={<UU5.Bricks.Lsi lsi={Lsi.xAxisInputLabel} />}
            value={X_AXIS_TYPES.map((xAxisType) => ({
              label: <UU5.Bricks.Lsi lsi={Lsi.xAxisLabels[xAxisType]} />,
              value: this.state.xAxis === xAxisType,
              name: xAxisType,
            }))}
            onChange={this._handleXAxisChange}
            tooltip={UU5.Common.Tools.getLsiValueByLanguage(Lsi.xAxisTooltip, this.props.language)}
          />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth={"xs-12 m-4"}>
          <UU5.Forms.Radios
            labelColWidth={"xs-12"}
            inputColWidth={"xs-12"}
            label={<UU5.Bricks.Lsi lsi={Lsi.yAxisInputLabel} />}
            value={Y_AXIS_TYPES.map((yAxisType) => ({
              label: <UU5.Bricks.Lsi lsi={Lsi.yAxisLabels[yAxisType]} />,
              value: this.state.yAxis === yAxisType,
              name: yAxisType,
            }))}
            onChange={this._handleYAxisChange}
            tooltip={UU5.Common.Tools.getLsiValueByLanguage(Lsi.yAxisTooltip, this.props.language)}
          />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth={"xs-12 m-4"}>
          {this.state.xAxis !== "none" && (
            <UU5.Forms.Radios
              labelColWidth={"xs-12"}
              inputColWidth={"xs-12"}
              label={<UU5.Bricks.Lsi lsi={Lsi.yAxisMathTypeInputLabel} />}
              value={Y_AXIS_MATH_TYPES.map((yAxisMathType) => ({
                label: <UU5.Bricks.Lsi lsi={Lsi.yAxisMathTypeLabels[yAxisMathType]} />,
                value: this.state.yAxisMathType === yAxisMathType,
                name: yAxisMathType,
              }))}
              onChange={this._handleYAxisMathTypeChange}
              tooltip={UU5.Common.Tools.getLsiValueByLanguage(Lsi.yAxisMathTypeTooltip, this.props.language)}
            />
          )}
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
  },

  _handleXAxisChange(opt) {
    this.setState({ xAxis: opt.value });
  },

  _handleYAxisChange(opt) {
    this.setState({ yAxis: opt.value });
  },

  _handleYAxisMathTypeChange(opt) {
    this.setState({ yAxisMathType: opt.value });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Panel
        {...this.getMainPropsToPass()}
        header={this.props.header}
        bgStyle={"outline"}
        iconExpanded={"mdi-chevron-down"}
        iconCollapsed={"mdi-chevron-up"}
        expanded={this.props.expanded}
        mountContent={"onFirstExpand"}
      >
        {this.state.editable && this._getEditableInputs()}
        {this._getChart()}
      </UU5.Bricks.Panel>
    );
  },
  //@@viewOff:render
});

export default withLanguage(InteractiveResultChartPanel);
