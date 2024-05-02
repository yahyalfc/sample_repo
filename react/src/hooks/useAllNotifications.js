import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Firebase from '../firebaseConfig'
import 'firebase/database'
const rtdb = Firebase.database();
const rootRef = rtdb.ref('users')

const useAllNotifications = () => {
  const [allNotifications, setAllNotifications] = useState([])
  const user = useSelector(state => state.user)
  const [error, seterror] = useState(null)

  useEffect(() => {
    try {
      rootRef.child(user.id).child('notifications').on('value', (snapshot) => {
        let data = []
        snapshot.forEach((snappy) => {
          data = [...data, { ...snappy.val(), id: snappy.key }]
        })
        setAllNotifications(data.sort((a, b) => b.createdAt - a.createdAt))
      })
    } catch (err) {
      seterror(err)
    }
  }, [])

  return { allNotifications, error }
}

export default useAllNotifications;
