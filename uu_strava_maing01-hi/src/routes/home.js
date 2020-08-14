//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5chartg01";
import Lsi from "../config/lsi";
import Config from "./config/config.js";
import BacklogConfig from "../config/backlog-config";
import BrickTools from "../bricks/tools";
import withSetMenuItem from "../bricks/with-set-menu-item";
import AboutLsi from "../lsi/about-lsi";

//@@viewOff:imports

const Home = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.RouteMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: Config.TAG + "Home",
    classNames: {
      main: Config.Css.css`
        .uu5-bricks-well {
          text-align: center;
        }
      `
    },
    lsi: {
      welcomeHeader: {
        cs: "Vítejte v aplikaci " + Lsi.appName.cs,
        en: "Welcome to application " + Lsi.appName.en
      },
      resultsLinkCZ: {
        cs: "Výsledky CZ 2020",
        en: "Results CZ 2020"
      },
      resultsLinkSK: {
        cs: "Výsledky SK 2020",
        en: "Results SK 2020"
      },
      backlogHeader: {
        cs: "Rozpracované funkčnosti",
        en: "Future functions"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    BrickTools.setDocumentTitle({}, "home");
    this.props.setMenuItem("home");
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getResultsLink() {
    return (
      <UU5.Bricks.Well bgStyle={"transparent"}>
        <UU5.Bricks.TouchIcon colorSchema={"orange"} icon={"mdi-flag-checkered"} href={"trailtour?year=2020_CZ"}>
          {this.getLsiComponent("resultsLinkCZ")}
        </UU5.Bricks.TouchIcon>
        <UU5.Bricks.TouchIcon colorSchema={"yellow-rich"} icon={"mdi-flag-checkered"} href={"trailtour?year=2020_SK"}>
          {this.getLsiComponent("resultsLinkSK")}
        </UU5.Bricks.TouchIcon>
      </UU5.Bricks.Well>
    );
  },

  _getBacklog() {
    return (
      <UU5.Bricks.Section header={this.getLsiComponent("backlogHeader")}>
        <UU5.Bricks.Ul>
          {BacklogConfig.items.map((item, i) => (
            <UU5.Bricks.Li key={i}>
              <UU5.Bricks.Lsi lsi={item} />
            </UU5.Bricks.Li>
          ))}
        </UU5.Bricks.Ul>
      </UU5.Bricks.Section>
    );
  },

  _getChart() {
    const response = {
      results: [
        {
          elevation: 223.3140563964844,
          location: {
            lat: 49.94945,
            lng: 15.27806
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 224.1874389648438,
          location: {
            lat: 49.9497763790454,
            lng: 15.27835318934111
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 223.1902923583984,
          location: {
            lat: 49.95013779463934,
            lng: 15.27854884764363
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 223.2831268310547,
          location: {
            lat: 49.95049787046518,
            lng: 15.2787506129123
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.9481353759766,
          location: {
            lat: 49.95085794594105,
            lng: 15.27895238119797
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.2830200195312,
          location: {
            lat: 49.95121055068298,
            lng: 15.27918162789406
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.3520660400391,
          location: {
            lat: 49.95155461599269,
            lng: 15.27944228346299
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.7858276367188,
          location: {
            lat: 49.95187485203348,
            lng: 15.27976194244868
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.7437896728516,
          location: {
            lat: 49.95216997644881,
            lng: 15.28013996428981
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.3094940185547,
          location: {
            lat: 49.95243792410434,
            lng: 15.28056445950458
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.7105255126953,
          location: {
            lat: 49.95270247425699,
            lng: 15.28099392266741
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 221.8990478515625,
          location: {
            lat: 49.95298607474141,
            lng: 15.28139344639389
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 218.3759002685547,
          location: {
            lat: 49.95326967385365,
            lng: 15.28179297482604
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 221.1571960449219,
          location: {
            lat: 49.95355327159367,
            lng: 15.28219250796394
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.3795013427734,
          location: {
            lat: 49.95383686796144,
            lng: 15.28259204580766
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.6153106689453,
          location: {
            lat: 49.95412046295694,
            lng: 15.28299158835729
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.2328186035156,
          location: {
            lat: 49.9543822445631,
            lng: 15.28340261505971
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.2430267333984,
          location: {
            lat: 49.95462381824059,
            lng: 15.28386407811771
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.4356384277344,
          location: {
            lat: 49.95486539008748,
            lng: 15.28432554580573
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 219.5388336181641,
          location: {
            lat: 49.95510325193825,
            lng: 15.28479152535242
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 219.489501953125,
          location: {
            lat: 49.95533318052073,
            lng: 15.28526714994286
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 219.0989837646484,
          location: {
            lat: 49.9555631071585,
            lng: 15.28574277907546
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.6510925292969,
          location: {
            lat: 49.95579303185158,
            lng: 15.28621841275029
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 218.0337677001953,
          location: {
            lat: 49.95602295459988,
            lng: 15.28669405096737
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 218.7108459472656,
          location: {
            lat: 49.95624378318946,
            lng: 15.28717994840778
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 218.2158355712891,
          location: {
            lat: 49.95646339766216,
            lng: 15.2876672173485
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 221.2156677246094,
          location: {
            lat: 49.9566830100938,
            lng: 15.28815449073402
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 218.4245147705078,
          location: {
            lat: 49.95688508662011,
            lng: 15.28865973077523
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 217.3538360595703,
          location: {
            lat: 49.95708658452566,
            lng: 15.28916556555899
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 217.2604522705078,
          location: {
            lat: 49.95728808023166,
            lng: 15.28967140457635
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.6524658203125,
          location: {
            lat: 49.95748957373807,
            lng: 15.29017724782738
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 215.9949493408203,
          location: {
            lat: 49.95772800276482,
            lng: 15.29058165961978
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 215.9227752685547,
          location: {
            lat: 49.95811073242565,
            lng: 15.29058980281568
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.3187713623047,
          location: {
            lat: 49.95849077896007,
            lng: 15.29052977749878
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 215.8504638671875,
          location: {
            lat: 49.95877514382098,
            lng: 15.29015794777996
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.3878631591797,
          location: {
            lat: 49.95903143290416,
            lng: 15.28971856715954
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.6344299316406,
          location: {
            lat: 49.95938740032191,
            lng: 15.28952877999775
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 216.8479766845703,
          location: {
            lat: 49.95972386590653,
            lng: 15.28925569598213
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 217.4530487060547,
          location: {
            lat: 49.96006409081815,
            lng: 15.28916558908549
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 219.2781372070312,
          location: {
            lat: 49.96043215071677,
            lng: 15.28905151478863
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 220.52490234375,
          location: {
            lat: 49.96078648685412,
            lng: 15.28883273245806
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 221.8796844482422,
          location: {
            lat: 49.9611140658569,
            lng: 15.28852499696002
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 221.0903930664062,
          location: {
            lat: 49.96137042253759,
            lng: 15.28809782696983
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 222.1140899658203,
          location: {
            lat: 49.96158191643277,
            lng: 15.28772400960521
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 224.0620880126953,
          location: {
            lat: 49.96196368037354,
            lng: 15.28768099398969
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 224.7953338623047,
          location: {
            lat: 49.96234571759257,
            lng: 15.28764494494281
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 226.4693908691406,
          location: {
            lat: 49.96272801533704,
            lng: 15.28761553734833
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 229.3212585449219,
          location: {
            lat: 49.9630877934276,
            lng: 15.28742801458497
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 230.0997314453125,
          location: {
            lat: 49.96344234714653,
            lng: 15.28720381023663
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 234.1134033203125,
          location: {
            lat: 49.96379660404265,
            lng: 15.287
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 235.0542907714844,
          location: {
            lat: 49.96393793361312,
            lng: 15.28737759928485
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 237.6257629394531,
          location: {
            lat: 49.96431913379394,
            lng: 15.28732384053499
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 240.2657012939453,
          location: {
            lat: 49.96469954310146,
            lng: 15.28726087594184
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 243.248779296875,
          location: {
            lat: 49.96507645690496,
            lng: 15.28715722526698
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 244.875732421875,
          location: {
            lat: 49.96545206749394,
            lng: 15.28707357972614
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 247.7834777832031,
          location: {
            lat: 49.96580796461386,
            lng: 15.28729259083626
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 250.0116271972656,
          location: {
            lat: 49.96616386132146,
            lng: 15.28751160518502
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 251.3801422119141,
          location: {
            lat: 49.96651347821248,
            lng: 15.28775265876986
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 254.9694519042969,
          location: {
            lat: 49.96685663771527,
            lng: 15.28801617665487
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.0318908691406,
          location: {
            lat: 49.96718506573316,
            lng: 15.28832179433924
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 260.7597045898438,
          location: {
            lat: 49.9675134929482,
            lng: 15.28862741619432
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 262.7829895019531,
          location: {
            lat: 49.96782291001953,
            lng: 15.28897689090602
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 266.2008666992188,
          location: {
            lat: 49.96812837572099,
            lng: 15.28933548223847
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 271.8347473144531,
          location: {
            lat: 49.96841930155694,
            lng: 15.28925901302268
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 276.591064453125,
          location: {
            lat: 49.96877623154662,
            lng: 15.289176208081
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 279.7612915039062,
          location: {
            lat: 49.9690995102711,
            lng: 15.28886797002521
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 292.1587524414062,
          location: {
            lat: 49.96942721110388,
            lng: 15.28856146598388
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 293.2384338378906,
          location: {
            lat: 49.96961703302053,
            lng: 15.28804840652411
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 300.1729431152344,
          location: {
            lat: 49.96998666222776,
            lng: 15.28790910733628
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 307.3355407714844,
          location: {
            lat: 49.97027464642393,
            lng: 15.28756341837492
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 318.184814453125,
          location: {
            lat: 49.97045559417695,
            lng: 15.28708728393963
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 322.0281982421875,
          location: {
            lat: 49.97050104788392,
            lng: 15.28649638281714
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 321.1927185058594,
          location: {
            lat: 49.97037916690174,
            lng: 15.28595527764521
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 318.385986328125,
          location: {
            lat: 49.97016417061974,
            lng: 15.28548104692856
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 317.6021423339844,
          location: {
            lat: 49.97007041146267,
            lng: 15.28490406913319
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 320.2394104003906,
          location: {
            lat: 49.970079856085,
            lng: 15.28431187688423
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 323.2316284179688,
          location: {
            lat: 49.97010218960053,
            lng: 15.28371778346567
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 320.7142944335938,
          location: {
            lat: 49.9700996902767,
            lng: 15.28312336265584
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 321.6921081542969,
          location: {
            lat: 49.97023735687851,
            lng: 15.28272725411129
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 326.4764099121094,
          location: {
            lat: 49.97059912438152,
            lng: 15.28256889183002
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 328.6214599609375,
          location: {
            lat: 49.97097786488091,
            lng: 15.28265496924696
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 331.060791015625,
          location: {
            lat: 49.97135833981862,
            lng: 15.28270304355751
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 330.8809204101562,
          location: {
            lat: 49.97172479176376,
            lng: 15.28253680574205
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 328.0947875976562,
          location: {
            lat: 49.97184450872983,
            lng: 15.28213400365523
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 330.2267456054688,
          location: {
            lat: 49.97175082738752,
            lng: 15.28155827293978
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 342.5745239257812,
          location: {
            lat: 49.97186023210169,
            lng: 15.28100187370003
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 346.7561340332031,
          location: {
            lat: 49.97200759435862,
            lng: 15.28045261668547
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 348.3559265136719,
          location: {
            lat: 49.97215495402241,
            lng: 15.27990335630716
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 350.7812805175781,
          location: {
            lat: 49.97211953867249,
            lng: 15.27934564132769
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 349.1338806152344,
          location: {
            lat: 49.9718996248149,
            lng: 15.27887171931503
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 345.1636657714844,
          location: {
            lat: 49.97164922577418,
            lng: 15.27846969030933
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 342.1608276367188,
          location: {
            lat: 49.97128942231764,
            lng: 15.27842057770493
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 339.6907043457031,
          location: {
            lat: 49.97092203765548,
            lng: 15.27856635388056
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.8237609863281,
          location: {
            lat: 49.97059128141377,
            lng: 15.2783357615937
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 333.4515686035156,
          location: {
            lat: 49.97045276208291,
            lng: 15.27778993924681
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 328.4178161621094,
          location: {
            lat: 49.97040073393944,
            lng: 15.27720593730808
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 322.6303405761719,
          location: {
            lat: 49.97048487236371,
            lng: 15.276625381447
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.8768310546875,
          location: {
            lat: 49.9704824501602,
            lng: 15.27603127961402
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 301.7959289550781,
          location: {
            lat: 49.97035850790843,
            lng: 15.27548183752217
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.8695068359375,
          location: {
            lat: 49.97018377718155,
            lng: 15.27495235326904
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 292.3581848144531,
          location: {
            lat: 49.97026519276598,
            lng: 15.27440458928993
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 290.7054443359375,
          location: {
            lat: 49.97046050968282,
            lng: 15.27389547872198
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.8638305664062,
          location: {
            lat: 49.97075431665134,
            lng: 15.27356189469715
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.2137145996094,
          location: {
            lat: 49.97104407066011,
            lng: 15.27335380340942
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 290.0110778808594,
          location: {
            lat: 49.97110157367418,
            lng: 15.27281269165381
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.5744323730469,
          location: {
            lat: 49.97133806857333,
            lng: 15.27238368490838
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.3876342773438,
          location: {
            lat: 49.97162163047187,
            lng: 15.27199255599742
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.2109985351562,
          location: {
            lat: 49.97186584643926,
            lng: 15.2715393718662
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.5939025878906,
          location: {
            lat: 49.97207357956705,
            lng: 15.27103951221455
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.5379333496094,
          location: {
            lat: 49.97218078896019,
            lng: 15.27047040031625
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.5769653320312,
          location: {
            lat: 49.9723051752464,
            lng: 15.26992660883776
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.1305847167969,
          location: {
            lat: 49.97250973132596,
            lng: 15.26943512080507
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.3887939453125,
          location: {
            lat: 49.97260167519244,
            lng: 15.26885965970079
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 281.6912231445312,
          location: {
            lat: 49.97280819066011,
            lng: 15.26837305327703
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 280.434814453125,
          location: {
            lat: 49.97291819060424,
            lng: 15.26780452782622
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.7060852050781,
          location: {
            lat: 49.97304746726235,
            lng: 15.26724435650899
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.1102294921875,
          location: {
            lat: 49.97317674122325,
            lng: 15.26668418218211
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 277.1859741210938,
          location: {
            lat: 49.97330601248692,
            lng: 15.2661240048456
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 275.1045837402344,
          location: {
            lat: 49.97343528105332,
            lng: 15.2655638244995
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 273.9328002929688,
          location: {
            lat: 49.97356454692243,
            lng: 15.26500364114386
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.1237182617188,
          location: {
            lat: 49.97366734513552,
            lng: 15.26443096537819
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.2265014648438,
          location: {
            lat: 49.97368472687685,
            lng: 15.26384272215641
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 277.7283020019531,
          location: {
            lat: 49.97359308362975,
            lng: 15.26326669483996
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 283.8892517089844,
          location: {
            lat: 49.97339563889045,
            lng: 15.26276598723102
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 293.3353576660156,
          location: {
            lat: 49.97315609793148,
            lng: 15.26230300052377
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.3404235839844,
          location: {
            lat: 49.97285896926591,
            lng: 15.26193126143724
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 295.2896728515625,
          location: {
            lat: 49.97250994754587,
            lng: 15.26169113172271
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 295.2708740234375,
          location: {
            lat: 49.97214807952592,
            lng: 15.26149923176828
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 299.5094604492188,
          location: {
            lat: 49.97177162654127,
            lng: 15.26151037206639
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 302.1107482910156,
          location: {
            lat: 49.97140286564049,
            lng: 15.26166957515165
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 305.0669860839844,
          location: {
            lat: 49.97104174780635,
            lng: 15.261866393858
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 306.5728759765625,
          location: {
            lat: 49.97066871698722,
            lng: 15.26199715517068
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 307.0146484375,
          location: {
            lat: 49.97029217957003,
            lng: 15.26210407327249
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 308.2328491210938,
          location: {
            lat: 49.96991468564741,
            lng: 15.26220178784459
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 311.7175903320312,
          location: {
            lat: 49.96953565340623,
            lng: 15.26228470109574
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 312.1090087890625,
          location: {
            lat: 49.96917907245016,
            lng: 15.26238862604753
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 319.5088500976562,
          location: {
            lat: 49.96880385146753,
            lng: 15.26250619684127
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 320.5984191894531,
          location: {
            lat: 49.96842863036611,
            lng: 15.26262376580187
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 319.2847595214844,
          location: {
            lat: 49.96805340914585,
            lng: 15.26274133292937
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.5964660644531,
          location: {
            lat: 49.96767620113062,
            lng: 15.26273193784699
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.0938110351562,
          location: {
            lat: 49.96733346481469,
            lng: 15.26246923370134
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 291.3066101074219,
          location: {
            lat: 49.96701605514579,
            lng: 15.26213700825531
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 288.0297546386719,
          location: {
            lat: 49.96669010239457,
            lng: 15.26182655733757
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.043212890625,
          location: {
            lat: 49.9663730738716,
            lng: 15.26149685960644
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 283.0064697265625,
          location: {
            lat: 49.96604541342914,
            lng: 15.26119471216001
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 281.2833251953125,
          location: {
            lat: 49.96587251015323,
            lng: 15.26082605914042
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.3946838378906,
          location: {
            lat: 49.96615620160242,
            lng: 15.26042658218337
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.81640625,
          location: {
            lat: 49.96643989167985,
            lng: 15.2600271005175
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.5413818359375,
          location: {
            lat: 49.9667235803855,
            lng: 15.25962761414272
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 288.3908996582031,
          location: {
            lat: 49.96705411835327,
            lng: 15.25933848729027
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 288.077880859375,
          location: {
            lat: 49.96731136197882,
            lng: 15.25897056104317
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.7389831542969,
          location: {
            lat: 49.96722891839755,
            lng: 15.25843781992698
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 290.686279296875,
          location: {
            lat: 49.96691664395101,
            lng: 15.25809809316385
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 293.0425720214844,
          location: {
            lat: 49.96658991221793,
            lng: 15.25778811387502
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.5655212402344,
          location: {
            lat: 49.96626317965892,
            lng: 15.25747813879444
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.5946044921875,
          location: {
            lat: 49.9659340917268,
            lng: 15.25717514037281
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 297.6061706542969,
          location: {
            lat: 49.96557388771129,
            lng: 15.25697711014357
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 299.4974060058594,
          location: {
            lat: 49.9653180041303,
            lng: 15.25655910193523
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 303.8141174316406,
          location: {
            lat: 49.96516195157911,
            lng: 15.25601608174988
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 307.4253845214844,
          location: {
            lat: 49.96500941244066,
            lng: 15.2554703297267
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 311.5057678222656,
          location: {
            lat: 49.964856870742,
            lng: 15.2549245811624
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 315.8645629882812,
          location: {
            lat: 49.96472214816446,
            lng: 15.25439054383331
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 320.8876647949219,
          location: {
            lat: 49.96455847564275,
            lng: 15.25385637200253
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 332.582275390625,
          location: {
            lat: 49.9646664083083,
            lng: 15.25334199367013
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 338.6747741699219,
          location: {
            lat: 49.96502613739196,
            lng: 15.25314326833268
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 343.5469970703125,
          location: {
            lat: 49.96537717925897,
            lng: 15.25291222249211
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 346.2208557128906,
          location: {
            lat: 49.96561766508456,
            lng: 15.25246445518171
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 348.7218933105469,
          location: {
            lat: 49.96577522662616,
            lng: 15.25192489023566
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 347.3443603515625,
          location: {
            lat: 49.96591617511461,
            lng: 15.25137677690356
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 343.9963684082031,
          location: {
            lat: 49.96591599051265,
            lng: 15.25083526542676
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 356.3155517578125,
          location: {
            lat: 49.96561536788656,
            lng: 15.25047880201953
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 361.5955505371094,
          location: {
            lat: 49.96531263975121,
            lng: 15.25012724334053
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 364.6793212890625,
          location: {
            lat: 49.96506432462311,
            lng: 15.24967675702568
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 365.9580383300781,
          location: {
            lat: 49.96479560121153,
            lng: 15.24925384107477
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 363.1853637695312,
          location: {
            lat: 49.96456240427745,
            lng: 15.24879346889482
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 361.5197143554688,
          location: {
            lat: 49.96446497220774,
            lng: 15.24822876796477
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 363.4180603027344,
          location: {
            lat: 49.96439097951674,
            lng: 15.24765036969988
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 363.3938903808594,
          location: {
            lat: 49.9642444513068,
            lng: 15.24710097471877
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 366.3450317382812,
          location: {
            lat: 49.96408979039126,
            lng: 15.24657464382261
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 358.0403747558594,
          location: {
            lat: 49.96387918628344,
            lng: 15.24608143144985
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 357.7796325683594,
          location: {
            lat: 49.96363618282207,
            lng: 15.24562169707705
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 357.0404052734375,
          location: {
            lat: 49.96340975672737,
            lng: 15.24514197665632
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 356.2950744628906,
          location: {
            lat: 49.96318376149352,
            lng: 15.24466173883917
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 357.7595825195312,
          location: {
            lat: 49.96303280703788,
            lng: 15.24413947363978
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 366.0802307128906,
          location: {
            lat: 49.96321481235355,
            lng: 15.24361786328544
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 373.3377685546875,
          location: {
            lat: 49.96330867480273,
            lng: 15.24304343388811
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 372.7023010253906,
          location: {
            lat: 49.96349204174635,
            lng: 15.24253404887254
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 369.2638244628906,
          location: {
            lat: 49.96369194144044,
            lng: 15.24202661477883
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 359.6126708984375,
          location: {
            lat: 49.96384581922739,
            lng: 15.24150782486934
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 355.9617309570312,
          location: {
            lat: 49.96352712000246,
            lng: 15.2412569092321
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 353.9994812011719,
          location: {
            lat: 49.96316023137265,
            lng: 15.24109012011052
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 354.1355895996094,
          location: {
            lat: 49.96279541805455,
            lng: 15.24091053317931
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 352.6017761230469,
          location: {
            lat: 49.96242802297458,
            lng: 15.24076675856675
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 349.5975646972656,
          location: {
            lat: 49.96204910901205,
            lng: 15.24074369886694
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 347.3190002441406,
          location: {
            lat: 49.96167516422865,
            lng: 15.24087069934472
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 344.9353332519531,
          location: {
            lat: 49.96130766690713,
            lng: 15.24084128218546
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 346.7906494140625,
          location: {
            lat: 49.96104065510602,
            lng: 15.24101934491858
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 347.5377197265625,
          location: {
            lat: 49.96071854345413,
            lng: 15.24084424294404
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 342.130126953125,
          location: {
            lat: 49.96044133060769,
            lng: 15.24043396694212
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 337.7799987792969,
          location: {
            lat: 49.96012805900749,
            lng: 15.24011185357528
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.3959655761719,
          location: {
            lat: 49.95986716393694,
            lng: 15.24028954201134
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 335.8146667480469,
          location: {
            lat: 49.95969158323624,
            lng: 15.24081823090195
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 333.9299621582031,
          location: {
            lat: 49.95951600013279,
            lng: 15.24134691593643
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 334.6892395019531,
          location: {
            lat: 49.95934041462667,
            lng: 15.24187559711478
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 335.0971374511719,
          location: {
            lat: 49.95916482671788,
            lng: 15.24240427443699
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.5973815917969,
          location: {
            lat: 49.9589745764085,
            lng: 15.24291925146851
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.6287536621094,
          location: {
            lat: 49.95875662031841,
            lng: 15.24340834153383
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 338.2322387695312,
          location: {
            lat: 49.95853866217205,
            lng: 15.24389742717107
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 337.0943603515625,
          location: {
            lat: 49.95832070196944,
            lng: 15.24438650838024
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.0997619628906,
          location: {
            lat: 49.9581027397106,
            lng: 15.24487558516138
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 334.4382934570312,
          location: {
            lat: 49.9578847753956,
            lng: 15.24536465751452
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 332.0194091796875,
          location: {
            lat: 49.95768853692149,
            lng: 15.24587481532008
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 330.1007995605469,
          location: {
            lat: 49.95750148365466,
            lng: 15.24639388673798
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 328.9188842773438,
          location: {
            lat: 49.95722891285635,
            lng: 15.24646502662521
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 329.6210327148438,
          location: {
            lat: 49.95691884253123,
            lng: 15.24611619725571
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 332.2032775878906,
          location: {
            lat: 49.95661537595792,
            lng: 15.24575370527002
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 333.096435546875,
          location: {
            lat: 49.95631345521564,
            lng: 15.24538801676147
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 334.1046752929688,
          location: {
            lat: 49.9560115333238,
            lng: 15.2450223328388
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.0142822265625,
          location: {
            lat: 49.95570961028242,
            lng: 15.24465665350194
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.9958190917969,
          location: {
            lat: 49.95540768609154,
            lng: 15.2442909787508
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 338.1131896972656,
          location: {
            lat: 49.95513067767568,
            lng: 15.2438846355795
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 337.5551147460938,
          location: {
            lat: 49.95488090754949,
            lng: 15.24343383219056
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.2906799316406,
          location: {
            lat: 49.95464012289343,
            lng: 15.24297144133663
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 337.1365356445312,
          location: {
            lat: 49.95440109660624,
            lng: 15.24250678469028
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.7196960449219,
          location: {
            lat: 49.95416206846303,
            lng: 15.24204213265677
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.9573059082031,
          location: {
            lat: 49.95392303846386,
            lng: 15.24157748523606
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.2690734863281,
          location: {
            lat: 49.95368223476047,
            lng: 15.24111508200648
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.614501953125,
          location: {
            lat: 49.95343827594612,
            lng: 15.24065666910092
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.6662902832031,
          location: {
            lat: 49.95319431532528,
            lng: 15.24019826083998
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.4877624511719,
          location: {
            lat: 49.95295035289801,
            lng: 15.2397398572236
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 336.3460388183594,
          location: {
            lat: 49.95270638866432,
            lng: 15.23928145825175
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 335.16064453125,
          location: {
            lat: 49.95246242262427,
            lng: 15.23882306392434
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 334.8045959472656,
          location: {
            lat: 49.95221845477786,
            lng: 15.23836467424134
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 334.5117492675781,
          location: {
            lat: 49.95192513871057,
            lng: 15.23800883520442
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 332.6758422851562,
          location: {
            lat: 49.95169167715913,
            lng: 15.23753741998678
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 330.9463195800781,
          location: {
            lat: 49.95145405521286,
            lng: 15.23707184573602
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 330.314697265625,
          location: {
            lat: 49.95114458938637,
            lng: 15.23673318479867
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 326.4566955566406,
          location: {
            lat: 49.95078287461793,
            lng: 15.23655137962042
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 324.6781005859375,
          location: {
            lat: 49.95040199042322,
            lng: 15.2365820024107
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 322.5670471191406,
          location: {
            lat: 49.95002408323003,
            lng: 15.23667647922107
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 321.0110778808594,
          location: {
            lat: 49.94965283969316,
            lng: 15.23682098440066
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 320.9908447265625,
          location: {
            lat: 49.94929971286072,
            lng: 15.23695183241769
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 319.2188415527344,
          location: {
            lat: 49.94892671741329,
            lng: 15.23708537330437
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 318.1168212890625,
          location: {
            lat: 49.94854739794267,
            lng: 15.23715532534354
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 316.2625122070312,
          location: {
            lat: 49.94817268528256,
            lng: 15.23726838521303
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 313.5868530273438,
          location: {
            lat: 49.94783638502766,
            lng: 15.23754160665737
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 312.0323181152344,
          location: {
            lat: 49.94756515409717,
            lng: 15.23770515389968
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.0978698730469,
          location: {
            lat: 49.94726656808246,
            lng: 15.23733449254687
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.517333984375,
          location: {
            lat: 49.9469304873962,
            lng: 15.23706735163966
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.1882629394531,
          location: {
            lat: 49.94655188304854,
            lng: 15.23701312518897
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 311.0804748535156,
          location: {
            lat: 49.94617826072417,
            lng: 15.23690370962988
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 314.1248474121094,
          location: {
            lat: 49.94581584413756,
            lng: 15.23671582333045
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 314.334716796875,
          location: {
            lat: 49.94546148877099,
            lng: 15.23649094478593
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 313.6139526367188,
          location: {
            lat: 49.94511336052753,
            lng: 15.23624369905219
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 312.8402709960938,
          location: {
            lat: 49.94476525803285,
            lng: 15.23599636250989
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 311.4431457519531,
          location: {
            lat: 49.94441715501225,
            lng: 15.23574902954225
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 310.1002502441406,
          location: {
            lat: 49.94405732663929,
            lng: 15.23554866309789
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 307.8529663085938,
          location: {
            lat: 49.94370411118101,
            lng: 15.23532090501832
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 307.1837768554688,
          location: {
            lat: 49.94335389964974,
            lng: 15.23508087246134
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 304.4785461425781,
          location: {
            lat: 49.94303389201266,
            lng: 15.23481345365785
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 303.4378967285156,
          location: {
            lat: 49.94280103691489,
            lng: 15.23441948154299
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 302.5670471191406,
          location: {
            lat: 49.94255545763388,
            lng: 15.23487535548891
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 302.6039428710938,
          location: {
            lat: 49.94232980679281,
            lng: 15.23535542693012
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 302.1067199707031,
          location: {
            lat: 49.94208882460585,
            lng: 15.2358078690558
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 300.3216857910156,
          location: {
            lat: 49.94176242846248,
            lng: 15.2361184728175
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 297.7044982910156,
          location: {
            lat: 49.94144540508196,
            lng: 15.23645175412893
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 297.678466796875,
          location: {
            lat: 49.94121367789494,
            lng: 15.2369172244347
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.4156494140625,
          location: {
            lat: 49.94100001276145,
            lng: 15.23741068599378
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.0328979492188,
          location: {
            lat: 49.94081632073322,
            lng: 15.23793200717544
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.1792602539062,
          location: {
            lat: 49.94063752491007,
            lng: 15.23845787796997
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.0503845214844,
          location: {
            lat: 49.94045884340446,
            lng: 15.23898383517579
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 297.4230651855469,
          location: {
            lat: 49.9402964294395,
            lng: 15.23952238053618
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.1719360351562,
          location: {
            lat: 49.94013401298108,
            lng: 15.2400609222656
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.69091796875,
          location: {
            lat: 49.93997159402927,
            lng: 15.24059946036405
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.2929382324219,
          location: {
            lat: 49.93977514066955,
            lng: 15.24110610033341
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 292.338134765625,
          location: {
            lat: 49.9395264655659,
            lng: 15.24155765656828
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.9471435546875,
          location: {
            lat: 49.93930435789756,
            lng: 15.24203897818458
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.4076232910156,
          location: {
            lat: 49.93914596225506,
            lng: 15.2425790036376
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 288.1092529296875,
          location: {
            lat: 49.93900851853174,
            lng: 15.24313406354084
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.8695373535156,
          location: {
            lat: 49.93888521289109,
            lng: 15.24369681912126
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.935546875,
          location: {
            lat: 49.93876961968542,
            lng: 15.24426377238915
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.7247009277344,
          location: {
            lat: 49.93862925149134,
            lng: 15.24481674846371
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.7821960449219,
          location: {
            lat: 49.93852000004583,
            lng: 15.24537796129887
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.5201110839844,
          location: {
            lat: 49.93868449609747,
            lng: 15.24589082585887
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 283.5340270996094,
          location: {
            lat: 49.93893692078841,
            lng: 15.24633737982463
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.3723449707031,
          location: {
            lat: 49.93912706475759,
            lng: 15.2468511937121
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.054443359375,
          location: {
            lat: 49.9392868840911,
            lng: 15.24739148818837
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.6343078613281,
          location: {
            lat: 49.93955012220514,
            lng: 15.24778767800364
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.7037353515625,
          location: {
            lat: 49.93991719142359,
            lng: 15.24794179768947
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.033447265625,
          location: {
            lat: 49.94029779783649,
            lng: 15.2479946022579
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.9966735839844,
          location: {
            lat: 49.94068023803245,
            lng: 15.24801911768463
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.3976135253906,
          location: {
            lat: 49.94106244192997,
            lng: 15.24800947673234
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 281.2540893554688,
          location: {
            lat: 49.94144199541365,
            lng: 15.24796699922921
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.8149108886719,
          location: {
            lat: 49.94178581219514,
            lng: 15.24821702148583
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 275.0057067871094,
          location: {
            lat: 49.94201054847098,
            lng: 15.24869098397076
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 272.93505859375,
          location: {
            lat: 49.94212402771819,
            lng: 15.24920088735201
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.4901428222656,
          location: {
            lat: 49.9417536334861,
            lng: 15.24930278428671
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 280.3254699707031,
          location: {
            lat: 49.94160000011887,
            lng: 15.24978959005839
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.1920166015625,
          location: {
            lat: 49.94164392340669,
            lng: 15.25037849070778
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 292.6598815917969,
          location: {
            lat: 49.94174333927326,
            lng: 15.25095224886243
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 300.7903442382812,
          location: {
            lat: 49.94190282918983,
            lng: 15.25148829155166
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 296.946044921875,
          location: {
            lat: 49.94183055961959,
            lng: 15.25203191364677
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 291.7259826660156,
          location: {
            lat: 49.9415812732236,
            lng: 15.25247681789031
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.5125732421875,
          location: {
            lat: 49.94142202251517,
            lng: 15.25301264378303
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 288.7194519042969,
          location: {
            lat: 49.9413131468209,
            lng: 15.25358195956074
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 286.7647705078125,
          location: {
            lat: 49.94122114269217,
            lng: 15.25415504793699
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.7359619140625,
          location: {
            lat: 49.94107703844733,
            lng: 15.2547060383566
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 271.8721008300781,
          location: {
            lat: 49.94093039916228,
            lng: 15.25525506906798
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 270.9254455566406,
          location: {
            lat: 49.94073037484659,
            lng: 15.25576171958142
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.3294372558594,
          location: {
            lat: 49.94052774258295,
            lng: 15.25624645539755
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 267.9865112304688,
          location: {
            lat: 49.94069559135538,
            lng: 15.25672388023857
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 261.3935241699219,
          location: {
            lat: 49.94054257288824,
            lng: 15.2572683296515
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 254.9380340576172,
          location: {
            lat: 49.9403100155585,
            lng: 15.25773330933821
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 251.4557952880859,
          location: {
            lat: 49.94007237017238,
            lng: 15.25819778083338
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 251.1067810058594,
          location: {
            lat: 49.93983017481261,
            lng: 15.2585735891097
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 253.9137115478516,
          location: {
            lat: 49.93947749114945,
            lng: 15.25834478663641
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 255.2442169189453,
          location: {
            lat: 49.93911872027811,
            lng: 15.25813861363033
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.2190856933594,
          location: {
            lat: 49.93884507733854,
            lng: 15.25772920262633
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 261.9882507324219,
          location: {
            lat: 49.93855241967342,
            lng: 15.2573461454453
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 262.7954711914062,
          location: {
            lat: 49.93818091218781,
            lng: 15.25727625599025
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 265.8975830078125,
          location: {
            lat: 49.93784498562943,
            lng: 15.2570699807796
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 270.3142395019531,
          location: {
            lat: 49.93764316141409,
            lng: 15.25656641410754
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 277.07861328125,
          location: {
            lat: 49.93743010901389,
            lng: 15.25607588556335
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.8983764648438,
          location: {
            lat: 49.93705524153395,
            lng: 15.25606803336253
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 289.8898010253906,
          location: {
            lat: 49.93667433863236,
            lng: 15.25601973544758
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 293.7293395996094,
          location: {
            lat: 49.93632575335517,
            lng: 15.2557767122177
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 293.4095458984375,
          location: {
            lat: 49.93596801034094,
            lng: 15.25556594630575
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 298.3098449707031,
          location: {
            lat: 49.93561348495545,
            lng: 15.25534176163177
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 299.6903076171875,
          location: {
            lat: 49.93524325200646,
            lng: 15.25520397895785
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.957763671875,
          location: {
            lat: 49.93502200628571,
            lng: 15.25544434024279
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.0935974121094,
          location: {
            lat: 49.93510257409907,
            lng: 15.25602355296846
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 281.8256530761719,
          location: {
            lat: 49.93528355459849,
            lng: 15.25654066329639
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 276.7639770507812,
          location: {
            lat: 49.93545957688156,
            lng: 15.2570687296161
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 272.6180114746094,
          location: {
            lat: 49.93552684832949,
            lng: 15.25764727677897
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 269.796875,
          location: {
            lat: 49.93549385388942,
            lng: 15.25823853757147
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 267.4019775390625,
          location: {
            lat: 49.93555261728385,
            lng: 15.2588261679331
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 266.5418090820312,
          location: {
            lat: 49.93567935767154,
            lng: 15.25938274817942
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 265.52099609375,
          location: {
            lat: 49.93579196916936,
            lng: 15.25993015417608
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 264.8587036132812,
          location: {
            lat: 49.9354309608948,
            lng: 15.25985818483319
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 261.7992553710938,
          location: {
            lat: 49.93520666576564,
            lng: 15.25942865769746
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 260.0578002929688,
          location: {
            lat: 49.93507816987817,
            lng: 15.25887317664611
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 260.9960632324219,
          location: {
            lat: 49.93480980011419,
            lng: 15.25846653319723
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.2742919921875,
          location: {
            lat: 49.93445369712147,
            lng: 15.2582527488537
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 252.0446166992188,
          location: {
            lat: 49.93418508208525,
            lng: 15.25843039777909
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 253.6542663574219,
          location: {
            lat: 49.93422176764844,
            lng: 15.2590129511448
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 253.9932708740234,
          location: {
            lat: 49.9341409200677,
            lng: 15.25951876588666
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.9322204589844,
          location: {
            lat: 49.93389542050993,
            lng: 15.25997144875546
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 256.7377014160156,
          location: {
            lat: 49.93391264108753,
            lng: 15.26050475611894
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 260.235107421875,
          location: {
            lat: 49.9341420948688,
            lng: 15.26098058224089
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 261.2433776855469,
          location: {
            lat: 49.93438060822309,
            lng: 15.26144567953245
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 264.8192749023438,
          location: {
            lat: 49.9346191197176,
            lng: 15.26191078142807
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 266.3646240234375,
          location: {
            lat: 49.93463452517792,
            lng: 15.26246259239128
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 267.0599670410156,
          location: {
            lat: 49.93460646550133,
            lng: 15.26304035194343
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 267.4833984375,
          location: {
            lat: 49.93468977732347,
            lng: 15.26360867612768
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 265.9172058105469,
          location: {
            lat: 49.93485001536891,
            lng: 15.2641126400742
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 263.3092041015625,
          location: {
            lat: 49.93508370636208,
            lng: 15.2645836159337
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 261.1395874023438,
          location: {
            lat: 49.93531739544816,
            lng: 15.26505459636131
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 259.7545776367188,
          location: {
            lat: 49.93561602295281,
            lng: 15.26542504035651
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 256.7978515625,
          location: {
            lat: 49.93591835171156,
            lng: 15.26578975682187
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.6377868652344,
          location: {
            lat: 49.93575899385293,
            lng: 15.26624669042726
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 258.0655822753906,
          location: {
            lat: 49.93553677797374,
            lng: 15.26670987331169
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 258.0498962402344,
          location: {
            lat: 49.93591951579204,
            lng: 15.26670271943381
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 257.6784362792969,
          location: {
            lat: 49.9363022536099,
            lng: 15.26669556544228
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 255.6902770996094,
          location: {
            lat: 49.93666351241782,
            lng: 15.26677448861928
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 254.2875366210938,
          location: {
            lat: 49.93690517361654,
            lng: 15.26711173327334
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 252.9730072021484,
          location: {
            lat: 49.9372000994622,
            lng: 15.26691202523991
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 255.0706481933594,
          location: {
            lat: 49.93722757321729,
            lng: 15.26720112289949
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 259.1969909667969,
          location: {
            lat: 49.93711231370609,
            lng: 15.26776545066086
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 268.9609985351562,
          location: {
            lat: 49.937336537295,
            lng: 15.26817241676064
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.7525024414062,
          location: {
            lat: 49.93770748491738,
            lng: 15.26831609290069
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.9634704589844,
          location: {
            lat: 49.93808225972039,
            lng: 15.26835358769713
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 285.1435241699219,
          location: {
            lat: 49.93831007807533,
            lng: 15.26789613403151
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.4356994628906,
          location: {
            lat: 49.9384932878549,
            lng: 15.26739224876968
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.9828186035156,
          location: {
            lat: 49.93886684982199,
            lng: 15.26735892680726
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 276.6472473144531,
          location: {
            lat: 49.93924694199198,
            lng: 15.26742457588452
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.7771911621094,
          location: {
            lat: 49.93962834255653,
            lng: 15.26747194163402
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 274.7222900390625,
          location: {
            lat: 49.94000932069124,
            lng: 15.26752934954676
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 276.2530822753906,
          location: {
            lat: 49.94039133101445,
            lng: 15.26756524302444
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.2412109375,
          location: {
            lat: 49.94077058831021,
            lng: 15.26749695528158
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 277.9187927246094,
          location: {
            lat: 49.94114930375532,
            lng: 15.26741066527032
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 276.6612854003906,
          location: {
            lat: 49.941529682922,
            lng: 15.26734543385242
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 275.9290466308594,
          location: {
            lat: 49.94191058597538,
            lng: 15.26728683316232
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 278.0582275390625,
          location: {
            lat: 49.94229233342199,
            lng: 15.26729521591723
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 287.16357421875,
          location: {
            lat: 49.94267344634432,
            lng: 15.26729453265446
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.1448059082031,
          location: {
            lat: 49.94305229144794,
            lng: 15.26720965046568
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.3316650390625,
          location: {
            lat: 49.94343322589835,
            lng: 15.26715154278366
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 294.7460327148438,
          location: {
            lat: 49.94381416031973,
            lng: 15.26709343418264
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 292.2223510742188,
          location: {
            lat: 49.94419509471208,
            lng: 15.26703532466262
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.8584899902344,
          location: {
            lat: 49.94439704331649,
            lng: 15.26750384910086
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 281.5374755859375,
          location: {
            lat: 49.94458093470396,
            lng: 15.26802550098727
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 275.0929260253906,
          location: {
            lat: 49.94478951120092,
            lng: 15.26851671078469
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 284.1216430664062,
          location: {
            lat: 49.94505763592211,
            lng: 15.26893912580347
          },
          resolution: 9.543951988220215
        },
        {
          elevation: 282.0072326660156,
          location: {
            lat: 49.94526000000002,
            lng: 15.26944
          },
          resolution: 9.543951988220215
        }
      ],
      status: "OK"
    };

    const totalLength = 16721.5;

    let min = response.results[0].elevation;
    let max = response.results[0].elevation;
    let data = response.results.map((result, i) => {
      let label = Math.round(((i + 1) / response.results.length) * totalLength);
      if (result.elevation < min) min = result.elevation;
      if (result.elevation > max) max = result.elevation;

      return {
        name: label,
        value: Math.round(result.elevation)
      };
    });

    function handleClick(data, event) {
      console.log(data, event);
    }

    return (
      <UU5.Bricks.Section header={"Kutná hora, 16,72km, 349m"}>
        <UU5.Chart.ResponsiveContainer height={300}>
          <UU5.Chart.LineChart data={data} onClick={handleClick}>
            <UU5.Chart.XAxis dataKey="name" />
            <UU5.Chart.YAxis domain={["dataMin - 10", "dataMax + 10"]} />
            <UU5.Chart.Line type={"linear"} dataKey={"value"} dot={false} unit={" m"} />
            <UU5.Chart.Tooltip />
            <UU5.Chart.ReferenceLine y={min} label={Math.round(min) + " m"} />
            <UU5.Chart.ReferenceLine y={max} label={Math.round(max) + " m"} />
          </UU5.Chart.LineChart>
        </UU5.Chart.ResponsiveContainer>
      </UU5.Bricks.Section>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Container {...this.getMainPropsToPass()} header={this.getLsiComponent("welcomeHeader")} level={3}>
        {/*<UU5.Bricks.P>*/}
        {/*  <UU5.Bricks.Lsi lsi={AboutLsi.welcomeText} />*/}
        {/*</UU5.Bricks.P>*/}
        {/*<UU5.Bricks.P>*/}
        {/*  <UU5.Bricks.Lsi lsi={AboutLsi.registrationText} />*/}
        {/*</UU5.Bricks.P>*/}
        {/*<UU5.Bricks.Lsi lsi={AboutLsi.contactText} />*/}
        {this._getChart()}
        {/*{this._getResultsLink()}*/}
        {/*{this._getBacklog()}*/}
      </UU5.Bricks.Container>
    );
  }
  //@@viewOff:render
});

export default withSetMenuItem(Home);
