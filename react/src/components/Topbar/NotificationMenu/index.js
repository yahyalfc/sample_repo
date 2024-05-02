import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useSelector } from 'react-redux'
import {
  Box,
  createStyles,
  Divider,
} from "@material-ui/core";
import "./style.css";
import { firebase_notification_service } from "../../../services/firebase/notifications_service";
import useNewNotifications from '../../../hooks/useNewNotifications'
import customer_status from '../../../static/customer-notifications'
import supplier_status from '../../../static/supplier-notifications'
import { Link } from "react-router-dom";
var ago = require('s-ago');

export default function NotificationMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector(state => state.user)
  const orders = useSelector(state => state.orders)
  const { newnotifications, error } = useNewNotifications()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications(newnotifications)
  }, [newnotifications])

  const handleClick = (event) => {
    console.log({ LOL: event.currentTarget });
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (notification.type == 'order') {
      firebase_notification_service.notificationRead(user.id, notification.id).then((res) => {
        //go to relevant order
      })
    }
  }

  const computeWhereToGo = (role) => {
    return role == 'Supplier' ? 'supplier' : 'customer'
  }

  const computeStatus = (statuss) => {
    if (user.role == 'Supplier' && statuss) {
      return supplier_status.find((item) => item.status == statuss).text;
    }
    else if (user.role == 'Customer' && statuss) {
      return customer_status.find((item) => item.status == statuss).text
    }
    else return statuss;
  }

  const showAll = () => {
    window.location.pathname = '/app/showallnotifications'
  }

  const computeOwner = (orderID) => {
    const order = orders.find((item) => item.orderID === orderID)
    if (order) {
      if (user.role == 'Supplier') return order.customerName
      if (user.role == 'Customer') return order.supplierName
    }
  }

  return (
    <Box style={{ width: "10%" }}>
      <Button
        style={{ marginLeft: -40, height: 40 }}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      ></Button>
      <Menu
        className="MuiMenu"
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        anchorPosition={{ top: 0 }}

        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          marginTop: "43px ",
        }}
      >
        <MenuItem style={{ ...style.roleEmailText, color: '#42a5f5' }}>
          New Notifications
        </MenuItem>

        <Divider />

        {
          notifications.map((notification) => {
            const now = new Date(notification.createdAt)
            return (
              <div>
                <Link
                  to={{
                    pathname: `/app/${computeWhereToGo(user.role)}/${notification.type}?id=${notification.orderID}`
                  }}
                >
                  <MenuItem
                    className=" MuiMenu-item"
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13, color: 'gray',
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexWrap: 'wrap'
                      }}
                    >
                      {computeOwner(notification.orderID)}
                      {" "}
                      {
                        computeStatus(notification.status)
                      }
                    </p>
                    <span
                      style={{
                        fontSize: 13, color: '#E60203',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {ago(now)}
                    </span>
                  </MenuItem>
                </Link>
                <Divider />
              </div>
            )
          })
        }
        <MenuItem style={{ ...style.roleEmailText, color: '#42a5f5' }} onClick={showAll}>Show All</MenuItem>
      </Menu>
    </Box >
  );
}

const style = createStyles({
  popoverPaper: {
    maxHeight: "unset",
    maxWidth: "unset",
  },

  colorBlue: {
    color: "#42a5f5",
    borderLeft: "12px solid gray",
  },

  roleEmailText: {
    color: "#ABABAB",
    // padding: "0px 50px",
    display: "flex",
    justifyContent: "center",
  },
  colorRed: {
    // color: "#FA3434"
    borderLeft: "12px solid green",
  },
  avatar: {
    backgroundColor: "white",
    color: "#42A5F5",
  },
});
