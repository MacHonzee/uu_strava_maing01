//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

const Lsi = {
  dateRangeFilter: {
    cs: "Rozpětí datumů",
    en: "Date range"
  }
};

const DATE_FROM_OFFSET = 14;

export const DateRangeFilterBar = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "DateRangeFilterBar",
    classNames: {
      main: (props, state) => Config.Css.css``,
      picker: Config.Css.css`
        display: inline-flex;

        &.uu5-forms-daterangepicker {
          margin-bottom: 0;
        }
      `
    },
    getDefaultDates() {
      let now = new Date();
      let dateFrom = new Date();
      dateFrom.setDate(now.getDate() - DATE_FROM_OFFSET);
      return {
        dateFrom,
        dateTo: now
      };
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onChangeCb: UU5.PropTypes.func
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
  _getFilter(context) {
    let defaultDates = DateRangeFilterBar.getDefaultDates();
    return (
      <UU5.Forms.DateRangePicker
        controlled={false}
        className={this.getClassName("picker")}
        value={[defaultDates.dateFrom, defaultDates.dateTo]}
        inputWidth={"246px"}
        dateTo={new Date()}
        showTodayButton
        onChange={opt => this._handleOnChange(opt, context)}
      />
    );
  },

  _handleOnChange({ component, value }, context) {
    component.setValue(value);
    if (this.props.onChangeCb) {
      context.handleLoad().then(() => {
        this.props.onChangeCb({ dateFrom: value[0], dateTo: value[1] }).then(() => {
          context.handleLoad();
        });
      });
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.FlexTiles.Bar
        {...this.getMainPropsToPass()}
        title={Lsi.dateRangeFilter}
        layout="xs-vertical s-horizontal m-horizontal"
        left={this._getFilter}
      />
    );
  }
  //@@viewOff:render
});

export default DateRangeFilterBar;
