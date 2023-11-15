import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGGgDoiEcXLe5e4rC6LnV9fRqNVLGDehw",
  authDomain: "chat-app-a2c07.firebaseapp.com",
  projectId: "chat-app-a2c07",
  storageBucket: "chat-app-a2c07.appspot.com",
  messagingSenderId: "373727594750",
  appId: "1:373727594750:web:e8ae9b5025979152197daf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
