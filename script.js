import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
doc,
setDoc,
getDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const loginBtn=document.getElementById("loginBtn");
const signupBtn=document.getElementById("signupBtn");
const messageBox=document.getElementById("messageBox");

function showMessage(msg,color="red"){
messageBox.style.color=color;
messageBox.innerText=msg;
}

function phoneToEmail(phone){
return phone.trim()+"@aecf.local";
}

/* =========================
   SIGN UP
========================= */

signupBtn.addEventListener("click",async()=>{

const phone=document.getElementById("signupPhone").value.trim();
const pass=document.getElementById("signupPassword").value;
const confirm=document.getElementById("confirmPassword").value;

if(!phone||!pass||!confirm){
showMessage("Fill all fields");
return;
}

if(pass!==confirm){
showMessage("Passwords do not match");
return;
}

if(pass.length<6){
showMessage("Password too short");
return;
}

const email=phoneToEmail(phone);

try{

const userCred=await createUserWithEmailAndPassword(auth,email,pass);

await setDoc(doc(db,"users",userCred.user.uid),{
phone:phone,
createdAt:serverTimestamp()
});

showMessage("Account created", "green");

setTimeout(()=>{

window.location="chat.html";

},1000);

}catch(e){
showMessage(e.message);
}

});

/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click",async()=>{

const phone=document.getElementById("loginPhone").value.trim();
const pass=document.getElementById("loginPassword").value;

if(!phone||!pass){
showMessage("Enter phone and password");
return;
}

const email=phoneToEmail(phone);

try{

await signInWithEmailAndPassword(auth,email,pass);

showMessage("Login successful","green");

setTimeout(()=>{

window.location="chat.html";

},800);

}catch(e){
showMessage("Invalid login details");
}

});
