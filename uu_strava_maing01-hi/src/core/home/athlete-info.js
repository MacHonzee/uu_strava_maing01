//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import Config from "../config/config.js";
import Calls from "calls";
import "./athlete-info.less";
//@@viewOff:imports

const AthleteInfo = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "AthleteInfo",
    classNames: {
      main: Config.CSS + "athlete-info",
      leftCol: Config.CSS + "athlete-info-left-col",
      rightCol: Config.CSS + "athlete-info-right-col"
    },
    lsi: {
      exportAllButton: {
        en: "Export Activities"
      },
      refreshSegmentsButton: {
        en: "Update Segments"
      }
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
    let buttonProps = {
      colorSchema: "deep-orange",
      bgStyle: "filled",
      elevation: 1,
      elevationHover: 2,
      borderRadius: "4px",
      size: "m"
    };

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.Div className={this.getClassName("leftCol")}>
          <UU5.Bricks.Image src={data.profile} alt={"profile-logo"} borderRadius={"50%"} width={"80px"} elevation={3}/>
          <UU5.Bricks.Link href={"https://www.strava.com/athletes/" + data.stravaId} target={"_blank"}>
            {`${data.firstname} ${data.lastname}`}
          </UU5.Bricks.Link>
        </UU5.Bricks.Div>
        <UU5.Bricks.Div className={this.getClassName("rightCol")}>
          <UU5.Bricks.Button
            {...buttonProps}
            content={this.getLsiComponent("exportAllButton")}
            onClick={this._handleExportAll}
          />
          <UU5.Bricks.Button
            {...buttonProps}
            content={this.getLsiComponent("refreshSegmentsButton")}
            onClick={this._handleRefreshSegments}
          />
        </UU5.Bricks.Div>
      </UU5.Bricks.Div>
    )
  },

  _handleExportAll() {
    alert("Zde pak bude nějaký modál s progress barem. Přes SSE to bude posílat změny, dokud to celé nedoběhne.")
  },

  _handleRefreshSegments() {
    alert("Zde pak bude nějaký modál s progress barem. Přes SSE to bude posílat změny, dokud to celé nedoběhne.")
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Loader onLoad={Calls.loadAthleteMyself}>
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

export default AthleteInfo;
