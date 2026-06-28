
import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
collection,
addDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const messages=document.getElementById("messages");
const input=document.getElementById("msgInput");
const sendBtn=document.getElementById("send");
const logoutBtn=document.getElementById("logout");

let currentUser;

/* AUTH */

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location="index.html";
return;
}

currentUser=user;

loadMessages();

});

/* LOGOUT */

logoutBtn.onclick=async()=>{

await signOut(auth);
window.location="index.html";

};

/* SEND MESSAGE */

sendBtn.onclick=async()=>{

const text=input.value.trim();
if(!text) return;

await addDoc(collection(db,"chats",currentUser.uid,"messages"),{
sender:"user",
text:text,
time:serverTimestamp(),
unsentByUser:false,
unsentByAdmin:false
});

input.value="";

};

/* LOAD MESSAGES */

function loadMessages(){

const q=query(
collection(db,"chats",currentUser.uid,"messages"),
orderBy("time","asc")
);

onSnapshot(q,(snap)=>{

messages.innerHTML="";

snap.forEach(docSnap=>{

const d=docSnap.data();

const div=document.createElement("div");

div.classList.add("msg");

if(d.sender==="user"){
div.classList.add("me");
}else{
div.classList.add("other");
}

if(d.unsentByUser){
div.innerHTML="<i>Message unsent</i>";
}else{
div.textContent=String(d.text||"");
}

messages.appendChild(div);

});

/* scroll like WhatsApp */
messages.scrollTop=messages.scrollHeight;

});

}
