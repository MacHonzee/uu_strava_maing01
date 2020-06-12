//@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
//@viewOff:imports
export const Left = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Left",
    classNames: {
      main: ""
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
      trailtour2019: {
        cs: "Trailtour 2019",
        en: "Trailtour 2019"
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
          backgroundColor: "brown",
          backgroundColorTo: "chocolate",
          title: "uuStrava",
          companyLogo: "../assets/strava-logo.png"
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
          <Plus4U5.App.MenuTree
            borderBottom
            items={[
              {
                content: this.getLsiComponent(Config.DEFAULT_ROUTE),
                href: Config.DEFAULT_ROUTE
              },
              {
                content: this.getLsiComponent("trailtour2019"),
                href: "trailtour2019"
              }
            ]}
          />
        </Plus4U5.App.MenuProvider>
      </Plus4U5.App.Left>
    );
  }
  //@@viewOff:render
});

export default Left;
