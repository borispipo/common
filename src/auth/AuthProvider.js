// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import React from "$react";
import { signIn as signInUser,signOut } from "./remote";
import { isLoggedIn,isSignedIn,signOut2Redirect,getLoggedUser } from "./instance";


const AuthContext = React.createContext(null);

const Auth = {
  isLoggedIn,
  isSignedIn,
  signIn : signInUser,
  login : signInUser,
  signOut,
  logout: signOut,
  signOut2Redirect,
};

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(isLoggedIn()?getLoggedUser():null);
  const signIn = (_user)=>{
    return signInUser(_user).then((u)=>{
      setUser(u);
      return u;
    });
  }
  const logout = (callback) => {
    logout();
    setUser(null);
    if(typeof callback =='function'){
      callback();
    }
  };
  return <AuthContext.Provider value={{...Auth,user,signIn, logout,signOut : logout }}>
      {children}
  </AuthContext.Provider>;
}

export function useAuth() {
    return React.useContext(AuthContext);
}