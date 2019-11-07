//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "../config/config.js";
import Calls from "calls";
import "./segments-table.less";
//@@viewOff:imports

const SegmentsTable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "SegmentsTable",
    classNames: {
      main: Config.CSS + "segments-table",
    }
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
  _getChild(data) {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        Přehled segmentů
        <br/>
        <br/>
        // TODO zobrazovat - name (jako link s id), city, pr_date, effort_count
        {data.itemList.map((item, i) => <UU5.Bricks.Div key={item.id}>{i+1}. {item.name}</UU5.Bricks.Div>)}
      </UU5.Bricks.Div>
    )
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Loader onLoad={Calls.segmentList}>
        {({isLoading, isError, data}) => {
          if (isLoading) {
            return <UU5.Bricks.Loading/>;
          } else if (isError) {
            return <UU5.Bricks.Error errorData={data}/>;
          } else {
            let correctData = data && (data.data || data);
            return this._getChild(correctData);
          }
        }}
      </UU5.Common.Loader>
    );
  }
  //@@viewOff:render
});

export default SegmentsTable;
