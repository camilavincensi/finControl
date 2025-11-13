// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGWR-NfYPRl-i_qkfqgJEQTaqoYDb6itQ",
    authDomain: "fincontrol-6da6f.firebaseapp.com",
    projectId: "fincontrol-6da6f",
    storageBucket: "fincontrol-6da6f.firebasestorage.app",
    messagingSenderId: "771478010707",
    appId: "1:771478010707:web:0fa68919898c8006d4bfa6",
    measurementId: "G-47YC03LZ78"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);