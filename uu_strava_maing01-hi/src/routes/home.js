//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Lsi from "../config/lsi";
import AboutLsi from "../lsi/about-lsi";

import Config from "./config/config.js";
import BacklogConfig from "../config/backlog-config";
import BrickTools from "../bricks/tools";
//@@viewOff:imports

const Home = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Home",
    classNames: {
      main: Config.Css.css`
        .uu5-bricks-well {
          text-align: center;
        }
      `
    },
    lsi: {
      welcomeHeader: {
        cs: "Vítejte v aplikaci " + Lsi.appName.cs,
        en: "Welcome to application " + Lsi.appName.en
      },
      resultsLink: {
        cs: "Výsledky CZ 2020",
        en: "Results CZ 2020"
      },
      backlogHeader: {
        cs: "Rozpracované funkčnosti",
        en: "Future functions"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    BrickTools.setDocumentTitle({}, "home");
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getResultsLink() {
    return (
      <UU5.Bricks.Well bgStyle={"transparent"}>
        <UU5.Bricks.TouchIcon colorSchema={"orange-rich"} icon={"mdi-eye"} href={"czTrailtour2020"}>
          {this.getLsiComponent("resultsLink")}
        </UU5.Bricks.TouchIcon>
      </UU5.Bricks.Well>
    );
  },

  _getBacklog() {
    return (
      <UU5.Bricks.Section header={this.getLsiComponent("backlogHeader")}>
        <UU5.Bricks.Ul>
          {BacklogConfig.items.map((item, i) => (
            <UU5.Bricks.Li key={i}>
              <UU5.Bricks.Lsi lsi={item} />
            </UU5.Bricks.Li>
          ))}
        </UU5.Bricks.Ul>
      </UU5.Bricks.Section>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Container {...this.getMainPropsToPass()} header={this.getLsiComponent("welcomeHeader")} level={3}>
        <UU5.Bricks.P>
          <UU5.Bricks.Lsi lsi={AboutLsi.welcomeText} />
        </UU5.Bricks.P>
        <UU5.Bricks.P>
          <UU5.Bricks.Lsi lsi={AboutLsi.registrationText} />
        </UU5.Bricks.P>
        <UU5.Bricks.P>
          <UU5.Bricks.Lsi lsi={AboutLsi.contactText} />
        </UU5.Bricks.P>
        {this._getResultsLink()}
        {this._getBacklog()}
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default Home;
