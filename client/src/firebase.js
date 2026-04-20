// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "special-problem-34788.firebaseapp.com",
  projectId: "special-problem-34788",
  storageBucket: "special-problem-34788.appspot.com",
  messagingSenderId: "369985327247",
  appId: "1:369985327247:web:2a3d1ec6180c828d1e60fa",
};

export const app = initializeApp(firebaseConfig);
