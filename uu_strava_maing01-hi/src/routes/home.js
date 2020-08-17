//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";
import Lsi from "../config/lsi";
import Config from "./config/config.js";
import BacklogConfig from "../config/backlog-config";
import BrickTools from "../bricks/tools";
import withSetMenuItem from "../bricks/with-set-menu-item";
import AboutLsi from "../lsi/about-lsi";
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
      resultsLinkCZ: {
        cs: "Výsledky CZ 2020",
        en: "Results CZ 2020"
      },
      resultsLinkSK: {
        cs: "Výsledky SK 2020",
        en: "Results SK 2020"
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
    this.props.setMenuItem("home");
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
        <UU5.Bricks.TouchIcon colorSchema={"orange"} icon={"mdi-flag-checkered"} href={"trailtour?year=2020_CZ"}>
          {this.getLsiComponent("resultsLinkCZ")}
        </UU5.Bricks.TouchIcon>
        <UU5.Bricks.TouchIcon colorSchema={"yellow-rich"} icon={"mdi-flag-checkered"} href={"trailtour?year=2020_SK"}>
          {this.getLsiComponent("resultsLinkSK")}
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
        <UU5.Bricks.Lsi lsi={AboutLsi.contactText} />
        {this._getResultsLink()}
        {this._getBacklog()}
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default withSetMenuItem(Home);
