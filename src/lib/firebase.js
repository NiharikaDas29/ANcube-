// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDebkbUoY7sfRpAnS5YSnIEi0F5zXhFh6s",
    authDomain: "ancube-14095.firebaseapp.com",
    projectId: "ancube-14095",
    storageBucket: "ancube-14095.firebasestorage.app",
    messagingSenderId: "383120616813",
    appId: "1:383120616813:web:95179b5d9d5d54822fbe64",
    measurementId: "G-6VRKB8ST1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };