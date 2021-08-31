//@@viewOn:imports
import * as UU5 from "uu5g04";
import Config from "./config/config.js";
import Calls from "calls";
import LoadFeedback from "../bricks/load-feedback";
//@@viewOff:imports

const StravaToken = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "StravaToken",
    classNames: {
      main: Config.Css.css`
        width: 100%;
        text-align: center;
        padding: 80px 48px 48px 48px;

        ${UU5.Utils.ScreenSize.getMaxMediaQueries("m", `padding: 48px 24px 24px 24px;`)}

        .uu5-bricks-paragraph {
          max-width: 480px;
        }
      `,
    },
    lsi: {
      // TODO angličtinu + textace + alternativní scénář
      success: {
        cs: "Aplikace úspěšně propojena se Stravou.",
      },
      accessDenied: {
        cs:
          "<uu5string/>Přístup byl odepřen.<br/><br/>Pro pokračování je nutné přejít na domovskou stránku a povolit aplikaci přístup k datům ze Stravy.",
      },
      invalidScope: {
        cs:
          "<uu5string/>Nebylo nastaveno dostatečné oprávnění.<br/><br/>Pro pokračování je nutné přejít na domovskou stránku a povolit aplikaci všechny požadované přístupy k datům ze Stravy, včetně údajům o aktivitách.",
      },
    },
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

  _showAccessDenied() {
    return <UU5.Common.Error>{this.getLsiComponent("accessDenied")}</UU5.Common.Error>;
  },

  _showNotEnoughScope() {
    return <UU5.Common.Error>{this.getLsiComponent("invalidScope")}</UU5.Common.Error>;
  },

  _renderSuccess() {
    return (
      <UU5.Common.DataManager onLoad={Calls.createAthlete} data={this._getDtoIn()}>
        {(data) => <LoadFeedback {...data}>{this._getSuccessChildren()}</LoadFeedback>}
      </UU5.Common.DataManager>
    );
  },

  _getSuccessChildren() {
    return <UU5.Bricks.Well colorSchema={"success"}>{this.getLsiComponent("success")}</UU5.Bricks.Well>;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let params = this.props.params || {};
    let child;
    if (params.error) {
      child = this._showAccessDenied();
    } else if (params.scope === "read") {
      child = this._showNotEnoughScope();
    } else {
      child = this._renderSuccess();
    }

    return <UU5.Bricks.Div {...this.getMainPropsToPass()}>{child}</UU5.Bricks.Div>;
  },
  //@@viewOff:render
});

export default StravaToken;
