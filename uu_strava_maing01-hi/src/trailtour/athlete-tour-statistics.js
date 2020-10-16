//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import InteractiveResultChartPanel from "./interactive-result-chart-panel";
//@@viewOff:imports

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
          editable
          header={this.getLsiComponent("segmentsByDay")}
          xAxis={"day"}
          yAxises={["segments"]}
        />
        <InteractiveResultChartPanel {...chartProps} xAxis={"week"} yAxises={["distance"]} />
        <InteractiveResultChartPanel {...chartProps} xAxis={"month"} yAxises={["distance"]} />
        <InteractiveResultChartPanel {...chartProps} xAxis={"dayOfWeek"} yAxises={["distance"]} />
        <InteractiveResultChartPanel {...chartProps} xAxis={"none"} yAxises={["time"]} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default AthleteTourStatistics;
