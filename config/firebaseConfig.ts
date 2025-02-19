import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB9OQA-_oBMoNxqVNs_sius5hDmnXXoTNY",
    authDomain: "automatic-watering-syste-3ccef.firebaseapp.com",
    databaseURL: "https://automatic-watering-syste-3ccef-default-rtdb.firebaseio.com",
    projectId: "automatic-watering-syste-3ccef",
    storageBucket: "automatic-watering-syste-3ccef.firebasestorage.app",
    messagingSenderId: "77413833867",
    appId: "1:77413833867:web:3d3d8b891488552202c88e",
    measurementId: "G-47V6YQDHEV"
  };
  
// Ensure Firebase is initialized only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const db = getFirestore(app);
const db = getDatabase(app);

export { db };