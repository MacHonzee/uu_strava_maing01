//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as FlexTiles from "uu5flextilesg01";
UU5.FlexTiles = FlexTiles;
import Config from "./config/config.js";
import TrailtourTools from "./tools";
//@@viewOff:imports

export const NameFilter = UU5.FlexTiles.withDataConsumer(
  UU5.Common.VisualComponent.create({
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: Config.TAG + "NameFilter",
      classNames: {
        main: (props, state) => Config.Css.css``,
      },
      lsi: {
        label: {
          cs: "Vyhledávání",
          en: "Search",
        },
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      showLabel: UU5.PropTypes.bool,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        showLabel: true,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._input = UU5.Common.Reference.create();
      return {
        activeFilter: false,
      };
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _handleAddFilter({ value }) {
      if (value) {
        this.setState({ activeFilter: true });
        this.props.addFilter(TrailtourTools.NAME_FILTER_KEY, value);
      }
    },

    _handleRemoveFilter({ component }) {
      this.setState({ activeFilter: false });
      this.props.removeFilter(TrailtourTools.NAME_FILTER_KEY);
      component.setValue("");
    },

    _handleOnKeyUp(event) {
      let input = this._input.current;
      let value = input.getValue();
      if (event.key === "Escape") {
        if (value) {
          input.setValue("");
        }
        if (this.state.activeFilter) {
          this._handleRemoveFilter({ component: input });
        }
      } else if (event.key === "Enter") {
        if (value) {
          this._handleAddFilter({ value });
        } else if (!value && this.state.activeFilter) {
          this._handleRemoveFilter({ component: input });
        }
      }
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <UU5.Forms.TextIcon
          {...this.getMainPropsToPass()}
          controlled={false}
          ref_={this._input}
          icon={this.state.activeFilter ? "mdi-close" : "mdi-magnify"}
          onClick={this.state.activeFilter ? this._handleRemoveFilter : this._handleAddFilter}
          inputAttrs={{
            onKeyUp: this._handleOnKeyUp,
          }}
          label={this.props.showLabel ? this.getLsiComponent("label") : ""}
          inputWidth={"208px"}
        />
      );
    },
    //@@viewOff:render
  })
);

export default NameFilter;
