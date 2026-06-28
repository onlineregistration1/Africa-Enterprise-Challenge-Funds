import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

// --- AUTHENTICATION LOGIC ---
document.getElementById('auth-button').addEventListener('click', async () => {
    const phone = document.getElementById('phone-input').value;
    const pass = document.getElementById('password-input').value;
    const email = phone + "@chat.com"; // Creating a mock email for Firebase Auth

    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            await createUserWithEmailAndPassword(auth, email, pass);
        } else {
            alert("Login failed: " + error.message);
        }
    }
});

// --- REAL-TIME CHAT LOGIC ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('chat-room-view').style.display = 'block';
        
        // Listen to messages for this specific user
        const q = query(collection(db, "chats", user.uid, "messages"), orderBy("timestamp", "asc"));
        onSnapshot(q, (snapshot) => {
            const container = document.getElementById('messages-container');
            container.innerHTML = '';
            snapshot.forEach((doc) => {
                const data = doc.data();
                const div = document.createElement('div');
                div.className = `message ${data.sender === user.uid ? 'sent' : 'received'}`;
                div.innerText = data.text;
                container.appendChild(div);
            });
        });
    }
});

// --- SEND MESSAGE ---
document.getElementById('send-btn').addEventListener('click', async () => {
    const text = document.getElementById('message-text').value;
    const user = auth.currentUser;
    if (text && user) {
        await addDoc(collection(db, "chats", user.uid, "messages"), {
            text: text,
            sender: user.uid,
            timestamp: serverTimestamp()
        });
        document.getElementById('message-text').value = '';
    }
});

// --- LOGOUT ---
document.getElementById('logout-btn').addEventListener('click', () => signOut(auth));
