import Grid from "@material-ui/core/Grid"
import { useSelector } from 'react-redux'
import {
  Link as RouterLink,
  NavLink,
} from "react-router-dom";
function ProfileNavbar() {
  const user = useSelector(state => state.user)
  const role = user.role == 'Supplier' ? 'supplier' : user.role == 'Customer' ? 'customer' : 'undefined'

  return (
    <div style={{ display: "flex", marginTop: 30, marginBottom: 20 }}>
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
            flexDirection: "row",
            borderRadius: 25,
            padding: 2,
            boxShadow: " 0 0 17px -5px #9E9E9E",
          }}
        >
          <Grid
            item
            xs={4}
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
              to={`/app/${role}/order`}
              activeStyle={{
                backgroundColor: "#42a5f5",
                color: "white",
                borderRadius: 25,
                padding: 10,
                textTransform: "none",
                width: "100%",
              }}
            >
              Orders
            </NavLink>
          </Grid>

          <Grid
            item
            xs={4}
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
              to={`/app/${role}/profile`}
              activeStyle={{
                backgroundColor: "#42a5f5",
                color: "white",
                borderRadius: 25,
                padding: 10,
                textTransform: "none",
                width: "100%",
              }}
            >
              Profile
            </NavLink>
          </Grid>
          <Grid
            item
            xs={4}
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
              to={`/app/${role}/invoice`}
              activeStyle={{
                backgroundColor: "#42a5f5",
                color: "white",
                borderRadius: 25,
                padding: 10,
                textTransform: "none",
                width: "100%",
              }}
            >
              Invoices
            </NavLink>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProfileNavbar;
