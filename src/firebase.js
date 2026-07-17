import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration (Get this from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBWr8FaehbTGLHGsCdMlF1G9gVIuqRASvc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "discite-1cd96.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "discite-1cd96",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "discite-1cd96.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "307267630116",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:307267630116:web:dbcdbd451b1f2296f194b1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);