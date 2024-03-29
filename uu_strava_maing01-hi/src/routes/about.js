//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import Plus4U5 from "uu_plus4u5g01";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import AboutCfg from "../config/about.js";
import withSetMenuItem from "../bricks/with-set-menu-item";
import AboutLsi from "../lsi/about-lsi";

//@@viewOff:imports

export const About = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.LsiMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "About",
    classNames: {
      main: Config.Css.css`
        .plus4u5-app-about > .uu5-bricks-header,
        .plus4u5-app-licence > .uu5-bricks-header,
        .plus4u5-app-authors > .uu5-bricks-header,
        .plus4u5-app-technologies > .uu5-bricks-header {
          border-bottom: 0;
        }

        .plus4u5-app-authors > .uu5-bricks-header {
          margin: 20px 0 10px 0;
          text-align: center;
        }

        & > *:last-child {
          padding-bottom: 56px;
        }
      `,
      aboutText: Config.Css.css`
        text-align: center;
        font-size: 14px;
        color: #393939;
    `,
      logos: Config.Css.css`
        text-align:center;
        margin-top: 56px;

        .uu5-bricks-image {
          height: 80px;
        }
      `,
      termsOfUse: Config.Css.css`
        text-align: center;
        margin-top: 56px;
      `,
    },
    lsi: Lsi.about,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    this.props.setMenuItem("about");
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getAuthors(authors) {
    return (
      authors &&
      authors.slice().map((author) => {
        author = UU5.Common.Tools.merge({}, author);
        author.role =
          author.role && typeof author.role === "object" ? <UU5.Bricks.Lsi lsi={author.role} /> : author.role;
        // author.src =
        //   author.src || Calls.getCommandUri("getAppAuthorPhoto", { uuIdentity: author.uuIdentity }).toString();
        return author;
      })
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const leadingAuthors = this._getAuthors(AboutCfg.leadingAuthors);
    const otherAuthors = this._getAuthors(AboutCfg.otherAuthors);
    const usedTechnologies = AboutCfg.usedTechnologies || {};

    return (
      <UU5.Bricks.Section {...this.getMainPropsToPass()}>
        <Plus4U5.App.About
          header={<UU5.Bricks.Lsi lsi={AboutLsi.header} />}
          content={<UU5.Bricks.Lsi lsi={AboutLsi.welcomeText} />}
        />
        <UU5.Bricks.P className={this.getClassName("aboutText")}>
          <UU5.Bricks.Lsi lsi={AboutLsi.registrationText} />
        </UU5.Bricks.P>
        <UU5.Bricks.P className={this.getClassName("aboutText")}>
          <UU5.Bricks.Lsi lsi={AboutLsi.contactText} />
        </UU5.Bricks.P>
        <UU5.Bricks.Section
          header={<UU5.Bricks.Lsi lsi={AboutLsi.appVersion} />}
          level={4}
          style={{ textAlign: "center" }}
        >
          {UU5.Environment.appVersion}
        </UU5.Bricks.Section>
        <Plus4U5.App.Authors
          header={this.getLsiValue("creatorsHeader")}
          leadingAuthors={leadingAuthors}
          otherAuthors={otherAuthors}
        />
        <Plus4U5.App.Technologies
          technologies={this.getLsiItem(usedTechnologies.technologies)}
          content={this.getLsiItem(usedTechnologies.content)}
        />
        <UU5.Bricks.Div className={this.getClassName("logos")}>
          <UU5.Bricks.Image responsive={false} src="assets/plus4u.svg" />
          <UU5.Bricks.Image responsive={false} src="assets/unicorn.svg" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Section>
    );
  },
  //@@viewOff:render
});

export default withSetMenuItem(About);
