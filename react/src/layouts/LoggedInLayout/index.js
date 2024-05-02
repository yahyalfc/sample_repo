import { Outlet } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Footer from "../../components/Footer";

const LoggedInLayout = () => {
  // on basis of props we will differentiate between what to render in

  return (
    <div style={{ minHeight: "100vh", backgroundColor: 'white', paddingTop: 60 }}>
      <Topbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LoggedInLayout;
