// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqAvchR8d5OeSQ_gtYq4zASE3KLXkJXlI",
  authDomain: "firechat-6046c.firebaseapp.com",
  projectId: "firechat-6046c",
  storageBucket: "firechat-6046c.firebasestorage.app",
  messagingSenderId: "421487515506",
  appId: "1:421487515506:web:1c254345d1217d07f82feb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomsRef = collection(db, "rooms");
