//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import NameFilter from "./name-filter";
//@@viewOff:imports

const Lsi = {
  title: {
    cs: "Vyhledávání",
    en: "Search",
  },
};

export const NameFilterBar = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "NameFilterBar",
    classNames: {
      main: (props, state) => Config.Css.css``,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    right: UU5.PropTypes.node,
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.FlexTiles.Bar
        {...this.getMainPropsToPass()}
        title={Lsi.title}
        layout="xs-horizontal s-vertical m-horizontal"
        left={<NameFilter showLabel={false} />}
        right={this.props.right}
      />
    );
  },
  //@@viewOff:render
});

export default NameFilterBar;
