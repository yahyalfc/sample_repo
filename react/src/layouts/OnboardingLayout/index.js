import { Steps, Step } from "react-step-builder";
import Verify from "./Module/Verify";
import RoleSelection from "./Module/RoleSelection";
import Location from "./Module/Location";
import EnterData from "./Module/EnterData";
import Footer from "../../components/Footer";
import Topbar from '../../components/Topbar'

const OnboardingLayout = () => {

  return (
    <div style={{ backgroundColor: "white", marginTop: 60 }}>
      <Topbar />
      <div style={{ minHeight: "100vh" }}>
        <Steps>
          <Step title={"Verify Your Email"} component={Verify} />
          <Step title={"Select Your Role"} component={RoleSelection} />
          <Step title={"Enter Your Information"} component={EnterData} />
          <Step title={"Enter Your Location"} component={Location} />
        </Steps>
      </div>
      <Footer />
    </div>
  );
};
export default OnboardingLayout;
