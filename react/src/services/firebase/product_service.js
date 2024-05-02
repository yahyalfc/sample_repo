import Firebase from "../../firebaseConfig"
import firebase from "firebase/app"
import 'firebase/auth'
import "firebase/firestore"

export const firebase_product_service = {
  fetchCollection,
  newServices,
  getAllProducts,
  getExtraItems,
  extraItems,
  updateExtraItems,
  addExtraItems
}

const getFirestoreRef = (path) => Firebase.firestore().collection(path);

function fetchCollection(collection, options = {}, quantity) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = [];
      let baseQuery = getFirestoreRef(collection);

      if (options.queries) {
        const { queries } = options;
        queries.forEach(({ attribute, operator, value }) => {
          baseQuery = baseQuery.where(attribute, operator, value);
        });
      }
      (await baseQuery.get()).forEach((doc) => {
        data.push(doc.data())
      });
      data = data.filter(
        ({ quantities }) =>
          quantities.find(
            ({ minQuantity, maxQuantity }) =>
              Number(minQuantity) <= Number(quantity) &&
              Number(maxQuantity) >= Number(quantity)
          ) !== undefined
      )
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
};

function newServices() {
  return new Promise(async (resolve, reject) => {
    const productsRef = Firebase.firestore().collection("services") //.where('seller_id', '==', seller_id)
    const services = []
    try {
      const productsSnapshot = await productsRef.get()
      productsSnapshot.forEach((doc) => {
        if (doc.exists) {
          services.push(doc.data())
        }
      })
      resolve(services)
    } catch (err) {
      reject(err)
    }
  })
}

// We shall delete it later
function getAllProducts() {
  return new Promise(async (resolve, reject) => {
    const productsRef = Firebase.firestore().collection("products") //.where('seller_id', '==', seller_id)
    const services = []
    try {
      const productsSnapshot = await productsRef.get()
      productsSnapshot.forEach((doc) => {
        if (doc.exists) {
          services.push(doc.data())
        }
      })
      resolve(services)
    } catch (err) {
      reject(err)
    }
  })
}

/******************************      Extra Items Services      ********************************************************/
// Admin can add these 
function extraItems() {
  return new Promise(async (resolve, reject) => {
    const productsRef = Firebase.firestore().collection('supplieritems') //.where('seller_id', '==', seller_id)
    try {
      const snapshot = await productsRef.get()
      const data = snapshot.docs.map(doc => doc.data())
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

// Supplier's Extra items 
function getExtraItems(supplierID) {
  return new Promise(async (resolve, reject) => {
    const productsRef = Firebase.firestore().collection('SupplierExtraFee').where('supplierID', '==', supplierID) //.where('seller_id', '==', seller_id)

    try {
      const snapshot = await productsRef.get()
      const data = snapshot.docs.map(doc => ({ ...doc.data(), itemID: doc.id }))
      resolve(data)
    } catch (err) {
      reject(err)
    }
  })
}

// First Time supplier adding Extra items 
function addExtraItems(extraItems, supplierID) {
  return new Promise(async (resolve, reject) => {
    //  const productsRef = firebase.firestore().collection('SupplierExtraFee')
    var batch = Firebase.firestore().batch();
    try {
      extraItems.forEach((item) => {
        let updateditem = { ...item, supplierID, updatedAt: firebase.firestore.Timestamp.now().toMillis() }
        let docRef = Firebase.firestore().collection("SupplierExtraFee").doc()
        batch.set(docRef, updateditem)
      })
      batch.commit()
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

//updating only those items which have been changed
function updateExtraItems(olditems, items) {
  const intersection = items.filter(element => !olditems.includes(element));

  return new Promise(async (resolve, reject) => {
    var batch = Firebase.firestore().batch();
    try {
      intersection.forEach((item) => {
        let updateditem = { ...item, updatedAt: firebase.firestore.Timestamp.now().toMillis() }
        let docRef = Firebase.firestore().collection("SupplierExtraFee").doc(item.itemID)
        batch.update(docRef, updateditem)
      })
      batch.commit()
      resolve(true)
    } catch (err) {
      reject(err)
    }
  })
}

