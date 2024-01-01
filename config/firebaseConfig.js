// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTSt07OsUTiggPO4Q1Y5vaOw9FUv4Vq2c",
  authDomain: "safe-driver-e722b.firebaseapp.com",
  projectId: "safe-driver-e722b",
  storageBucket: "safe-driver-e722b.appspot.com",
  messagingSenderId: "1011439276130",
  appId: "1:1011439276130:web:1925544aefaad56af8813b",
  measurementId: "G-FFQDV1KJ8X",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(FirebaseApp);
const auth = getAuth(FirebaseApp);
const db = getFirestore(FirebaseApp);

export default FirebaseApp;
