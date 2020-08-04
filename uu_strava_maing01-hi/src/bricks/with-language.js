//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
//@@viewOff:imports

function withLanguage(Component, displayName) {
  return createComponent({
    //@@viewOn:statics
    displayName,
    //@@viewOff:statics

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    //@@viewOff:defaultProps

    //@@viewOn:render
    render(props, ref) {
      return (
        <UU5.Bricks.Lsi>{({ language }) => <Component {...props} language={language} ref={ref} />}</UU5.Bricks.Lsi>
      );
    }
  });
  //@@viewOff:render
}

export default withLanguage;
