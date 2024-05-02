import firebase from "../../firebaseConfig"
// const firestore = firebase.firestore();
// const geofirestore = GeoFirestore = new GeoFirestore(firestore);

export const firebase_supplier_product_service = {
  getProductSuppliers,
  getAllSupplierProducts,
  addProduct,
  updateProductUID,
  getOneProduct,
  updateProductCost,
  deleteProduct,
  getSupplier,
}

function getOneProduct(uid) {
  return new Promise(async (resolve, reject) => {
    const productRef = firebase
      .firestore()
      .collection("SupplierProducts")
      .doc(uid)
    try {
      const doc = await productRef.get()
      if (doc.exists) {
        resolve(doc.data())
      }
    } catch (err) {
      reject(err)
    }
  })
}

function getProductSuppliers(productID, quantity) {
  return new Promise(async (resolve, reject) => {
    const suppliersRef = firebase
      .firestore()
      .collection("SupplierProducts")
      .where("productID", "==", productID)
    try {
      const productsSnapshot = await suppliersRef.get()
      let supplierProducts = productsSnapshot.docs.map((doc) => doc.data())
      supplierProducts = supplierProducts.filter(
        ({ quantities }) =>
          quantities.find(
            ({ minQuantity, maxQuantity }) =>
              Number(minQuantity) <= Number(quantity) &&
              Number(maxQuantity) >= Number(quantity)
          ) !== undefined
      )
      // this is finding the supplier products which are in our given quantity.
      resolve(supplierProducts)
    } catch (err) {
      reject(err)
    }
  })
}

function getAllSupplierProducts(supplierID) {
  return new Promise(async (resolve, reject) => {
    const sellerProductRef = firebase
      .firestore()
      .collection("SupplierProducts")
      .where("supplierID", "==", supplierID)
    const supplierProducts = []

    try {
      const productsSnapshot = await sellerProductRef.get()
      productsSnapshot.forEach((doc) => {
        doc.exists
          ? supplierProducts.push(doc.data())
          : reject({ msg: "No such data" })
      })
      resolve(supplierProducts)
    } catch (err) {
      reject(err)
    }
  })
}

function addProduct(product) {
  return new Promise(async (resolve, reject) => {
    const sellerProductsRef = firebase
      .firestore()
      .collection("SupplierProducts")
    let currentdate = new Date()
    var time = currentdate.toUTCString()

    try {
      const res = await sellerProductsRef.add({ ...product, time })
      // res.id gives the id
      const result = await sellerProductsRef.doc(res.id).update({ uid: res.id })
      resolve({ ...product, uid: res.id })
    } catch (err) {
      reject(err)
    }
  })
}

function updateProductUID(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const productRef = firebase
        .firestore()
        .collection("SupplierProducts")
        .doc(id)
      const result = await productRef.update({
        uid: id,
      })
      resolve(true)
    } catch (err) {
      reject(false)
    }
  })
}

function deleteProduct(uid) {
  return new Promise(async (resolve, reject) => {
    const productRef = firebase
      .firestore()
      .collection("SupplierProducts")
      .doc(uid)
    try {
      const result = await productRef.delete()
      resolve(true)
    } catch (err) {
      reject(false)
    }
  })
}

function updateProductCost(uid, updatedInstance) {
  return new Promise(async (resolve, reject) => {
    try {
      const productRef = firebase
        .firestore()
        .collection("SupplierProducts")
        .doc(uid)
      const result = await productRef.update(updatedInstance)
      resolve(updatedInstance)
    } catch (err) {
      reject(err)
    }
  })
}

function getSupplier(supplierID) {
  return new Promise(async (resolve, reject) => {
    const supplierRef = firebase
      .firestore()
      .collection("users")
      .where("id", "==", supplierID)
    try {
      const querySnapshot = await supplierRef.get()
      querySnapshot.forEach((doc) => {
        if (doc.exists) {
          resolve(doc.data())
        }
      })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}
