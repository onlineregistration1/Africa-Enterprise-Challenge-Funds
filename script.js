import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const msg=document.getElementById("msg");

function phoneToEmail(phone){
return phone.trim()+"@aecf.local";
}

/* ================= SIGN UP ================= */

document.getElementById("signupBtn").onclick=async()=>{

const phone=document.getElementById("signupPhone").value.trim();
const pass=document.getElementById("signupPass").value;
const confirm=document.getElementById("signupConfirm").value;

if(!phone||!pass||!confirm){
msg.innerText="Fill all fields";
return;
}

if(pass!==confirm){
msg.innerText="Passwords do not match";
return;
}

try{

const email=phoneToEmail(phone);

const userCred=await createUserWithEmailAndPassword(auth,email,pass);

await setDoc(doc(db,"users",userCred.user.uid),{
phone:phone,
createdAt:serverTimestamp()
});

window.location="chat.html";

}catch(e){
msg.innerText="Signup error";
}

};

/* ================= LOGIN ================= */

document.getElementById("loginBtn").onclick=async()=>{

const phone=document.getElementById("loginPhone").value.trim();
const pass=document.getElementById("loginPass").value;

if(!phone||!pass){
msg.innerText="Enter login details";
return;
}

try{

const email=phoneToEmail(phone);

await signInWithEmailAndPassword(auth,email,pass);

window.location="chat.html";

}catch(e){
msg.innerText="Invalid login";
}

};
