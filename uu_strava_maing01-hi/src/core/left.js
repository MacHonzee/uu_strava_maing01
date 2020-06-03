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
      trailtour2020: {
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
          backgroundImageSrc: "assets/strava-logo.png",
          height: 140
        }}
        aboutItems={[
          {
            content: this.getLsiComponent("about"),
            href: "about"
          }
        ]}
      >
        <Plus4U5.App.MenuProvider activeItemId="home">
          <Plus4U5.App.MenuTree
            items={[
              // {
              //   content: this.getLsiComponent("segments"),
              //   href: "home"
              // },
              {
                content: this.getLsiComponent("trailtour2020"),
                href: "trailtour2020"
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
