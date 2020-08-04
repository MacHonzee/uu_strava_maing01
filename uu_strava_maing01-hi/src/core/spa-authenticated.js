//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import * as Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import Calls from "calls";
import "../calls-overrides";

import Left from "./left";
import Bottom from "./bottom.js";
import About from "../routes/about.js";
import StravaToken from "../routes/strava-token.js";
import StravaLogin from "../routes/strava-login";
import Trailtour from "../routes/trailtour";

import SpaContext from "../context/spa-context";
import TourDetail from "../routes/tour-detail";
import AthleteTourDetail from "../routes/athlete-tour-detail";
import Home from "../routes/home";
import TourSegments from "../routes/tour-segments";
import AthleteComparison from "../routes/athlete-comparison";
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

        .uu5-flextiles-list .uu5-flextiles-tile:hover {
          background-color: #e6e6e6;
        }

        .uu5-bricks-alert {
          top: 72px;
        }
      `
    },
    lsi: {
      name: Lsi.appName,
      home: {
        cs: "Domů",
        en: "Home"
      }
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
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChild(config) {
    let routes = {
      home: { component: <Home /> },
      trailtour: { component: <Trailtour /> },
      trailtourSegments: { component: <TourSegments /> },
      tourDetail: { component: <TourDetail /> },
      athleteTourDetail: { component: <AthleteTourDetail /> },
      athleteComparison: { component: <AthleteComparison /> },
      about: { component: <About /> }
    };

    if (UU5.Environment.getSession().isAuthenticated() && !config.athlete) {
      routes.stravaLogin = { component: <StravaLogin /> };
      routes.stravaToken = { component: <StravaToken /> };
    }

    return (
      <SpaContext.Provider value={{ ...config }}>
        <Plus4U5.App.MenuProvider activeItemId={Config.DEFAULT_ROUTE}>
          <Plus4U5.App.Page
            {...this.getMainPropsToPass()}
            top={
              <Plus4U5.App.Top>
                <UU5.Bricks.Link onClick={this._goBack} style={{ marginRight: "16px" }}>
                  <UU5.Bricks.Icon icon={"mdi-arrow-left"} clickable />
                </UU5.Bricks.Link>
                <UU5.Bricks.Link href={Config.DEFAULT_ROUTE}>{this.getLsiComponent("home")}</UU5.Bricks.Link>
              </Plus4U5.App.Top>
            }
            left={<Left />}
            leftFixed
            leftRelative="m l xl"
            leftWidth="!xs-50 !s-40 !m-210px !l-210px !xl-210px"
            isLeftOpen="m l xl"
            showLeftToggleButton
            colorSchemaActive={"red"}
            bottom={<Bottom />}
            type={3}
            displayedLanguages={["cs", "en"]}
          >
            <UU5.Common.Router
              route={Config.DEFAULT_ROUTE}
              notFoundRoute={Config.DEFAULT_ROUTE}
              routes={routes}
              controlled={false}
            />
          </Plus4U5.App.Page>
        </Plus4U5.App.MenuProvider>
      </SpaContext.Provider>
    );
  },

  _goBack() {
    window.history.back();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.DataManager onLoad={Calls.loadAwidConfig} data={{}}>
        {({ errorState, errorData, data }) => {
          if (errorState) {
            return <Plus4U5.App.SpaError errorData={errorData} />;
          } else if (data) {
            let config = data && (data.data || data);
            return this._getChild(config);
          } else {
            return <Plus4U5.App.SpaLoading content={"Trailtour Analytics"} />;
          }
        }}
      </UU5.Common.DataManager>
    );
  }
  //@@viewOff:render
});

export default SpaAuthenticated;
