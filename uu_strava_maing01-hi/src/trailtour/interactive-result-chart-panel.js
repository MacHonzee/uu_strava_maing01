//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

const Lsi = {
  defaultHeader: {
    cs: "Graf výsledků",
    en: "Results chart"
  },
  xAxisInputLabel: {
    cs: "Popisky osy X",
    en: "Labels of X Axis"
  },
  xAxisLabels: {
    none: {
      cs: "Popořadě",
      en: "In order"
    },
    day: {
      cs: "Den",
      en: "Day"
    },
    week: {
      cs: "Týden",
      en: "Week"
    },
    month: {
      cs: "Měsíc",
      en: "Month"
    },
    dayOfWeek: {
      cs: "Den v týdnu",
      en: "Day of week"
    }
  }
};

const X_AXIS_TYPES = ["none", "day", "week", "month", "dayOfWeek"];

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
        border: 1px solid ${UU5.Environment.colors.grey.c700};
        border-radius: 2px;
        padding: 4px;
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    results: UU5.PropTypes.array.isRequired,
    trailtour: UU5.PropTypes.object.isRequired,
    sex: UU5.PropTypes.oneOf(["male", "female"]).isRequired,
    header: UU5.PropTypes.node,
    xAxis: UU5.PropTypes.oneOf(X_AXIS_TYPES).isRequired,
    yAxises: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOf(["segments", "distance", "elevation", "points", "time"])),
    editable: UU5.PropTypes.bool,
    expanded: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: <UU5.Bricks.Lsi lsi={Lsi.defaultHeader} />,
      expanded: true
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let stateKeys = ["xAxis", "yAxises", "editable"];
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
    console.log(chartData);
    return (
      <UU5.Chart.ResponsiveContainer height={300}>
        <UU5.Chart.BarChart data={chartData}>
          <UU5.Chart.XAxis dataKey="name" label={this._getXAxisLabel()} />
          {this._getYAxises(chartData)}
          <UU5.Chart.Tooltip content={this._getTooltipContent} />
          <UU5.Chart.Legend />
          {this._getBars()}
        </UU5.Chart.BarChart>
      </UU5.Chart.ResponsiveContainer>
    );
  },

  _getTooltipContent(opt) {
    if (opt.active && opt.payload[0].payload.runs) {
      let data = opt.payload[0];
      let runs = data.payload.runs.map(run => {
        return <div key={run.stravaId}>{run.name}</div>;
      });

      return (
        <div className={this.getClassName("tooltip")}>
          <div>{opt.label}</div>
          <div>{data.payload[data.dataKey]}</div>
          {runs}
        </div>
      );
    }
  },

  _getXAxisLabel() {
    return { value: this.state.xAxis, position: "insideBottomRight", offset: 4 };
  },

  _getYAxises(chartData) {
    return this.state.yAxises.map(yAxis => {
      if (yAxis === "segments") {
        let max = Math.max(...chartData.map(item => item.segments), 0);
        let ticks = Array.from(Array(max + 1).keys());
        return <UU5.Chart.YAxis key={yAxis} ticks={ticks} />;
      } else {
        return <UU5.Chart.YAxis key={yAxis} />;
      }
    });
  },

  _getBars() {
    return this.state.yAxises.map(yAxis => {
      return <UU5.Chart.Bar key={yAxis} dataKey={yAxis} />;
    });
  },

  _prepareData() {
    let grouppedData = this._groupRunsByUnit();
    let chartData = [];
    let sexKey = this._getSexKey();
    this._iterateByUnit(groupKey => {
      let runs = grouppedData[groupKey];
      let chartDataItem = this._getChartDataItem(runs, sexKey, groupKey);
      chartData.push(chartDataItem);
    });

    return chartData;
  },

  _getChartDataItem(runs, sexKey, groupKey) {
    let chartDataItem = {
      name: groupKey,
      runs
    };

    let counterMap = this.state.yAxises.reduce((map, key) => {
      map[key] = 0.0;
      return map;
    }, {});

    runs &&
      runs.forEach(run => {
        let result = run[sexKey][0];

        this.state.yAxises.forEach(yAxisKey => {
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
      });

    Object.assign(chartDataItem, counterMap);
    return chartDataItem;
  },

  _formatDateByUnit(date) {
    switch (this.state.xAxis) {
      case "day":
        return UU5.Common.Tools.formatDate(date, "Y-mm-dd");
      case "month":
        return "" + (date.getMonth() + 1);
      case "week":
        return this._getWeekNumber(date);
      case "dayOfWeek":
        return date.toLocaleDateString(undefined, { weekday: "long" });
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
    sortedData.forEach((ttRun, i) => {
      let result = ttRun[sexKey][0];
      if (result) {
        let groupKey;
        if (this.state.xAxis === "none") {
          groupKey = i;
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
      let monday = new Date(2020, 1, 3);
      for (let i = 0; i <= 6; i++) {
        let groupKey = monday.toLocaleDateString(undefined, { weekday: "long" });
        groupKeys.push(groupKey);
        monday.setDate(monday.getDate() + 1);
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
      this.props.results.forEach(ttRun => {
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
        <UU5.Bricks.Column colWidth={"xs-12 m-6"}>
          <UU5.Forms.Radios
            labelColWidth={"xs-12"}
            inputColWidth={"xs-12"}
            label={<UU5.Bricks.Lsi lsi={Lsi.xAxisInputLabel} />}
            value={X_AXIS_TYPES.map(xAxisType => ({
              label: <UU5.Bricks.Lsi lsi={Lsi.xAxisLabels[xAxisType]} />,
              value: this.state.xAxis === xAxisType,
              name: xAxisType
            }))}
            onChange={this._handleXAxisChange}
          />
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
  },

  _handleXAxisChange(opt) {
    this.setState({ xAxis: opt.value });
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
  }
  //@@viewOff:render
});

export default InteractiveResultChartPanel;
