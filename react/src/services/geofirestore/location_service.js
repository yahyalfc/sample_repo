//import firebase from '../../firebaseConfig';
import firebase from 'firebase'
import * as geofirestore from "geofirestore"

const GeoFirestore = geofirestore.initializeApp(firebase.firestore())
export const firebase_location_service = {
  signUpSupplierLocation, getSupplierLocation, getSuppliersInProximity, getMoreThanTenSuppliersInProximity, deleteSupplierLocation, updateSupplierLocation, AddNewSupplierLocation
}

function signUpSupplierLocation(id, coordinates) {
  return new Promise((resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation");
      geocollection
        .add({
          id,
          coordinates: new firebase.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng
          ),
        })
        .then((data) => {
          resolve(true)
        })
        .catch((err) => {
          console.log("Call failed to geo firestore", err);
        });
    } catch (err) {
      reject(err)
    }
  })
}
function AddNewSupplierLocation(userID, coordinates, locationName) {
  return new Promise((resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation").doc()

      geocollection
        .set({
          id: geocollection.id,
          userID,
          coordinates: new firebase.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng
          ),
          locationName,
        })
        .then((doc) => {
          resolve({
            id: geocollection.id,
            userID,
            coordinates,
            locationName
          })
        })
        .catch((err) => {
          console.log("Call failed to geo firestore", err);
        });
    } catch (err) {
      reject(err)
    }
  })
}
function updateSupplierLocation(id, coordinates, userID) {
  return new Promise((resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation").doc(id)
      geocollection
        .update({
          coordinates: new firebase.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng
          ),
        })
        .then((data) => {
          resolve({
            id,
            userID,
            coordinates,
          })
        })
        .catch((err) => {
          console.log("Call failed to geo firestore", err);
        });
    } catch (err) {
      reject(err)
    }
  })
}

function deleteSupplierLocation(id) {
  return new Promise((resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation").doc(id)
      geocollection
        .delete()
        .then((data) => {
          resolve(true)
        })
        .catch((err) => {
          reject(err)
        });
    } catch (err) {
      reject(err)
    }
  })
}

function getSuppliersInProximity(suppliers, coordinates) {
  return new Promise(async (resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation")
      //const query: GeoQuery = geocollection.near({ center: new firebase.firestore.GeoPoint(40.7589, -73.9851), radius: 1000 });
      const query = geocollection
        .near({
          center: new firebase.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng
          ),
          radius: 20,
        })
        .where("userID", "in", suppliers)

      const snapshot = await query.get()
      const suppliersInProximity = snapshot.docs.map((doc) => doc.data())
      resolve(suppliersInProximity)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function getMoreThanTenSuppliersInProximity(suppliers, coordinates) {
  return new Promise(async (resolve, reject) => {
    try {
      const geocollection = GeoFirestore.collection("SupplierGeoLocation")
      const query = geocollection
        .near({
          center: new firebase.firestore.GeoPoint(
            coordinates.lat,
            coordinates.lng
          ),
          radius: 20,
        })
      const snapshot = await query.get()
      const allSuppliersInRadius = snapshot.docs.map((doc) => doc.data())
      const suppliersInProximity = allSuppliersInRadius.filter((sp) => suppliers.find((s) => s.supplierID == sp.id))
      resolve(suppliersInProximity)
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

function getSupplierLocation(id) {
  return new Promise(async (resolve, reject) => {
    const location = []
    try {
      const docRef = firebase.firestore().collection("SupplierGeoLocation").where('userID', '==', id)
      const documents = await docRef.get()
      documents.forEach((doc) => {
        if (doc.exists) {
          location.push({
            id: doc.id,
            userID: id,
            coordinates: {
              lat: doc.data().coordinates.latitude,
              lng: doc.data().coordinates.longitude
            },
            locationName: doc.data().locationName
          })
        }
      })
      resolve(location)
    }
    catch (err) {
      reject(err)
    }
  })
}