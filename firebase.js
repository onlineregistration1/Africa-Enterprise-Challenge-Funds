// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh2fHMUbysckAxdIA8dcz8sHWrcLbW1EQ",
  authDomain: "african-enterprise-challenge-f.firebaseapp.com",
  projectId: "african-enterprise-challenge-f",
  storageBucket: "african-enterprise-challenge-f.firebasestorage.app",
  messagingSenderId: "85146331644",
  appId: "1:85146331644:web:b28599e0c8b75498fe6a79",
  measurementId: "G-6C670QY54S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
