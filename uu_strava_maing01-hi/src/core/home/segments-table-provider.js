//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5tilesg01";

import Config from "../config/config.js";
import Calls from "calls";
import SegmentsTable from "./segments-table";
import SegmentListContext from "../../context/segment-list-context";
//@@viewOff:imports

const SegmentsTableProvider = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SegmentsTableProvider",
    classNames: {
      main: Config.CSS + "segments-table-provider",
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
      <SegmentListContext.Provider
        onLoad={Calls.segmentList}
        onUpdate={{
          refreshOne: Calls.segmentRefreshOne,
        }}
      >
        <SegmentsTable />
      </SegmentListContext.Provider>
    );
  },
  //@@viewOff:render
});

export default SegmentsTableProvider;
