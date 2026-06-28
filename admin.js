import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
collection,
query,
onSnapshot,
addDoc,
orderBy,
serverTimestamp,
setDoc,
doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const ADMIN_USER="Kibet Davis";
const ADMIN_PASS="Kwenik254$";

const usersDiv=document.getElementById("users");
const loginBox=document.getElementById("loginAdmin");
const panel=document.getElementById("panel");

const adminMessages=document.getElementById("adminMessages");
const adminMsg=document.getElementById("adminMsg");

let currentChat=null;

/* LOGIN */

document.getElementById("adminLoginBtn").onclick=async()=>{

const u=document.getElementById("adminUser").value;
const p=document.getElementById("adminPass").value;

if(u!==ADMIN_USER || p!==ADMIN_PASS){
alert("Wrong admin login");
return;
}

loginBox.style.display="none";
panel.style.display="block";

loadUsers();

};

/* LOAD USERS */

function loadUsers(){

const q=query(collection(db,"users"));

onSnapshot(q,(snap)=>{

usersDiv.innerHTML="";

snap.forEach(u=>{

const div=document.createElement("div");

div.className="user";

div.innerHTML=u.data().phone;

div.onclick=()=>openChat(u.id,u.data().phone);

usersDiv.appendChild(div);

});

});

}

/* OPEN CHAT */

function openChat(uid,phone){

currentChat=uid;

const q=query(
collection(db,"chats",uid,"messages"),
orderBy("time","asc")
);

onSnapshot(q,(snap)=>{

adminMessages.innerHTML="";

snap.forEach(d=>{

const data=d.data();

const div=document.createElement("div");

div.classList.add("msg");

div.classList.add(data.sender==="user"?"me":"other");

div.textContent=String(data.text||"");

adminMessages.appendChild(div);

});

adminMessages.scrollTop=adminMessages.scrollHeight;

});

}

/* SEND ADMIN MESSAGE */

document.getElementById("adminSend").onclick=async()=>{

if(!currentChat) return;

const text=adminMsg.value.trim();
if(!text) return;

await addDoc(collection(db,"chats",currentChat,"messages"),{
sender:"admin",
text:text,
time:serverTimestamp()
});

adminMsg.value="";

};
