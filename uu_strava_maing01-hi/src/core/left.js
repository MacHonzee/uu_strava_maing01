//@viewOn:imports
//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";
import Lsi from "../config/lsi";

import Config from "./config/config.js";
//@@viewOff:imports
//@viewOff:imports
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
      czTrailtour2020: {
        cs: "Trailtour 2020 CZ",
        en: "Trailtour 2020 CZ"
      },
      skTrailtour2020: {
        cs: "Trailtour 2020 SK",
        en: "Trailtour 2020 SK"
      },
      trailtour2019: {
        cs: "Trailtour 2019",
        en: "Trailtour 2019"
      },
      tourSegments: {
        cs: "Etapy",
        en: "Segments"
      },
      tourResults: {
        cs: "Výsledky",
        en: "Results"
      },
      about: {
        cs: "O aplikaci",
        en: "About"
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
    return (
      <Plus4U5.App.Left
        {...this.getMainPropsToPass()}
        logoProps={{
          backgroundColor: "chocolate",
          backgroundColorTo: "chocolate",
          title: <UU5.Bricks.Lsi lsi={Lsi.appName} />
        }}
        aboutItems={[
          {
            content: this.getLsiComponent("about"),
            href: "about"
          }
        ]}
        homeHref={Config.DEFAULT_ROUTE}
      >
        <Plus4U5.App.MenuProvider activeItemId={Config.DEFAULT_ROUTE}>
          <Plus4U5.App.MenuPanel expanded header={this.getLsiComponent("czTrailtour2020")} borderBottom>
            <Plus4U5.App.MenuTree
              items={[
                {
                  content: this.getLsiComponent("tourResults"),
                  href: "czTrailtour2020"
                },
                {
                  content: this.getLsiComponent("tourSegments"),
                  href: "czTrailtour2020segments"
                }
              ]}
            />
          </Plus4U5.App.MenuPanel>
          <Plus4U5.App.MenuPanel expanded header={this.getLsiComponent("skTrailtour2020")} borderBottom>
            <Plus4U5.App.MenuTree
              items={[
                {
                  content: this.getLsiComponent("tourResults"),
                  href: "skTrailtour2020"
                },
                {
                  content: this.getLsiComponent("tourSegments"),
                  href: "skTrailtour2020segments"
                }
              ]}
            />
          </Plus4U5.App.MenuPanel>
          <Plus4U5.App.MenuPanel header={this.getLsiComponent("trailtour2019")} borderBottom>
            <Plus4U5.App.MenuTree
              items={[
                {
                  content: this.getLsiComponent("tourResults"),
                  href: "trailtour2019"
                },
                {
                  content: this.getLsiComponent("tourSegments"),
                  href: "trailtour2019segments"
                }
              ]}
            />
          </Plus4U5.App.MenuPanel>
        </Plus4U5.App.MenuProvider>
      </Plus4U5.App.Left>
    );
  }
  //@@viewOff:render
});

export default Left;
