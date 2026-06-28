import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh2fHMUbysckAxdIA8dcz8sHWrcLbW1EQ",
  authDomain: "african-enterprise-challenge-f.firebaseapp.com",
  projectId: "african-enterprise-challenge-f",
  storageBucket: "african-enterprise-challenge-f.firebasestorage.app",
  messagingSenderId: "85146331644",
  appId: "1:85146331644:web:b28599e0c8b75498fe6a79"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Toggle password visibility
document.getElementById('toggle-pass').addEventListener('click', () => {
    const p = document.getElementById('password-input');
    p.type = p.type === 'password' ? 'text' : 'password';
});

// Admin Check
const isAdmin = (phone) => phone === "Kibet Davis";

// You can now proceed to add your authentication and database listener logic here.
console.log("App Initialized");

