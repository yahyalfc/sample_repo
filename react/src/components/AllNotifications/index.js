import { Divider, MenuItem } from '@material-ui/core'
import { useState, useEffect } from 'react'
import useAllNotifications from '../../hooks/useAllNotifications'
import { firebase_notification_service } from '../../services/firebase/notifications_service'
import { useSelector } from 'react-redux'
import supplier_status from '../../static/supplier-notifications'
import customer_status from '../../static/customer-notifications'
import { time_service } from '../../utils/time/timeAndDate'
import { Link } from "react-router-dom";
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
function AllNotifications() {
  const { allNotifications, error } = useAllNotifications()
  const [notifications, setNotifications] = useState([])
  const user = useSelector(state => state.user)
  const orders = useSelector(state => state.orders)

  useEffect(() => {
    setNotifications(allNotifications)
  }, [allNotifications])

  const handleNotificationClick = (notification) => {
    if (notification.type == 'order') {
      firebase_notification_service.notificationRead(user.id, notification.id).then((res) => {
        //go to relevant order
      })
    }
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

  const computeOwner = (orderID) => {
    const order = orders.find((item) => item.orderID === orderID)
    if (user.role == 'Supplier') return order.customerName
    if (user.role == 'Customer') return order.supplierName
  }

  const computeWhereToGo = (role) => {
    return role == 'Supplier' ? 'supplier' : 'customer'
  }

  return (
    <div style={{ padding: 40, }}>
      <h1 style={{ color: 'gray' }}>All notifications</h1>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
        <div style={{ width: '70%', border: '2px solid rgba(0, 0, 0, 0.05)', }}>
          {
            notifications.map((notification) => (
              <>
                <Link
                  to={{
                    pathname: `/app/${computeWhereToGo(user.role)}/${notification.type}?id=${notification.orderID}`,
                  }}
                >
                  <MenuItem
                    alignItems="center"
                    // className=" MuiMenu-item"
                    onClick={() => handleNotificationClick(notification)}
                    style={{ padding: 10 }}
                  >
                    <div style={{}}>
                      <p
                        style={{
                          fontSize: 15, color: 'gray',
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
                      <p style={{ color: 'gray' }}>
                        <div style={{ display: 'inline-block' }}>
                          <DateRangeIcon fontSize="small" style={{ color: '#42a5f5' }} /> <span style={{}}>{time_service.convertDateFormat(notification.createdAt).time} <AccessTimeIcon fontSize="small" /> {time_service.convertDateFormat(notification.createdAt).date} </span>
                        </div>
                      </p>
                    </div>
                  </MenuItem>
                </Link>
                <Divider />
              </>
            ))
          }
        </div>
      </div>
    </div >
  )
}

export default AllNotifications
