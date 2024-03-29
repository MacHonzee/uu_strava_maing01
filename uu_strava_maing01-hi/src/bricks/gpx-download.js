//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import Calls from "calls";
import TourDetailLsi from "../lsi/tour-detail-lsi";
//@@viewOff:imports

export const GpxDownload = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "GpxDownload",
    classNames: {
      main: (props, state) => Config.Css.css``,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    gpx: UU5.PropTypes.string.isRequired,
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
  _getDownloadUri() {
    return Calls.getCommandUri("trailtour/downloadGpx?gpxLink=" + this.props.gpx);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Link {...this.getMainPropsToPass()} href={this._getDownloadUri()} download>
        <UU5.Bricks.Strong>
          <UU5.Bricks.Lsi lsi={TourDetailLsi.gpx} />
        </UU5.Bricks.Strong>
      </UU5.Bricks.Link>
    );
  },
  //@@viewOff:render
});

export default GpxDownload;
