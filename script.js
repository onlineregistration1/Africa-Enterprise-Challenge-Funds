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

const loginBtn=document.getElementById("loginBtn");
const signupBtn=document.getElementById("signupBtn");
const error=document.getElementById("error");

function showError(message){

error.style.display="block";
error.classList.remove("success");
error.innerHTML=message;

}

function showSuccess(message){

error.style.display="block";
error.classList.add("success");
error.innerHTML=message;

}

function phoneToEmail(phone){

phone=phone.replace(/\s+/g,"");

return phone+"@aecf.local";

}

signupBtn.addEventListener("click",async()=>{

const phone=document
.getElementById("signupPhone")
.value
.trim();

const password=document
.getElementById("signupPassword")
.value;

const confirm=document
.getElementById("confirmPassword")
.value;

if(phone==""){

showError("Enter phone number");

return;

}

if(password.length<6){

showError("Password must be at least 6 characters");

return;

}

if(password!==confirm){

showError("Passwords do not match");

return;

}

const email=phoneToEmail(phone);

try{

const userCredential=
await createUserWithEmailAndPassword(
auth,
email,
password
);

await setDoc(

doc(db,"users",userCredential.user.uid),

{

phone:phone,

createdAt:serverTimestamp()

}

);

showSuccess("Account created successfully.");

setTimeout(()=>{

window.location="chat.html";

},1000);

}catch(e){

showError(e.message);

}

});
loginBtn.addEventListener("click", async()=>{

const phone=document
.getElementById("loginPhone")
.value
.trim();

const password=document
.getElementById("loginPassword")
.value;

if(phone==""){

showError("Enter phone number");

return;

}

if(password==""){

showError("Enter password");

return;

}

const email=phoneToEmail(phone);

try{

await signInWithEmailAndPassword(

auth,
email,
password

);

showSuccess("Login successful.");

setTimeout(()=>{

window.location="chat.html";

},800);

}catch(e){

if(
e.code==="auth/invalid-credential" ||
e.code==="auth/user-not-found" ||
e.code==="auth/wrong-password"
){

showError("Incorrect phone number or password.");

}else{

showError(e.message);

}

}

});

window.addEventListener("load",()=>{

const phone=document.getElementById("loginPhone");

if(phone){

phone.focus();

}

});
