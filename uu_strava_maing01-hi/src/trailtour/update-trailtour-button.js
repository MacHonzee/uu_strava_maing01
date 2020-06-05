//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import TranslatedServerError from "../bricks/translated-server-error";
//@@viewOff:imports

export const UpdateTrailtourButton = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "UpdateTrailtourButton",
    classNames: {
      main: (props, state) => Config.Css.css`
        &.uu5-bricks-loading {
          display: inline;
        }
      `,
      modalFooter: Config.Css.css`
        width: 100%;
        text-align: center;

        .uu5-bricks-button {
          width: 100px;
        }

        .uu5-bricks-button:first-child {
          margin-right: 8px;
        }
      `
    },
    lsi: {
      label: {
        cs: "Obnovit data",
        en: "Update data"
      },
      warningText: {
        cs: "Potvrďte prosím žádost o aktualizaci dat.",
        en: "Please confirm the request to update the data."
      },
      confirm: {
        cs: "Ano",
        en: "Yes"
      },
      refuse: {
        cs: "Zrušit",
        en: "Cancel"
      },
      success: {
        cs: "Data úspěšně aktualizována.",
        en: "Data successfully updated."
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    year: UU5.PropTypes.number.isRequired,
    onUpdateDone: UU5.PropTypes.func.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      loading: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleClick() {
    let modal = UU5.Environment.getPage().getModal();
    modal.open({
      header: this.getLsiComponent("label"),
      content: <UU5.Bricks.Paragraph>{this.getLsiComponent("warningText")}</UU5.Bricks.Paragraph>,
      footer: this._getModalFooter(),
      size: "s"
    });
  },

  _getModalFooter() {
    return (
      <UU5.Bricks.Div className={this.getClassName("modalFooter")}>
        <UU5.Bricks.Button colorSchema={"primary"} onClick={this._handleUpdateTrailtour}>
          {this.getLsiComponent("confirm")}
        </UU5.Bricks.Button>
        <UU5.Bricks.Button onClick={this._handleCloseModal}>{this.getLsiComponent("refuse")}</UU5.Bricks.Button>
      </UU5.Bricks.Div>
    );
  },

  _handleCloseModal() {
    UU5.Environment.getPage()
      .getModal()
      .close();
  },

  _handleUpdateTrailtour() {
    this.setState({ loading: true });
    this._handleCloseModal();
    Calls.updateTrailtour({ year: this.props.year })
      .then(this._handleUpdateTrailtourDone)
      .catch(this._handleUpdateTrailtourFail);
  },

  _handleUpdateTrailtourDone() {
    this.setState({ loading: false });
    this.props.onUpdateDone();
    UU5.Environment.getPage()
      .getAlertBus()
      .setAlert({
        colorSchema: "success",
        content: this.getLsiComponent("success")
      });
  },

  _handleUpdateTrailtourFail(error) {
    console.error(error);
    this.setState({ loading: false });
    UU5.Environment.getPage()
      .getAlertBus()
      .setAlert({
        colorSchema: "red",
        content: <TranslatedServerError errorData={error} />
      });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.state.loading ? (
      <UU5.Bricks.Loading {...this.getMainPropsToPass()} />
    ) : (
      <UU5.Bricks.Button
        {...this.getMainPropsToPass()}
        colorSchema={"orange"}
        onClick={this._handleClick}
        bgStyle={"outline"}
      >
        {this.getLsiComponent("label")}
      </UU5.Bricks.Button>
    );
  }
  //@@viewOff:render
});

export default UpdateTrailtourButton;
