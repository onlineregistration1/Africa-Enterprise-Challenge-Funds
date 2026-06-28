import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
doc,
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const messagesBox=document.getElementById("messages");
const input=document.getElementById("messageInput");
const sendBtn=document.getElementById("sendBtn");
const logoutBtn=document.getElementById("logoutBtn");

let currentUser=null;

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location="index.html";
return;
}

currentUser=user;

loadMessages();

});

/* =========================
   LOGOUT
========================= */

logoutBtn.addEventListener("click",async()=>{

await signOut(auth);
window.location="index.html";

});

/* =========================
   SEND MESSAGE
========================= */

sendBtn.addEventListener("click",async()=>{

const text=input.value.trim();
if(!text) return;

await addDoc(collection(db,"chats",currentUser.uid,"messages"),{
sender:"user",
text:text,
unsent:false,
time:serverTimestamp()
});

input.value="";

});

/* =========================
   LOAD MESSAGES (REALTIME)
========================= */

function loadMessages(){

const q=query(
collection(db,"chats",currentUser.uid,"messages"),
orderBy("time","asc")
);

onSnapshot(q,(snapshot)=>{

messagesBox.innerHTML="";

snapshot.forEach((docSnap)=>{

const data=docSnap.data();

const div=document.createElement("div");
div.classList.add("msg");

if(data.sender==="user"){
div.classList.add("me");
}else{
div.classList.add("other");
}

if(data.unsent){
div.innerHTML="<i>Message unsent</i>";
}else{
div.textContent=data.text;
}

messagesBox.appendChild(div);

});

/* auto scroll like WhatsApp */
messagesBox.scrollTop=messagesBox.scrollHeight;

});

}
