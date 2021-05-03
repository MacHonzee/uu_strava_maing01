//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-bricks";
import "uu_plus4u5g01-app";

import { Session } from "uu_appg01_oidc";
import Config from "./config/config.js";
import SpaAuthenticated from "./spa-authenticated.js";
import SpaLoading from "./spa-loading";
//@@viewOff:imports

const Spa = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Spa",
    classNames: {
      main: Config.Css.css``
    },
    getDerivedStateFromError(error) {
      return { error };
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      error: null
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let child;
    if (this.state.error) {
      child = <Plus4U5.App.SpaError error={this.state.error} />;
    } else {
      child = (
        <UU5.Common.Session session={Session.currentSession}>
          <UU5.Common.Identity>
            <UU5.Common.Identity.Item pending>
              <SpaLoading />
            </UU5.Common.Identity.Item>
            <UU5.Common.Identity.Item authenticated notAuthenticated>
              <SpaAuthenticated {...this.getMainPropsToPass()} />
            </UU5.Common.Identity.Item>
          </UU5.Common.Identity>
        </UU5.Common.Session>
      );
    }

    return child;
  }
  //@@viewOff:render
});

export default Spa;
