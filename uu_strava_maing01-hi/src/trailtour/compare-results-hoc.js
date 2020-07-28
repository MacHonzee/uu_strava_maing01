//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
//@@viewOff:imports

function CompareResultsHoc(Component, displayName) {
  return createComponent({
    //@@viewOn:statics
    displayName,
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {},
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    defaultProps: {},
    //@@viewOff:defaultProps

    //@@viewOn:render
    render(props, ref) {
      function openModal() {
        UU5.Environment.getPage()
          .getModal()
          .open({ content: "I will be OPEN." });
      }

      console.log(props);

      return <Component handleCompare={openModal} ref={ref} />;
    }
  });
  //@@viewOff:render
}

export default CompareResultsHoc;
