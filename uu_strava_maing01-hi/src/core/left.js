//@viewOn:imports
//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import Lsi from "../config/lsi";
import Config from "./config/config.js";
import withLanguage from "../bricks/with-language";
import TrailtourNamesLsi from "../lsi/trailtour-names-lsi";
//@@viewOff:imports

export const Left = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Left",
    classNames: {
      main: Config.Css.css`
        .plus4u5-app-menu-tree .plus4u5-app-tree-menu-item {
          .color-schema-blue-rich.uu5-bricks-link,
          .color-schema-blue-rich.uu5-bricks-link:link,
          .color-schema-blue-rich.uu5-bricks-link:visited {
            background-color: chocolate;
          }
        }
      `
    },
    lsi: {
      segments: {
        cs: "Segmenty",
        en: "Segments"
      },
      tourSegments: {
        cs: "Etapy",
        en: "Segments"
      },
      tourResults: {
        cs: "Výsledky",
        en: "Results"
      },
      clubResults: {
        cs: "Výsledky klubů",
        en: "Club results"
      },
      tourRuns: {
        cs: "Poslední běhy",
        en: "Last runs"
      },
      about: {
        cs: "O aplikaci",
        en: "About"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    config: UU5.PropTypes.object.isRequired
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
  _getMenuPanels() {
    return this.props.config.trailtours.map(trailtour => {
      return (
        <Plus4U5.App.MenuPanel
          key={trailtour.id}
          expanded={trailtour.state === "active"}
          header={<UU5.Bricks.Lsi lsi={TrailtourNamesLsi[trailtour.year]} />}
          borderBottom
        >
          <Plus4U5.App.MenuTree
            items={[
              {
                id: "trailtour_" + trailtour.year,
                content: this.getLsiComponent("tourResults"),
                href: "trailtour?year=" + trailtour.year
              },
              {
                id: "trailtourRuns_" + trailtour.year,
                content: this.getLsiComponent("tourRuns"),
                href: "trailtourRuns?year=" + trailtour.year
              },
              {
                id: "trailtourClubs_" + trailtour.year,
                content: this.getLsiComponent("clubResults"),
                href: "trailtourClubs?year=" + trailtour.year
              },
              {
                id: "trailtourSegments_" + trailtour.year,
                content: this.getLsiComponent("tourSegments"),
                href: "trailtourSegments?year=" + trailtour.year
              }
            ]}
          />
        </Plus4U5.App.MenuPanel>
      );
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Plus4U5.App.Left
        {...this.getMainPropsToPass()}
        logoProps={{
          backgroundColor: "chocolate",
          backgroundColorTo: "chocolate",
          title: UU5.Common.Tools.getLsiValueByLanguage(Lsi.appName, this.props.language)
        }}
        aboutItems={[
          {
            id: "about",
            content: this.getLsiComponent("about"),
            href: "about"
          }
        ]}
        homeHref={Config.DEFAULT_ROUTE}
      >
        {this._getMenuPanels()}
      </Plus4U5.App.Left>
    );
  }
  //@@viewOff:render
});

export default withLanguage(Left);
