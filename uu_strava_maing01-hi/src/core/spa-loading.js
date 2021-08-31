//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "./config/config.js";
import "../loading.less";
//@@viewOff:imports

const SpaLoading = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SpaLoading",
    classNames: {
      main: Config.Css.css`
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `,
      caption: Config.Css.css`
        position: relative;
        top: 120px;
        color: #fff;
        font-size: 2.3em;
        font-weight: 700;
      `,
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div className="running-wrapper">
        <div className="running">
          <div className="outer">
            <div className="body">
              <div className="arm behind" />
              <div className="arm front" />
              <div className="leg behind" />
              <div className="leg front" />
            </div>
          </div>
        </div>
        <div className="running-caption">Trailtour Analytics</div>
      </div>
    );
  },
  //@@viewOff:render
});

export default SpaLoading;
