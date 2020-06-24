//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import GoogleTrailtourMap from "../core/google-trailtour-map";
import MapyCzTrailtourMap from "../core/mapy-cz-trailtour-map";
//@@viewOff:imports

const Lsi = {
  changeMapTooltip: {
    cs: "Změnit typ mapy",
    en: "Change map type"
  }
};

export const TrailtourMap = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TrailtourMap",
    classNames: {
      main: (props, state) => Config.Css.css`
        position: relative;
        height: 400px;
      `,
      mapChangeButton: (props, state) => Config.Css.css`
        position: absolute;
        z-index: 10;
        top: 8px;
        left: 8px;
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    mapConfig: UU5.PropTypes.object.isRequired,
    segments: UU5.PropTypes.array.isRequired,
    showOwnResults: UU5.PropTypes.bool,
    showTourDetail: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      map: "mapyCz" // oneOf(["google", "mapyCz"])
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getGoogleMap() {
    return (
      <GoogleTrailtourMap
        mapConfig={this.props.mapConfig}
        segments={this.props.segments}
        showOwnResults={this.props.showOwnResults}
        showTourDetail={this.props.showTourDetail}
      />
    );
  },

  _getMapyCz() {
    return (
      <MapyCzTrailtourMap
        mapConfig={this.props.mapConfig}
        segments={this.props.segments}
        showOwnResults={this.props.showOwnResults}
        showTourDetail={this.props.showTourDetail}
      />
    );
  },

  _handleMapChange() {
    this.setState(prevState => ({
      map: prevState.map === "google" ? "mapyCz" : "google"
    }));
  },

  _getMapChangeButton() {
    // TODO some styling
    return (
      <UU5.Bricks.Lsi>
        {({ language }) => {
          let tooltip = UU5.Common.Tools.getLsiValueByLanguage(Lsi.changeMapTooltip, language);
          return (
            <UU5.Bricks.Button
              className={this.getClassName("mapChangeButton")}
              onClick={this._handleMapChange}
              tooltip={tooltip}
              content={tooltip}
              bgStyle={"outline"}
            />
          );
        }}
      </UU5.Bricks.Lsi>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this._getMapChangeButton()}
        {this.state.map === "google" && this._getGoogleMap()}
        {this.state.map === "mapyCz" && this._getMapyCz()}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TrailtourMap;
