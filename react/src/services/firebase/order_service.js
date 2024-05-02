import Firebase from "../../firebaseConfig"
import firebase from "firebase/app"
import 'firebase/auth'
import "firebase/firestore"
import 'firebase/database'

const rtdb = Firebase.database()
const rootRef = rtdb.ref('users')

export const firebase_order_service = {
  createOrder,
  getOrder,
  getAllSupplierOrders,
  getAllCustomerOrders,
  addSupplierItemsToOrder,
  returnSupplierItemsToOrder,
  cancelOrder,
  generateInvoice,
  confirmSupplierOrder,
  fulfillSupplierOrder,
  reconfirmSupplierOrder,
  getMaxUpdatedAt,
  addDocket
}

function getMaxUpdatedAt(collection = []) {
  return collection.length ? collection.map((item) => item.updatedAt).reduce((a, b) => a > b ? a : b) : 0
}

function generateInvoice(order, orderID) {
  // set bool to true
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        invoiceGenerated: true,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })

      const { supplierID, customerID } = order;
      // the user who will get the notification. If supplier cancelling we make a notification for customer.
      const userID = customerID
      // saving notifications to rtdb
      rootRef.child(userID).child('notifications').push({
        orderID,
        status: 'invoice-generated',
        dueDate: order.dueDate,
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        supplierID,
        customerID,
        notificationStatus: 'new',
        type: "order"
      }).then((res) => resolve(true))
        .catch((err) => console.log('error occured', err))
    } catch (error) {
      reject(error)
    }
  })
}

function cancelOrder(order, orderID, status, cancelledBy, reason, cancelDate, cancelTime) {
  //cancellationReason
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        status: status,
        cancellationReason: reason,
        cancelledBy,
        cancelDate,
        cancelTime,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })
      resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() })
    } catch (error) {
      console.log({ error });
      reject(error)
    }
  })
}

function createOrder(obj) {
  return new Promise(async (resolve, reject) => {
    let documentRef = Firebase.firestore().collection("order").doc()
    try {
      const object = { ...obj, orderID: documentRef.id, updatedAt: firebase.firestore.Timestamp.now().toMillis() }
      const snapshot = await documentRef.set(object)
      resolve(true)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function confirmSupplierOrder(order, orderID, status, confirmedBy, confirmDate, confirmTime) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)

    try {
      const snapshot = await orderRef.update({
        status: status,
        confirmDate,
        confirmTime,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })

      resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() })
    } catch (error) {
      reject(error)
    }
  })
}

function reconfirmSupplierOrder(order, orderID, status, reconfirmedBy, reconfirmDate, reconfirmTime) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        status: status,
        reconfirmDate,
        reconfirmTime,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })

      resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() })
    } catch (error) {
      reject(error)
    }
  })
}

function fulfillSupplierOrder(order, orderID, status, fulfillDate, fulfillTime) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        status: status,
        fulfillDate,
        fulfillTime,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })
      resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() })
    } catch (error) {
      reject(error)
    }
  })
}

function getOrder(orderID) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const doc = await orderRef.get()
      if (doc.exists) {
        resolve(doc.data())
      }
    } catch (err) {
      reject(err)
    }
  })
}

/***** Other items */
function addSupplierItemsToOrder(orderID, items, order) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        supplierItems: items,
      })
      // notifications
      const { supplierID, customerID } = order;
      const userID = customerID

      if (!!items.length) {
        rootRef.child(userID).child('notifications').push({
          orderID,
          status: 'supplier-items-added',
          supplierItems: items,
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          supplierID,
          customerID,
          notificationStatus: 'new',
          type: "order"
        }).then((res) => resolve(true))
          .catch((err) => {
            reject(err)
            console.log('error occured', err)
          })
      }
    } catch (error) {
      reject(error)
    }
  })
}


/*********            SUPPLIER ORDERS                *********/

function getAllSupplierOrders(supplierID, maxUpdatedAt) {
  return new Promise(async (resolve, reject) => {
    if (supplierID) {
      const orders = []
      const orderRef = Firebase
        .firestore()
        .collection("order")
        .where("supplierID", "==", supplierID)
        .where("updatedAt", ">", maxUpdatedAt)
      try {
        const ordersnapshot = await orderRef.get()
        const data = ordersnapshot.docs.map(doc => doc.data())
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
  })
}


/*********           CUSTOMER ORDERS                *********/
function getAllCustomerOrders(customerID, maxUpdatedAt) {
  return new Promise(async (resolve, reject) => {
    if (customerID) {
      const orders = []
      const orderRef = Firebase
        .firestore()
        .collection("order")
        .where("customerID", "==", customerID)
        .where("updatedAt", ">", maxUpdatedAt)
      try {
        const ordersnapshot = await orderRef.get()
        const data = ordersnapshot.docs.map(doc => doc.data())
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
  })
}


function returnSupplierItemsToOrder(orderID) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.get()
      if (snapshot.exists) {
        resolve(snapshot.data().supplierItems)
      }
    } catch (err) {
      reject(err)
    }
  })
}

function addDocket(orderID, docket) {
  return new Promise(async (resolve, reject) => {
    const orderRef = Firebase.firestore().collection("order").doc(orderID)
    try {
      const snapshot = await orderRef.update({
        docket,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}