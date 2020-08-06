//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Config from "./config/config.js";
import ClubTourCard from "./club-tour-card";
import ClubTourResultList from "./club-tour-result-list";
import OverallResults from "./overall-results";
//@@viewOff:imports

export const ClubTourResults = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "ClubTourResults",
    classNames: {
      main: (props, state) => Config.Css.css``
    },
    lsi: {
      runnersTab: {
        cs: "Běžci",
        en: "Runners"
      },
      segmentsTab: {
        cs: "Etapy",
        en: "Segments"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object.isRequired
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
    let trailtour = this.props.data.trailtour;
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <ClubTourCard trailtour={trailtour} club={trailtour.totalResults.clubResults[0]} />
        <UU5.Bricks.Tabs fade mountTabContent={"onFirstActive"}>
          <UU5.Bricks.Tabs.Item header={this.getLsiComponent("runnersTab")}>
            <OverallResults data={trailtour} year={trailtour.year} />
          </UU5.Bricks.Tabs.Item>
          <UU5.Bricks.Tabs.Item header={this.getLsiComponent("segmentsTab")}>
            <ClubTourResultList trailtour={trailtour} />
          </UU5.Bricks.Tabs.Item>
        </UU5.Bricks.Tabs>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ClubTourResults;
