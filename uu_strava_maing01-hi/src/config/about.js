import * as UU5 from "uu5g04";

// TODO refactor to AboutLsi
export const About = {
  licence: {
    organisation: {
      cs: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/"
      },
      en: {
        name: "Unicorn a.s.",
        uri: "https://www.unicorn.com/"
      }
    },
    authorities: {
      cs: [
        {
          name: "Jan Rudolf",
          uri: "https://www.unicorn.com/"
        }
      ],
      en: [
        {
          name: "Jan Rudolf",
          uri: "https://www.unicorn.com/"
        }
      ]
    }
  },
  leadingAuthors: [
    {
      name: "Jan Rudolf",
      uuIdentity: "5-8385-1",
      src: "../assets/5-8385-1.png",
      role: {
        en: "Chief Developer"
      }
    }
  ],
  otherAuthors: [],
  usedTechnologies: {
    technologies: {
      en: [
        <UU5.Bricks.LinkUAF key={"linkUAF"} />,
        <UU5.Bricks.LinkUuApp key={"linkUuApp"} />,
        <UU5.Bricks.LinkUU5 key={"linkUu5"} />,
        <UU5.Bricks.LinkUuPlus4U5 key={"linkPlus4U5"} />,
        <UU5.Bricks.Link
          key={"productCatalogue"}
          content="uuProductCatalogue"
          href="https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-7f743efd1bf6486d8e72b27a0df92ba7/book"
          target="_blank"
        />,
        <UU5.Bricks.LinkUuAppServer key={"linkUuAppServer"} />,
        <UU5.Bricks.LinkUuOIDC key={"linkUuOIDC"} />,
        <UU5.Bricks.LinkUuCloud key={"linkUuCloud"} />
      ]
    },
    content: {
      cs: [
        `<uu5string/>Dále byly použity technologie: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>, <UU5.Bricks.LinkBootstrap/>,
        <UU5.Bricks.LinkReact/>, <UU5.Bricks.LinkRuby/>, <UU5.Bricks.LinkPuma/> a <UU5.Bricks.LinkDocker/>.
        Aplikace je provozována v rámci internetové služby <UU5.Bricks.LinkPlus4U/> s využitím cloudu <UU5.Bricks.LinkMSAzure/>.`
      ],
      en: [
        `<uu5string/>Other used technologies: <UU5.Bricks.LinkHTML5/>, <UU5.Bricks.LinkCSS/>, <UU5.Bricks.LinkJavaScript/>, <UU5.Bricks.LinkBootstrap/>,
        <UU5.Bricks.LinkReact/>, <UU5.Bricks.LinkRuby/>, <UU5.Bricks.LinkPuma/> a <UU5.Bricks.LinkDocker/>.
        Application is operated in the <UU5.Bricks.LinkPlus4U/> internet service with the usage of <UU5.Bricks.LinkMSAzure/> cloud.`
      ]
    }
  }
};

export default About;
