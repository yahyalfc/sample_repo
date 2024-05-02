import { useEffect, useState } from "react";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Avatar,
  createStyles,
  Divider,
  ListItemIcon,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import { useSelector } from 'react-redux'

import "./style.css";
export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(state => state.user)
  //const {role} = user;

  useEffect(() => {

  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnProfile = () => {
    if (user?.role == "Supplier") {
      window.location.href = "/app/supplier/profile";
    }
    if (user?.role == "Customer") {
      window.location.href = "/app/customer/profile";
    }
  };

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.clear();
        window.location.href = "/auth/login";
        setAnchorEl(null);
      })
      .catch((err) => {
        console.log("error clearing local storage!", err);
      });
  };

  return (
    <>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Avatar style={style.avatar}>
          {user?.name ? user.name.toUpperCase().substring(1, 0) : null}
        </Avatar>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          marginTop: "55px ",
        }}
      >
        <MenuItem style={style.roleEmailText}>{user?.role}</MenuItem>

        <MenuItem style={style.roleEmailText}>
          <Typography
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0px 15px",
            }}
          >
            {user?.email}
          </Typography>
        </MenuItem>

        <MenuItem
          className="bar-menu MuiMenu-list"
          onClick={handleOnProfile}
          style={style.colorBlue}
        >
          <ListItemIcon>
            <AccountCircleIcon style={style.colorBlue} />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={handleClose} style={style.colorBlue}>
          <ListItemIcon>
            <SettingsOutlinedIcon style={style.colorBlue} />
          </ListItemIcon>
          Setting
        </MenuItem>

        <Divider />
        <MenuItem onClick={handleLogout} style={style.colorRed}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon style={style.colorRed} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

const style = createStyles({
  popoverPaper: {
    width: "100%",
    height: "100%",
    maxHeight: "unset",
    maxWidth: "unset",
  },

  colorBlue: {
    color: "#42a5f5",
  },

  roleEmailText: {
    color: "#ABABAB",
    padding: 2,
    display: "flex",
    justifyContent: "center",
  },
  colorRed: {
    color: "#FA3434",
  },
  avatar: {
    backgroundColor: "white",
    color: "#42A5F5",
  },
});
