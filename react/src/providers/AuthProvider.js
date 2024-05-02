import React, { useState, useEffect } from "react";
// import firebase from "firebase";
import firebase from '../firebaseConfig'

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return (
      ''
      //     < div
      //       style = {{
      //     display: "flex",
      //       flexDirection: "row",
      //         justifyContent: "center",
      //       }
      // }
      //     >
      //   <div
      //     style={{
      //       display: "flex",
      //       flexDirection: "column",
      //       justifyContent: "center",
      //       height: "100vh",
      //     }}
      //   >
      //     <CircularProgress
      //       style={{
      //         outline: "none",
      //         border: "none",
      //       }}
      //     />
      //   </div>
      //     </ >
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
