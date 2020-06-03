//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";

import TranslatedServerError from "./translated-server-error";
//@@viewOff:imports

export const LoadFeedback = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "LoadFeedback",
    classNames: {
      main: Config.Css.css``
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    errorState: UU5.PropTypes.string,
    errorData: UU5.PropTypes.object,
    data: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.array])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      errorState: null,
      errorData: null,
      data: null
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { errorState, errorData, data, errorLsi } = this.props;

    if (errorState) {
      console.error(errorState, errorData);
      return <TranslatedServerError errorData={errorData} lsi={errorLsi} />;
    } else if (data) {
      return this.props.children;
    } else {
      return <UU5.Bricks.Loading />;
    }
  }
  //@@viewOff:render
});

export default LoadFeedback;
