import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: "taskbuddy-3474b.firebaseapp.com",
  projectId: "taskbuddy-3474b",
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-J42QE902VT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
