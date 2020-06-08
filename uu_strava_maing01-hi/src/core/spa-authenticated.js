//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Calls from "calls";

import Left from "./left";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import Home from "../routes/home.js";
import StravaToken from "../routes/strava-token.js";
import StravaLogin from "../routes/strava-login";
import Trailtour from "../routes/trailtour";

import SpaContext from "../context/spa-context";
import TourDetail from "../routes/tour-detail";
import AthleteTourDetail from "../routes/athlete-tour-detail";
//@@viewOff:imports

const SpaAuthenticated = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaAuthenticated",
    classNames: {
      main: Config.Css.css`
        .plus4u5-app-top {
          background-color: chocolate;

          .uu5-bricks-link {
            color: white;
          }
        }
      `
    },
    lsi: {
      name: Lsi.appName
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
      config: null
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  updateConfig(config, setStateCallback) {
    this.setState({ config }, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChild(config, handleUpdateVisual) {
    let routes = {};
    if (config.athlete.token) {
      routes = {
        "": "trailtour2020",
        home: { component: <Home /> },
        trailtour2020: { component: <Trailtour year={2020} /> },
        trailtour2019: { component: <Trailtour year={2019} /> },
        tourDetail: { component: <TourDetail /> },
        athleteTourDetail: { component: <AthleteTourDetail /> },
        about: { component: <About identity={this.props.identity} /> }
      };
    } else {
      routes = {
        "": "stravaLogin",
        stravaLogin: { component: <StravaLogin /> },
        stravaToken: { component: <StravaToken /> },
        about: { component: <About identity={this.props.identity} /> }
      };
    }

    return (
      <SpaContext.Provider value={{ ...config, updateConfig: handleUpdateVisual }}>
        <Plus4U5.App.Page
          {...this.getMainPropsToPass()}
          top={
            <Plus4U5.App.Top
              content={
                // TODO link by měl být dle přihlášeného uživatele ideálně
                <UU5.Bricks.Link href={"athleteTourDetail?year=2020&stravaId=25797801"}>
                  {this.getLsiComponent("name")}
                </UU5.Bricks.Link>
              }
            />
          }
          left={config.athlete.token && <Left />}
          leftFixed
          leftRelative="m l xl"
          leftWidth="!xs-50 !s-40 !m-190px !l-190px !xl-190px"
          isLeftOpen="m l xl"
          showLeftToggleButton
          bottom={<Bottom />}
          type={3}
          displayedLanguages={["cs"]}
          key={"" + config.athlete.token}
        >
          <UU5.Common.Router
            notFoundRoute={config.athlete.token ? "home" : "stravaLogin"}
            routes={routes}
            controlled={false}
          />
        </Plus4U5.App.Page>
      </SpaContext.Provider>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.DataManager onLoad={Calls.loadAwidConfig} data={{}}>
        {({ errorState, errorData, data, handleReload }) => {
          if (errorState) {
            return <Plus4U5.App.SpaError errorData={errorData} />;
          } else if (data) {
            let config = data && (data.data || data);
            return this._getChild(config, handleReload);
          } else {
            return <Plus4U5.App.SpaLoading content={"uuStrava"} />;
          }
        }}
      </UU5.Common.DataManager>
    );
  }
  //@@viewOff:render
});

export default SpaAuthenticated;
