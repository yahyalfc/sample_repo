import Firebase from '../../firebaseConfig'
import 'firebase/database'
const rtdb = Firebase.database();
const rootRef = rtdb.ref('users')

export const firebase_notification_service = {
  getNotification,
  getAllNotifications,
  getNewNotifications,
  getNotificationById,
  notificationRead
}

function getNotification(userID) {
  return new Promise(async (resolve, reject) => {
    try {
      rootRef.child(userID).child('notifications').on('child_added', (snapshot) => {
        console.log('a new notification')
        const data = { id: snapshot.key, ...snapshot.val() };
        resolve({ status: true, data })
      })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function notificationRead(userID, notificationID) {
  return new Promise(async (resolve, reject) => {
    try {
      rootRef.child(userID).child('notifications').child(notificationID).update({
        notificationStatus: 'read'
      });
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function getNewNotifications(userID) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = []
      rootRef.child(userID).child('notifications').orderByChild('notificationStatus').equalTo('new').on('value', (snapshot) => {
        console.log('getting all new notifications');
        snapshot.forEach((snappy) => {
          data.push({ ...snappy.val(), id: snappy.key })
        })
        resolve({ status: true, data })
      })
    } catch (err) {
      console.log(err);
      reject(err)
    }
  })
}

function getNotificationById(userID, notificationID) {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getting notification by id');
      rootRef.child(userID).child('notifications').child(notificationID).once('value', (snapshot) => {
        const data = { id: snapshot.key, ...snapshot.val() };
        resolve({ status: true, data });
      });
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function getAllNotifications(userID) {
  console.log({ userID });
  return new Promise(async (resolve, reject) => {
    let data = []

    try {
      rootRef.child(userID).child('notifications').on('value', (snapshot) => {
        console.log('getting all notifications');
        snapshot.forEach((snappy) => {
          data.push({ ...snappy.val(), id: snappy.key })
        })
        resolve({ status: true, data })
      })
    } catch (err) {
      console.log(err);
      reject(err)
    }
  })
}
