//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import UpdateTrailtourButton from "./update-trailtour-button";
//@@viewOff:imports

export const ResultsTimestamp = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ResultsTimestamp",
    classNames: {
      main: (props, state) => Config.Css.css`
        > .uu5-bricks-span {
          font-size: 12px;
          font-style: italic;
          margin-right: 8px;
        }
      `
    },
    lsi: {
      generatedStamp: {
        cs: "Poslední update: ",
        en: "Last update: "
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired,
    year: UU5.PropTypes.string.isRequired,
    handleReload: UU5.PropTypes.func.isRequired
  },
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
    let { data, year, handleReload } = this.props;
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Span>
          {this.getLsiComponent("generatedStamp")}
          <UU5.Bricks.DateTime value={data.lastUpdate} secondsDisabled />
        </UU5.Bricks.Span>
        {data.state === "active" && (
          <UU5.Bricks.Authenticated authenticated>
            <UpdateTrailtourButton year={year} onUpdateDone={handleReload} />
          </UU5.Bricks.Authenticated>
        )}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ResultsTimestamp;
