// import firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"
import firebase from "../../firebaseConfig"

export const firebase_user_services = {
  getLoginUser,
  updateUserData,
  updateSupplierPaymentData,
  updateSupplierData
}

function getLoginUser(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = firebase.firestore().collection("users").doc(id)
      const doc = await docRef.get()
      if (doc.exists) {
        resolve(doc.data())
      } else {
        console.log("Error document dont exist")
      }
    } catch (err) {
      console.log(err)
    }
  })
}

function updateUserData(id, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = firebase.firestore().collection("users").doc(id)
      const doc = await docRef.set(data)
      resolve({ status: true, user: data })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function updateSupplierData(data, id) {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = firebase.firestore().collection("users").doc(id)
      const doc = await docRef.update({ ...data })
      resolve({ status: true, values: data })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function updateSupplierPaymentData(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = firebase.firestore().collection("users").doc(data.id)
      const doc = await docRef.update({ ...data })
      resolve(true)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}
