import Grid from "@material-ui/core/Grid";
import { Outlet } from "react-router-dom";
import AuthNavbar from "../layout_components/AuthNavbar";

const AuthLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        marginBottom: 50,
        marginTop: 50,
      }}
    >
      <Grid container style={{ justifyContent: "space-between" }}>
        <Grid item md={7} xs={12}>
          <AuthNavbar />
        </Grid>

        <Grid
          item
          md={5}
          xs={12}
          style={{ padding: "20px", display: "flex", justifyContent: "center" }}
        >
          <Outlet />
          {/* {!!toggle ? <Register /> : <Login />} */}
        </Grid>
      </Grid>
    </div>
  );
};

export default AuthLayout;
