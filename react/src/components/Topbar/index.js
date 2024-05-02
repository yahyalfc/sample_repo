import React from "react";

import {
  AppBar,
  Toolbar,
  Grid,
  Hidden,
  Badge,
  Button,
} from "@material-ui/core";
import DrawerRight from "./Drawer/Drawer";
import BarMenu from "./Menu/menu";
import img from "../../images/brand-logo.png";
import { NavLink } from "react-router-dom";
import "./shtyle.css";
import style from "./style";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationMenu from "./NotificationMenu";
import { useSelector } from 'react-redux'

function Topbar() {
  const [open, setOpen] = React.useState(false);
  const [blimp, setBlimp] = React.useState(false);
  const user = useSelector(state => state.user)
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleBadgeVisibility = () => {
    setBlimp(!blimp);
    // setBlimp(true)
  };

  return (
    <div>
      <AppBar style={style.themeColor}>
        <Toolbar>
          <Grid container justify="space-between">
            <Grid item lg={3} md={3} style={style.imageStyle}>
              <img src={img} height={45} />
            </Grid>
            <Hidden smDown>
              <Grid item lg={5} md={5} style={style.AvatarGrid}>
                {
                  user?.role == 'Supplier' || user?.role == 'Customer' ?
                    <NavLink
                      activeStyle={style.activeButton}
                      className="home"
                      style={{
                        ...style.homeButton,
                      }}
                      to="/app/dashboard"
                    >
                      Home
                </NavLink>
                    : ''
                }
                {
                  user?.role == "Supplier" ? (
                    <NavLink
                      activeStyle={style.activeButton}
                      className="home"
                      style={{
                        ...style.homeButton,
                      }}
                      to="/app/supplier/order"
                    >
                      Orders
                    </NavLink>
                  ) : user?.role == 'Customer' ? (
                    <NavLink
                      activeStyle={style.activeButton}
                      className="home"
                      style={{
                        ...style.homeButton,
                      }}
                      to="/app/customer/order"
                    >
                      Orders
                    </NavLink>
                  ) : ''}

                {user?.role == "Supplier" ? (
                  <NavLink
                    activeStyle={style.activeButton}
                    className="home"
                    style={{
                      ...style.homeButton,
                    }}
                    to="/app/products"
                  >
                    Products
                  </NavLink>
                ) : null}
                {user?.role == 'Supplier' || user?.role == 'Customer' ?
                  <>
                    <Badge color="error" invisible={blimp} variant="dot">
                      <Button
                        onClick={handleBadgeVisibility}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          marginLeft: 5,
                          marginRight: 5,
                        }}
                        startIcon={<NotificationsIcon style={{ color: "white" }} />}
                      >
                        <NotificationMenu />
                      </Button>
                    </Badge>
                  </>
                  : ''
                }
                <BarMenu />
              </Grid>
            </Hidden>

            <Hidden mdUp>
              <Grid item xs={2}>
                <DrawerRight
                  open={open}
                  handleDrawerToggle={handleDrawerToggle}
                />
              </Grid>
            </Hidden>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Topbar;
