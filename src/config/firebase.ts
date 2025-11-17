// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCGWR-NfYPRl-i_qkfqgJEQTaqoYDb6itQ",
    authDomain: "fincontrol-6da6f.firebaseapp.com",
    projectId: "fincontrol-6da6f",
    storageBucket: "fincontrol-6da6f.firebasestorage.app",
    messagingSenderId: "771478010707",
    appId: "1:771478010707:web:0fa68919898c8006d4bfa6",
    measurementId: "G-47YC03LZ78"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Usa a versão web (funciona no Expo managed)
export const auth = getAuth(app);
export const db = getFirestore(app);