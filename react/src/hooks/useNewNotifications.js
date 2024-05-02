import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Firebase from '../firebaseConfig'
import { setOrders } from '../redux/actions';
import { firebase_order_service } from '../services/firebase/order_service';
const rtdb = Firebase.database();
const rootRef = rtdb.ref('users')
const _ = require("lodash");

const useNewNotification = () => {
  const [newnotifications, setNotifications] = useState([])
  const user = useSelector(state => state.user)
  const { id } = user
  const [error, seterror] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const allorders = useSelector((state) => state.orders)

  useMemo(() => {
    console.log('running order fetching service');
    (async () => {
      try {
        // Orders
        const maxOrderUpdated = await firebase_order_service.getMaxUpdatedAt(allorders)
        let result
        if (user.role == 'Customer') {
          result = await firebase_order_service.getAllCustomerOrders(id, maxOrderUpdated)
        }
        if (user.role == 'Supplier') {
          result = await firebase_order_service.getAllSupplierOrders(id, maxOrderUpdated)
        }
        if (!result.length) {
          // dispatch(setOrders([...result]))
        } else {
          const sortedOrders = [...allorders, ...result].sort((a, b) => b.updatedAt - a.updatedAt)
          const uniqueOrders = _.uniqBy(sortedOrders, 'orderID')
          dispatch(setOrders(uniqueOrders))
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [newnotifications]);

  useEffect(() => {
    try {
      rootRef.child(user.id).child('notifications').orderByChild('notificationStatus').equalTo('new').on('value', (snapshot) => {
        let data = []
        snapshot.forEach((snappy) => {
          data = [...data, { ...snappy.val(), id: snappy.key }]
        })
        setNotifications(data.sort((a, b) => b.createdAt - a.createdAt))
      })
    } catch (err) {
      seterror(err)
    }
  }, [])

  return { newnotifications, error, loading }
}

export default useNewNotification;
