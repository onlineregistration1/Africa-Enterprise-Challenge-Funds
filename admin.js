import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword,
signOut,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
collection,
doc,
getDoc,
setDoc,
deleteDoc,
query,
orderBy,
onSnapshot,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* =========================
   ADMIN LOGIN DETAILS
========================= */

const ADMIN_EMAIL="admin@aecf.local";
const ADMIN_PASS="Kwenik254$";

/* =========================
   ELEMENTS
========================= */

const usersList=document.getElementById("usersList");
const chatBox=document.getElementById("chatBox");
const adminMessages=document.getElementById("adminMessages");
const adminInput=document.getElementById("adminInput");
const adminSend=document.getElementById("adminSend");
const chatTitle=document.getElementById("chatTitle");

const backBtn=document.getElementById("backBtn");
const logoutBtn=document.getElementById("adminLogout");

let currentChatUser=null;

/* =========================
   AUTO ADMIN LOGIN
========================= */

async function adminLogin(){

try{

await signInWithEmailAndPassword(auth,ADMIN_EMAIL,ADMIN_PASS);

loadUsers();

}catch(e){

console.log("Admin login failed",e);

}

}

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth,(user)=>{

if(!user){

adminLogin();

return;

}

loadUsers();

});

/* =========================
   LOAD USERS
========================= */

function loadUsers(){

const q=query(collection(db,"users"));

onSnapshot(q,(snapshot)=>{

usersList.innerHTML="";

snapshot.forEach((docSnap)=>{

const data=docSnap.data();

const div=document.createElement("div");

div.classList.add("user");

div.innerHTML=`<span>${data.phone}</span>`;

div.onclick=()=>openChat(docSnap.id,data.phone);

usersList.appendChild(div);

});

});

}

/* =========================
   OPEN CHAT
========================= */

function openChat(uid,phone){

currentChatUser=uid;

chatTitle.innerText=phone;

chatBox.style.display="flex";

usersList.style.display="none";

loadChat(uid);

}

/* =========================
   BACK BUTTON
========================= */

backBtn.onclick=()=>{

chatBox.style.display="none";

usersList.style.display="block";

adminMessages.innerHTML="";

};

/* =========================
   LOAD MESSAGES
========================= */

function loadChat(uid){

const q=query(
collection(db,"chats",uid,"messages"),
orderBy("time","asc")
);

onSnapshot(q,(snapshot)=>{

adminMessages.innerHTML="";

snapshot.forEach((docSnap)=>{

const data=docSnap.data();

const div=document.createElement("div");

div.classList.add("msg");

if(data.sender==="user"){
div.classList.add("me");
}else{
div.classList.add("other");
}

if(data.unsentByUser){

div.innerHTML="<i>Message unsent by user</i>";

}else if(data.unsentByAdmin){

return;

}else{

div.textContent=data.text;

}

/* long press delete for admin */

div.oncontextmenu=async(e)=>{

e.preventDefault();

if(confirm("Delete this message for everyone?")){

await setDoc(doc(db,"chats",uid,"messages",docSnap.id),{
unsentByAdmin:true
},{merge:true});

}

};

adminMessages.appendChild(div);

});

adminMessages.scrollTop=adminMessages.scrollHeight;

});

}

/* =========================
   SEND ADMIN MESSAGE
========================= */

adminSend.onclick=async()=>{

const text=adminInput.value.trim();

if(!text||!currentChatUser) return;

await addDoc(collection(db,"chats",currentChatUser,"messages"),{

sender:"admin",
text:text,
unsentByAdmin:false,
time:serverTimestamp()

});

adminInput.value="";

};

/* =========================
   LOGOUT
========================= */

logoutBtn.onclick=async()=>{

await signOut(auth);

location.reload();

};
