import UU5 from "uu5g04";
import UuStrava from "uu_strava_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuStrava.Trailtour.ClubTourCard`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuStrava.Trailtour.ClubTourCard />);
    expect(wrapper).toMatchSnapshot();
  });
});
