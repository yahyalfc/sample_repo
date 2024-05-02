import Firebase from "../../firebaseConfig";
import firebase from "firebase/app"
import 'firebase/auth'
import "firebase/firestore"
import 'firebase/database'

const rtdb = Firebase.database()
const rootRef = rtdb.ref('users')

export const firebase_invoice_service = {
  createInvoice,
  updateInvoiceStatus,
  getAllCustomerInvoices,
  getAllSupplierInvoices
};

function getAllCustomerInvoices(customerID, maxUpdatedAt) {
  return new Promise(async (resolve, reject) => {
    if (customerID) {
      const orderRef = Firebase
        .firestore()
        .collection("invoice")
        .where("customerID", "==", customerID)
        .where("updatedAt", ">", maxUpdatedAt)
      try {
        const ordersnapshot = await orderRef.get()
        const data = ordersnapshot.docs.map(doc => ({ invoiceID: doc.id, ...doc.data() }))
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
  })
}

function getAllSupplierInvoices(supplierID, maxUpdatedAt) {
  return new Promise(async (resolve, reject) => {
    if (supplierID) {
      const orderRef = Firebase
        .firestore()
        .collection("invoice")
        .where("supplierID", "==", supplierID)
        .where("updatedAt", ">", maxUpdatedAt)
      try {
        const ordersnapshot = await orderRef.get()
        const data = ordersnapshot.docs.map(doc => ({ invoiceID: doc.id, ...doc.data() }))
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
  })
}

function createInvoice(obj) {
  return new Promise(async (resolve, reject) => {
    let documentRef = Firebase
      .firestore()
      .collection("invoice")
      .doc(obj.orderID);

    try {
      const snapshot = await documentRef.set({ ...obj, updatedAt: firebase.firestore.Timestamp.now().toMillis() });
      //snapshot doesnt return anything so we resolve it with true

      /*
      const { supplierID, customerID, status } = obj;
      // the user who will get the notification. If supplier cancelling we make a notification for customer.
      const userID = customerID
      // saving notifications to rtdb
      
      rootRef.child(userID).child('notifications').push({
        orderID: obj.orderID,
        status,
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        supplierID,
        customerID,
        notificationStatus: 'new',
        type: "invoice"
      }).then((res) => resolve(true))
        .catch((err) => console.log('error occured', err))

      */

      resolve(true)
    } catch (err) {
      console.log(err.message);
      reject(err);
    }
  });
}

function updateInvoiceStatus(invoice, paymentBy, status, orderID, paymentStatus) {
  console.log(invoice, '|', paymentBy,);
  return new Promise(async (resolve, reject) => {
    const invoiceRef = Firebase.firestore().collection("invoice").doc(orderID)

    try {
      const snapshot = await invoiceRef.update({
        paymentStatus,
        updatedAt: firebase.firestore.Timestamp.now().toMillis()
      })

      /*
      const { supplierID, customerID } = invoice;
      // the user who will get the notification. If supplier cancelling we make a notification for customer.
      const userID = paymentBy == 'Supplier' ? customerID : supplierID
      // saving notifications to rtdb
      rootRef.child(userID).child('notifications').push({
        orderID,
        status,
        createdAt: firebase.firestore.Timestamp.now().toMillis(),
        supplierID,
        customerID,
        notificationStatus: 'new',
        type: "invoice"
      }).then((res) => resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() }))
        .catch((err) => console.log('error occured', err))
        */
      resolve({ status: true, updatedAt: firebase.firestore.Timestamp.now().toMillis() })
    } catch (error) {
      reject(error)
    }
  })
}
