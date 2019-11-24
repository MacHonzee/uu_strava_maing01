//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";

import "./home.less";
import AthleteInfo from "../core/home/athlete-info";
import SegmentsTableProvider from "../core/home/segments-table-provider";
//@@viewOff:imports

const Home = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Home",
    classNames: {
      main: Config.CSS + "home"
    },
    lsi: {
      dragons: {
        en: "Here there will be data. Lots of data. Nice data."
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
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
    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>
      <AthleteInfo />
      <SegmentsTableProvider/>
    </UU5.Bricks.Div>;
  }
  //@@viewOff:render
});

export default Home;
