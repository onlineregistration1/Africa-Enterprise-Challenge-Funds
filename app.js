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
// ---------- Create Account ----------
document.getElementById("createAccount").onclick = async () => {

const phone = document.getElementById("signupPhone").value.trim();
const password = document.getElementById("signupPassword").value;
const confirm = document.getElementById("confirmPassword").value;

message.style.color = "red";

if(phone==="" || password==="" || confirm===""){
message.innerHTML="Fill in all fields.";
return;
}

if(password!==confirm){
message.innerHTML="Passwords do not match.";
return;
}

const userRef = doc(db,"users",phone);
const userSnap = await getDoc(userRef);

if(userSnap.exists()){
message.innerHTML="Account already exists. Please Login.";
return;
}

await setDoc(userRef,{
phone:phone,
password:password,
createdAt:Date.now(),
lastSeen:Date.now()
});

localStorage.setItem("loggedUser",phone);

message.style.color="green";
message.innerHTML="Account created successfully...";

setTimeout(()=>{
location.href="chat.html";
},800);

};

// ---------- Login ----------
document.getElementById("loginNow").onclick = async ()=>{

const phone=document.getElementById("loginPhone").value.trim();
const password=document.getElementById("loginPassword").value;

message.style.color="red";

if(phone==="" || password===""){
message.innerHTML="Enter phone number and password.";
return;
}

const userRef=doc(db,"users",phone);
const userSnap=await getDoc(userRef);

if(!userSnap.exists()){
message.innerHTML="Account not found. Please create an account.";
return;
}

const user=userSnap.data();

if(user.password!==password){
message.innerHTML="Incorrect password.";
return;
}

localStorage.setItem("loggedUser",phone);

message.style.color="green";
message.innerHTML="Login successful...";

setTimeout(()=>{
location.href="chat.html";
},800);

};
