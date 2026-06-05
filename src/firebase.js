import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8Pl0oln082F9uSe4SbeePG8pTpy8NCCU",
  authDomain: "impackt-website.firebaseapp.com",
  projectId: "impackt-website",
  storageBucket: "impackt-website.firebasestorage.app",
  messagingSenderId: "130618139129",
  appId: "1:130618139129:web:773a3f65277fffd1dfdd28",
  measurementId: "G-CY94BEBNPD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);