const functions = require("firebase-functions");
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
// by doing this we enable our firebase admin sdk in order to interact with authentication and firestore service
const rootRef = admin.database().ref('users')

// creation of an order
exports.orderCreated = functions.firestore.document('order/{orderID}')
  .onCreate(doc => {
    const order = doc.data();
    const { supplierID, customerID, status } = order;

    return rootRef.child(supplierID).child('notifications').push({
      orderID: doc.id,
      status,
      createdAt: admin.firestore.Timestamp.now().toMillis(),
      supplierID,
      customerID,
      notificationStatus: 'new',
      type: "order"
    }).then((data) => console.log('notification added', data))
  })

//updation of an order
exports.orderConfirmation = functions.firestore.document('order/{orderID}')
  .onUpdate((change, context) => {
    const prevOrder = change.before.data()
    const newOrder = change.after.data()
    // compare the new and old order values
    const { supplierID, customerID, orderID } = newOrder;
    // work
    let status = null
    let userID = null
    //order confirmed by supplier. notification sent to customer
    if (prevOrder.status == 'unapproved' && newOrder.status == 'confirmed') {
      status = 'confirmed'
      userID = customerID
    }
    // order reconfirmed by customer. notification sent to supplier
    if (prevOrder.status == 'confirmed' && newOrder.status == 'reconfirmed') {
      status = 'reconfirmed'
      userID = supplierID
    }

    // fulfilling order
    if (prevOrder.status == 'reconfirmed' && newOrder.status == 'fulfilled') {
      status = 'fulfilled'
      userID = customerID
    }

    // cancelling order
    if (prevOrder.status != 'cancelled' && newOrder.status == 'cancelled') {
      status = 'cancelled'
      if (newOrder.cancelledBy !== "Admin") {
        userID = newOrder.cancelledBy == 'Supplier' ? customerID : supplierID
      }
      else {
        //sending notification to both customer and supplier
        return rootRef.child(customerID).child('notifications').push({
          orderID,
          status,
          createdAt: admin.firestore.Timestamp.now().toMillis(),
          supplierID,
          customerID,
          cancelledBy: "Admin",
          notificationStatus: 'new',
          type: "order"
        }).then(() => {
          rootRef.child(supplierID).child('notifications').push({
            orderID,
            status,
            createdAt: admin.firestore.Timestamp.now().toMillis(),
            supplierID,
            customerID,
            cancelledBy: "Admin",
            notificationStatus: 'new',
            type: "order"
          }).then((doc) => console.log('order cancellation notification sent both to supplier and customer'))
        })
      }
    }

    return rootRef.child(userID).child('notifications').push({
      orderID,
      status,
      createdAt: admin.firestore.Timestamp.now().toMillis(),
      supplierID,
      customerID,
      notificationStatus: 'new',
      type: "order"
    }).then((data) => console.log('notification added', data))

  })
