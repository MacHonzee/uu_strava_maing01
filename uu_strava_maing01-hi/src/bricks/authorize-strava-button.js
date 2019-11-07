//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import Calls from "calls";
import SpaContext from "../context/spa-context";
//@@viewOff:imports

const AuthorizeStravaButton = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AuthorizeStravaButton",
    classNames: {
      main: Config.CSS + "authorize-strava-button"
    },
    lsi: {
      button: {
        en: "Authorize Strava"
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
  _onAuthorize(clientId) {
    let oAuthUri =
      "http://www.strava.com/oauth/authorize" +
      "?client_id=" +
      clientId +
      "&response_type=code" +
      "&redirect_uri=" +
      this._getCleanUri() +
      "/stravaToken" +
      "&approval_prompt=force" +
      "&scope=read,activity:read,activity:read_all,profile:read_all,read_all";
    location.replace(oAuthUri);
  },

  _getCleanUri() {
    let uri = Calls.APP_BASE_URI;
    return uri.replace(/\/$/, "");
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <SpaContext.Consumer>
        {({ clientId }) => {
          return (
            <UU5.Bricks.Button onClick={() => this._onAuthorize(clientId)} {...this.props.buttonProps}>
              {this.getLsiComponent("button")}
            </UU5.Bricks.Button>
          );
        }}
      </SpaContext.Consumer>
    );
  }
  //@@viewOff:render
});

export default AuthorizeStravaButton;
