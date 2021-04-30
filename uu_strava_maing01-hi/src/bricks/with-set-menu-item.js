//@@viewOn:imports
import * as Plus4U5 from "uu_plus4u5g01";
import { createComponentWithRef } from "uu5g04-hooks";
//@@viewOff:imports

function withSetMenuItem(Component, displayName) {
  return createComponentWithRef({
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
        <Plus4U5.App.MenuConsumer>
          {({ setActiveItemId }) => <Component {...props} setMenuItem={setActiveItemId} ref={ref} />}
        </Plus4U5.App.MenuConsumer>
      );
    }
  });
  //@@viewOff:render
}

export default withSetMenuItem;
