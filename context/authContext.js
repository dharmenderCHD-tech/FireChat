import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext("");

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      // console.log("got user: ", user);
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
      });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in after registration");
      return { success: true };
    } catch (e) {
      console.error("Register Error:", e); // More detailed error logging
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/invalid-credential)"))
        msg = "Invalid credentials";
      return { success: false, msg: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!response?.user) {
        throw new Error("User creation failed. response.user is undefined.");
      }
      console.log("response.user: ", response?.user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
      });
      console.log("Doc created");
      return { success: true, data: response?.user };
    } catch (e) {
      console.error("Register Error:", e); // More detailed error logging
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      return { success: false, msg: msg };
    }
  };

  // https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bardeen.ai%2Fanswers%2Fhow-to-create-job-alerts-on-linkedin&psig=AOvVaw169qZnZGjp8GewG4PHJxDO&ust=1739438022412000&source=images&cd=vfe&opi=89978449&ved=0CBgQ3YkBahcKEwiIvsze5b2LAxUAAAAAHQAAAAAQBA

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};
