//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
//@@viewOff:imports

const Lsi = {
  noRightsError: {
    en: "You do not have rights to run the use case.",
    cs: "Nemáte práva spustit tuto funkčnost.",
  },
  unexpectedError: {
    en: "An unexpected error occured during the server call.",
    cs: "Došlo k neočekávané chybě.",
  },
};

export const TranslatedServerError = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TranslatedServerError",
    classNames: {
      main: Config.CSS + "translated-server-error",
    },
    defaults: {
      errorCodes: {
        "uu-appg01/authorization/accessDenied": Lsi.noRightsError,
      },
    },
    lsi: Lsi,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    lsi: UU5.PropTypes.PropTypes.object,
    errorData: UU5.PropTypes.PropTypes.object,
    errorMessage: UU5.PropTypes.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      lsi: {},
      errorData: { data: {} },
      errorMessageLsi: Lsi.unexpectedError,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getErrorContent() {
    let errorData = this.props.errorData.dtoOut;
    let errorMap = errorData && errorData.uuAppErrorMap;

    if (errorData && errorMap) {
      let errCode = Object.keys(errorMap).find((key) => errorMap[key].type === "error");
      let error = errorMap[errCode];

      let lsiItem = this.props.lsi[errCode] || this.getDefault("errorCodes")[errCode];
      if (lsiItem) {
        return <UU5.Bricks.Lsi lsi={lsiItem} />;
      } else {
        return (
          <UU5.Bricks.Div>
            {errCode}
            <br />
            <br />
            {error.message}
          </UU5.Bricks.Div>
        );
      }
    }

    return (
      <UU5.Bricks.Div>
        <UU5.Bricks.Lsi lsi={this.props.errorMessageLsi} />
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Error
        {...this.getMainPropsToPass()}
        content={this._getErrorContent()}
        moreInfo
        errorData={this.props.errorData}
      />
    );
  },
  //@@viewOff:render
});

export default TranslatedServerError;
