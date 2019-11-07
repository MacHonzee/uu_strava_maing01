//@@viewOn:imports
import * as UU5 from "uu5g04";
import Config from "./config/config.js";
import "./strava-login.less";
import AuthorizeStravaButton from "../bricks/authorize-strava-button";
//@@viewOff:imports

const StravaLogin = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "StravaLogin",
    classNames: {
      main: Config.CSS + "strava-login"
    },
    lsi: {
      authorize: {
        en:
          "You have not authorized access to your Strava athlete account. Please authorize this application and confirm the full scope."
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
  _getDtoIn() {
    let params = this.props.params;
    return params && { code: params.code };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let buttonProps = {
      colorSchema: "deep-orange",
      bgStyle: "filled",
      elevation: 2,
      elevationHover: 3,
      borderRadius: "6px",
      size: "xl"
    };

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Image src={"assets/strava-logo.png"} />
        <UU5.Bricks.Paragraph content={this.getLsiComponent("authorize")} />
        <AuthorizeStravaButton buttonProps={buttonProps} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default StravaLogin;
