import { db } from "./firebase.js";

import {
collection,
doc,
getDoc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ---------- Home ----------
const homePage=document.getElementById("homePage");
const loginPage=document.getElementById("loginPage");
const signupPage=document.getElementById("signupPage");
const message=document.getElementById("message");

// ---------- Buttons ----------
document.getElementById("loginBtn").onclick=()=>{
homePage.style.display="none";
loginPage.style.display="block";
};

document.getElementById("signupBtn").onclick=()=>{
homePage.style.display="none";
signupPage.style.display="block";
};

document.getElementById("backHome1").onclick=()=>{
loginPage.style.display="none";
homePage.style.display="block";
message.innerHTML="";
};

document.getElementById("backHome2").onclick=()=>{
signupPage.style.display="none";
homePage.style.display="block";
message.innerHTML="";
};

// ---------- Show Password ----------
function toggle(inputId){
const i=document.getElementById(inputId);
i.type=i.type==="password"?"text":"password";
}

document.getElementById("showLoginPassword").onclick=()=>toggle("loginPassword");
document.getElementById("showSignupPassword").onclick=()=>toggle("signupPassword");
document.getElementById("showConfirmPassword").onclick=()=>toggle("confirmPassword");

// ---------- Auto Login ----------
const saved=localStorage.getItem("loggedUser");

if(saved){
location.href="chat.html";
}
