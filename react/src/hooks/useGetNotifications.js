import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Firebase from '../firebaseConfig'
import 'firebase/database'
const rtdb = Firebase.database();
const rootRef = rtdb.ref('users')

const useGetNotification = () => {
  const [notification, setnotification] = useState(false)
  const user = useSelector(state => state.user)
  const [error, seterror] = useState(null)

  useEffect(() => {
    try {
      rootRef.child(user.id).child('notifications').on('value', (snapshot) => {
        const data = { id: snapshot.key, ...snapshot.val() };
        setnotification(true)
      })
    } catch (err) {
      seterror(err)
    }
  }, [])

  return { notification, error }
}

export default useGetNotification;
