import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1MbQTKR2YTG2Lao_Fkl7Mu0OvvQW6dvE",
  authDomain: "aitrendcart.firebaseapp.com",
  projectId: "aitrendcart",
  storageBucket: "aitrendcart.firebasestorage.app",
  messagingSenderId: "668737210986",
  appId: "1:668737210986:web:f70cde1ffa34d994cf9813",
  measurementId: "G-R9V6ERTZCQ"
};
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

