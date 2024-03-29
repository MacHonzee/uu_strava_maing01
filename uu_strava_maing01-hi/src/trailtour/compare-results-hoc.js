//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponentWithRef, useEffect, useRef, useState } from "uu5g04-hooks";
import Calls from "calls";
import overridenTextInputFind from "../bricks/optimize-autocomplete-items";
//@@viewOff:imports

const Lsi = {
  modalHeader: {
    cs: "Porovnání výsledků",
    en: "Results comparison",
  },
  modalInfo: {
    cs: "Vyberte dalšího atleta, se kterým budou srovnány výsledky. Stačí zadat část jména a našeptávač napoví zbytek.",
    en:
      "Pick another athlete to compare results with. It is enough to input just a part of name and autocomplete will do the rest.",
  },
  firstAthlete: {
    cs: "První atlet/ka",
    en: "First athlete",
  },
  secondAthlete: {
    cs: "Druhý atlet/ka",
    en: "Second athlete",
  },
  noAthleteSelected: {
    cs: "Nezvolili jste žádného atleta/ku k porovnání.",
    en: "No athlete was selected for comparison.",
  },
};

function CompareResultsHoc(Component, displayName) {
  return createComponentWithRef({
    //@@viewOn:statics
    displayName,
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      year: UU5.PropTypes.string.isRequired,
      firstAthlete: UU5.PropTypes.object,
      secondAthlete: UU5.PropTypes.object,
    },
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    defaultProps: {
      firstAthlete: {},
      secondAthlete: {},
    },
    //@@viewOff:defaultProps

    //@@viewOn:render
    render(props, ref) {
      const modalRef = useRef();
      const selectedFirstAthlete = useRef(props.firstAthlete.stravaId);
      const selectedSecondAthlete = useRef(props.secondAthlete.stravaId);
      const selectedAthleteRefs = { firstAthlete: selectedFirstAthlete, secondAthlete: selectedSecondAthlete };

      const [athletes, setAthletes] = useState({ men: [], women: [] });
      useEffect(() => {
        Calls.listAthletes({ year: props.year })
          .then((dtoOut) => {
            setAthletes(dtoOut);
          })
          .catch((errorDtoOut) => {
            console.error(errorDtoOut);
          });
      }, [props.year]);

      function prepareAutocompleteItems() {
        let sex = props.sex === "male" ? "men" : "women";
        return athletes[sex].map((athl) => {
          return {
            value: athl.name,
            content: athl.name,
            params: { stravaId: athl.stravaId },
          };
        });
      }

      function saveForm(opt) {
        let hasInvalid = false;
        Object.keys(selectedAthleteRefs).forEach((inputName) => {
          if (!selectedAthleteRefs[inputName].current) {
            let input = opt.component.getInputByName(inputName);
            input.setError(<UU5.Bricks.Lsi lsi={Lsi.noAthleteSelected} />);
            hasInvalid = true;
          }
        });
        if (hasInvalid) return;

        let params = {
          year: props.year,
          first: selectedFirstAthlete.current,
          second: selectedSecondAthlete.current,
        };
        UU5.Environment.setRoute("athleteComparison", params);
      }

      function cancelForm() {
        modalRef.current && modalRef.current.close();
      }

      function handleOnChange(opt) {
        // this is an optimalization to TextInputMixin._find, that keeps lagging autocomplete with many items
        opt.component._find = overridenTextInputFind;

        let name = opt.component.getName();
        let refToSave = selectedAthleteRefs[name];
        if (opt.autocompleteItem) {
          refToSave.current = opt.autocompleteItem.params.stravaId;
        } else {
          refToSave.current = undefined;
        }
        opt.component.onChangeDefault(opt);
      }

      function openModal() {
        modalRef.current.open({
          overflow: true,
          header: (
            <UU5.Forms.ContextHeader
              content={<UU5.Bricks.Lsi lsi={Lsi.modalHeader} />}
              info={<UU5.Bricks.Lsi lsi={Lsi.modalInfo} />}
            />
          ),
          content: (
            <UU5.Forms.ContextForm onSave={saveForm} onCancel={cancelForm}>
              <UU5.Forms.Text
                name="firstAthlete"
                label={<UU5.Bricks.Lsi lsi={Lsi.firstAthlete} />}
                value={props.firstAthlete.name}
                inputColWidth={"xs-12 m-9"}
                labelColWidth={"xs-12 m-3"}
                autocompleteItems={prepareAutocompleteItems()}
                onChange={handleOnChange}
                required
              />
              <UU5.Forms.Text
                name="secondAthlete"
                label={<UU5.Bricks.Lsi lsi={Lsi.secondAthlete} />}
                value={props.secondAthlete.name}
                inputColWidth={"xs-12 m-9"}
                labelColWidth={"xs-12 m-3"}
                autocompleteItems={prepareAutocompleteItems()}
                onChange={handleOnChange}
                required
              />
            </UU5.Forms.ContextForm>
          ),
          footer: <UU5.Forms.ContextControls />,
        });
      }

      return (
        <UU5.Common.Fragment>
          <UU5.Forms.ContextModal ref_={modalRef} />
          <Component handleCompare={openModal} ref={ref} />
        </UU5.Common.Fragment>
      );
    },
  });
  //@@viewOff:render
}

export default CompareResultsHoc;
