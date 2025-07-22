
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJFLFAox-_QQmD6VIP_HhYGj3KMv6Cwtk",
  authDomain: "west-walk-163cb.firebaseapp.com",
  projectId: "west-walk-163cb",
  storageBucket: "west-walk-163cb.firebasestorage.app",
  messagingSenderId: "561032764465",
  appId: "1:561032764465:web:44686e680128a3296bc910",
  measurementId: "G-04RDQKF8V2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { fireDB, auth,storage };
