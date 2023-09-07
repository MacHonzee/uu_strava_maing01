//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ClubLink",
  //@@viewOff:statics
};

export const ClubLink = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    year: UU5.PropTypes.string.isRequired,
    club: UU5.PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const encodedClub = encodeURIComponent(props.club);
    return (
      <UU5.Bricks.Link {...attrs} href={`clubDetail?year=${props.year}&name=${encodedClub}`}>
        {props.club}
      </UU5.Bricks.Link>
    );
    //@@viewOff:render
  },
});

//@@viewOn:components
//@@viewOff:components

export default ClubLink;
