// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import dotenv from 'dotenv';
dotenv.config();


const firebaseConfig = {
  apiKey: process.env.API_FIREBASE as string,
  authDomain: "chat-de28e.firebaseapp.com",
  projectId: "chat-de28e",
  storageBucket: "chat-de28e.appspot.com",
  messagingSenderId: "717731032964",
  appId: "1:717731032964:web:dde62019c0af4f489c37d1",
  measurementId: "G-K1GDR8DN96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };