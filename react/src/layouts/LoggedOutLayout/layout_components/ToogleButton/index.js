import Grid from "@material-ui/core/Grid"
import { NavLink } from "react-router-dom";

export default function ToggleServices() {
  return (
    <Grid container style={{ display: "flex", justifyContent: "center" }}>
      <Grid
        container
        xs={10}
        sm={8}
        md={6}
        lg={6}
        xl={6}
        style={{
          backgroundColor: "white",
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "center",
          borderRadius: 25,
          padding: 2,
        }}
      >
        <Grid
          item
          xs={6}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
            textAlign: "center",
            borderRadius: 25,
            padding: 2,
          }}
        >
          <NavLink
            style={{
              color: "#42a5f5",
              backgroundColor: "white",
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
            to="/auth/register"
            activeStyle={{
              backgroundColor: "#42a5f5",
              color: "white",
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
          >
            Register
          </NavLink>
        </Grid>

        <Grid
          item
          xs={6}
          style={{
            backgroundColor: "white",
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
            textAlign: "center",
            borderRadius: 25,
            padding: 2,
          }}
        >
          <NavLink
            style={{
              color: "#42a5f5",
              backgroundColor: "white",
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
            to="/auth/login"
            activeStyle={{
              backgroundColor: "#42a5f5",
              color: "white",
              borderRadius: 25,
              padding: 10,
              textTransform: "none",
              width: "100%",
            }}
          >
            Login
          </NavLink>
        </Grid>
      </Grid>
    </Grid>
  );
}
