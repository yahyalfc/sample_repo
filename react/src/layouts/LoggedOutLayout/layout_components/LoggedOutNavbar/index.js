import { useState } from "react";
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import Toolbar from "@material-ui/core/Toolbar"
import Grid from "@material-ui/core/Grid"
import Hidden from "@material-ui/core/Hidden"
import DrawerRightLoggedOut from "./DrawerRightLoggedOut";
import img from "../../../../images/brand-logo.png";
// import "./shtyle.css";
import style from "./style";

function LoggedOutNavbar({ }) {

  const [open, setOpen] = useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    // <div>
    <AppBar style={style.themeColor}>
      <Toolbar>
        <Grid container justify="space-between" >
          <Grid item lg={3} md={3} style={style.imageStyle}>
            <img src={img} height={45} />
          </Grid>
          <Hidden smDown>
            <Grid item lg={9} md={9}>
              <Button style={style.button}>Products</Button>
              <Button style={style.button}>Resource Center</Button>
              <Button style={style.button}>Contact Us</Button>
            </Grid>
          </Hidden>
          <Hidden mdUp>
            <Grid item xs={2}>
              <DrawerRightLoggedOut
                open={open}
                handleDrawerToggle={handleDrawerToggle}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Toolbar>
    </AppBar>
    // </div>
  );
}

export default LoggedOutNavbar;