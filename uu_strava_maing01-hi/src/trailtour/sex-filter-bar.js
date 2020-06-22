//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

const Lsi = {
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

export const SexFilterBar = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SexFilterBar",
    classNames: {
      main: (props, state) => Config.Css.css`
         .uu5-common-div.uu5-bricks-resize {
          display: inline;
        }

        ${props.right &&
          UU5.Utils.ScreenSize.getMaxMediaQueries(
            "xs",
            `.uu5-bricks-panel-header-content > .uu5-common-div {
              flex-direction: column;

              > .uu5-common-div {
                margin: 8px 0px;
              }
            }`
          )}
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    right: UU5.PropTypes.node
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.FlexTiles.Bar
        {...this.getMainPropsToPass()}
        title={Lsi.sexFilter}
        layout="xs-horizontal s-vertical m-horizontal"
        left={this._getFilter}
        right={this.props.right}
      />
    );
  }
  //@@viewOff:render
});

export default SexFilterBar;
