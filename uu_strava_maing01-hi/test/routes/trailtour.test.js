import UU5 from "uu5g04";
import UuStrava from "uu_strava_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuStrava.Routes.Trailtour`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuStrava.Routes.Trailtour />);
    expect(wrapper).toMatchSnapshot();
  });
});
