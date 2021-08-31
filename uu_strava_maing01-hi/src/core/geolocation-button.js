//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

const Lsi = {
  errors: {
    denied: {
      cs: "Přístup k určení polohy byl zamítnut.",
      en: "Permission for geolocation was denied.",
    },
    unavailable: {
      cs: "Pozici není možné určit.",
      en: "Position is unavailable.",
    },
    timeout: {
      cs: "Vypršelo spojení pro získání pozice.",
      en: "Acquiring location has timeouted.",
    },
  },
};

const ERROR_CODES_MAP = {
  1: "denied",
  2: "unavailable",
  3: "timeout",
};

export const GeolocationButton = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "GeolocationButton",
    classNames: {
      main: (props, state) => Config.Css.css``,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    activeClassName: UU5.PropTypes.string,
    drawPosition: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      active: false,
    };
  },

  componentWillUnmount() {
    if (this._watchId) {
      navigator.geolocation.clearWatch(this._watchId);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleLocate() {
    if (!this.state.active) {
      this._watchId = navigator.geolocation.watchPosition(this._handleLocateSuccess, this._handleLocateError, {
        enableHighAccuracy: true,
      });
    }
  },

  _handleLocateSuccess(position) {
    this.setState({ active: true });
    this.props.drawPosition(position);
  },

  _handleLocateError(error) {
    console.error(error);
    let errorLsi = ERROR_CODES_MAP[error.code.toString()];
    UU5.Environment.getPage()
      .getAlertBus()
      .setAlert({
        colorSchema: "danger",
        content: <UU5.Bricks.Lsi lsi={Lsi.errors[errorLsi]} />,
      });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    if (!navigator.geolocation) return null;

    let mainProps = this.getMainPropsToPass();
    if (this.state.active) {
      mainProps.className += " " + this.props.activeClassName;
    }

    return (
      <UU5.Bricks.Button {...mainProps} onClick={this._handleLocate}>
        <UU5.Bricks.Icon icon={"mdi-map-marker-circle"} />
      </UU5.Bricks.Button>
    );
  },
  //@@viewOff:render
});

export default GeolocationButton;
