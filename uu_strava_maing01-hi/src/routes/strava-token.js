//@@viewOn:imports
import * as UU5 from "uu5g04";
import Config from "./config/config.js";
import Calls from "calls";
import "./strava-token.less";
import SpaContext from "../context/spa-context";
//@@viewOff:imports

const StravaToken = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "StravaToken",
    classNames: {
      main: Config.CSS + "strava-token"
    },
    lsi: {
      success: {
        en: "Token was successfully retrieved from Strava. You will be redirected to home page in 5 seconds."
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
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Common.DataManager onLoad={Calls.createAthlete} data={this._getDtoIn()}>
          {({ errorState, errorData, data }) => {
            if (errorState) {
              console.error(errorState, errorData);
              return <UU5.Bricks.Error errorData={data} />;
            } else if (data) {
              return (
                <SpaContext.Consumer>
                  {({ updateConfig }) => {
                    setTimeout(() => updateConfig({ stravaTokenValid: true }), 5000);
                    return this.getLsiComponent("success");
                  }}
                </SpaContext.Consumer>
              );
            } else {
              return <UU5.Bricks.Loading />;
            }
          }}
        </UU5.Common.DataManager>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default StravaToken;
