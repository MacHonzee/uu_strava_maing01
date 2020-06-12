//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-block-layout";
import Config from "./config/config.js";
import TourDetailLsi from "../lsi/tour-detail-lsi";
import SegmentLink from "../bricks/segment-link";
import SegmentDistance from "../bricks/segment-distance";
import SegmentElevation from "../bricks/segment-elevation";
//@@viewOff:imports

export const TourDetailCard = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "TourDetailCard",
    classNames: {
      main: (props, state) => Config.Css.css``,
      linksColumn: Config.Css.css`
        position: relative;

        > .uu5-common-div {
          position: absolute;
          right: 0;
        }
      `
    },
    lsi: {
      menCount: {
        cs: "Počet běžců",
        en: "Male runners count"
      },
      womenCount: {
        cs: "Počet běžkyň",
        en: "Female runners count"
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
  _getNameRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.name} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>
          <UU5.BlockLayout.Text weight={"primary"}>
            #{this.props.data.tourDetail.order} {this.props.data.tourDetail.name}
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column textAlign={"right"} className={this.getClassName("linksColumn")}>
          <UU5.Bricks.Div>
            <SegmentLink stravaId={this.props.data.tourDetail.stravaId}>
              {/* UU5.Bricks.Image has box nesting level, bullshit, does not fit here */}
              <img
                src={"./assets/strava_symbol_orange.png"}
                alt={"strava_symbol_orange"}
                width={"32px"}
                style={{ marginRight: "4px" }}
              />
            </SegmentLink>
            <UU5.Bricks.Link href={this.props.data.tourDetail.link} target={"_blank"}>
              <img
                src={"./assets/inov8-logo.png"}
                alt={"trailtour-logo"}
                width={"18px"}
                style={{ marginRight: "8px" }}
              />
            </UU5.Bricks.Link>
            <UU5.Bricks.Link href={this.props.data.tourDetail.gpxLink} download target={"_blank"}>
              <UU5.Bricks.Strong>
                <UU5.Bricks.Lsi lsi={TourDetailLsi.gpx} />
              </UU5.Bricks.Strong>
            </UU5.Bricks.Link>
          </UU5.Bricks.Div>
        </UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getAuthorRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.author} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>
          <UU5.BlockLayout.Text weight={"primary"}>{this.props.data.tourDetail.author}</UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getSegmentRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.distance} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>
          <UU5.BlockLayout.Text weight={"primary"}>
            <SegmentDistance distance={this.props.data.segment.distance} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.elevation} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>
          <UU5.BlockLayout.Text weight={"primary"}>
            <SegmentElevation elevation={this.props.data.segment.total_elevation_gain} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },

  _getLocationRow() {
    return (
      <UU5.BlockLayout.Row>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.state} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"30%"}>
          <UU5.BlockLayout.Text weight={"primary"}>{this.props.data.segment.state}</UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column width={"150px"}>
          <UU5.BlockLayout.Text weight={"secondary"}>
            <UU5.Bricks.Lsi lsi={TourDetailLsi.city} />
          </UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
        <UU5.BlockLayout.Column>
          <UU5.BlockLayout.Text weight={"primary"}>{this.props.data.segment.city}</UU5.BlockLayout.Text>
        </UU5.BlockLayout.Column>
      </UU5.BlockLayout.Row>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BlockLayout.Tile {...this.getMainPropsToPass()}>
        <UU5.BlockLayout.Block>
          {this._getNameRow()}
          {this._getAuthorRow()}
          {this._getLocationRow()}
          {this._getSegmentRow()}
        </UU5.BlockLayout.Block>
      </UU5.BlockLayout.Tile>
    );
  }
  //@@viewOff:render
});

export default TourDetailCard;
