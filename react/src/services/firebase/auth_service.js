import Firebase from "../../firebaseConfig"
import firebase from "firebase"

export const firebase_auth_service = {
  loginWithEmail,
  signupWithEmail,
  loginWithGoogle,
  loginWithFacebook,
}

function loginWithEmail(email, password) {
  return new Promise((resolve, reject) => {
    Firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        Firebase
          .firestore()
          .collection("users")
          .doc(result.user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              resolve({ status: true, user: doc.data() })
            }
          })
        // save into localstorage or context
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function signupWithEmail(email, password, fullName) {

  return new Promise((resolve, reject) => {
    const url = `${window.location.protocol}//${window.location.host}/onboarding`
    const actionCodeSettings = {
      url,
      handleCodeInApp: false,
    }

    Firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user
          .sendEmailVerification(actionCodeSettings)
          .then((res) => {
            Firebase
              .auth()
              .currentUser.updateProfile({
                displayName: fullName,
              })
              .then((rex) => {
                let updateData = Firebase
                  .firestore()
                  .collection("users")
                  .doc(result.user.uid)

                updateData.set({
                  id: result.user.uid,
                  name: fullName,
                  email: result.user.email,
                  role: "undefined",
                  status: "unApproved",
                  createdAt: firebase.firestore.Timestamp.now().toMillis()
                }).then((rexx) => {
                  Firebase
                    .firestore()
                    .collection("users")
                    .doc(result.user.uid)
                    .get()
                    .then((doc) => {
                      if (doc.exists) {
                        const user = doc.data()
                        resolve({ status: true, user: { id: user.id, name: fullName, email, role: 'undefined', status: 'unApproved', createdAt: user.createdAt } })
                      }
                    }).catch((err) => {
                      console.log('error in service 1', err);
                    })
                })
              }).catch((err) => {
                console.log('error in service 2', err);
                //reject(err)
              })
          })
          .catch((err) => {
            console.log('error in service 3', err);
            reject(err)

          })
      })
      .catch((err) => {
        console.log('error in service 4', err);
        reject(err)
      })
  })
}

function loginWithGoogle() {
  // we return a promise whenever this is called
  return new Promise((resolve, reject) => {
    let provider = new firebase.auth.GoogleAuthProvider()

    Firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken
        const user = result.user
        //  After successful sign in Here we are getting users info
        let userdata = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          token: token,
          id: user.uid,
          createdAt: firebase.firestore.Timestamp.now().toMillis(),
          role: user.role ? user.role : "undefined",
        }
        //Here we make an object to save all this info we're getting from googleAPI into our users table
        // this is how we make a call to our Firebase users table and save value if it doesnt exist
        //If value exists then we return an object in the promise with data
        let docRef = Firebase
          .firestore()
          .collection("users")
          .doc(userdata.id)

        docRef.get().then((doc) => {
          if (doc.exists) {
            resolve({ exists: true, user: doc.data() })
          } else {
            Firebase
              .firestore()
              .collection("users")
              .doc(userdata.id)
              .set(userdata)
              .then(() => {
                resolve({ exists: false, user: doc.data(), data: result.user })
              })
          }
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function loginWithFacebook() {
  return new Promise((resolve, reject) => {
    let provider = new firebase.auth.FacebookAuthProvider()

    Firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken
        let user = result.user
        let userdata = {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
          role: user.role ? user.role : "undefined",
          createdAt: firebase.firestore.Timestamp.now().toMillis()
        }
        //Here we make an object to save all this info we're getting from googleAPI into our users table
        // this is how we make a call to our Firebase users table and save value if it doesnt exist
        //If value exists then we return an object in the promise with dat
        let docRef = Firebase
          .firestore()
          .collection("users")
          .doc(userdata.id)

        docRef.get().then((doc) => {
          if (doc.exists) {
            //set to local storage or context
            resolve({ data: doc.data(), status: "exists" }) //old user
          } else {
            Firebase
              .firestore()
              .collection("users")
              .doc(userdata.id)
              .set(userdata)
              .then(() => {
                //set to localstorage or context
                // localStorage.setItem("user", JSON.stringify(doc.data()))
                resolve({ data: doc.data(), status: "nonexistent" }) // a new user
              })
          }
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
