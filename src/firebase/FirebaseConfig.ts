
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6dRC22bmr79LQBZ-ipoXhLJcyvpULizk",
  authDomain: "hala-b-saudi.firebaseapp.com",
  projectId: "hala-b-saudi",
  storageBucket: "hala-b-saudi.firebasestorage.app",
  messagingSenderId: "939551727593",
  appId: "1:939551727593:web:20cb4b5b1f39be1fa83578",
  measurementId: "G-3B770ZRGMK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { fireDB, auth,storage };
