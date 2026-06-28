import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
doc,
collection,
addDoc,
setDoc,
query,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const messageBox=document.getElementById("messages");
const messageInput=document.getElementById("messageInput");
const sendBtn=document.getElementById("sendBtn");
const logoutBtn=document.getElementById("logoutBtn");

let currentUser=null;

onAuthStateChanged(auth,async(user)=>{

if(!user){

location.href="index.html";
return;

}

currentUser=user;

await setDoc(

doc(db,"chats",user.uid),

{

phone:user.email.replace("@aecf.local",""),

lastMessage:"",
lastTime:serverTimestamp()

},

{merge:true}

);

loadMessages();

});

logoutBtn.onclick=async()=>{

await signOut(auth);

location.href="index.html";

};

sendBtn.onclick=async()=>{

const text=messageInput.value.trim();

if(text==="") return;

await addDoc(

collection(db,"chats",currentUser.uid,"messages"),

{

sender:"user",

text:text,

unsent:false,

time:serverTimestamp()

}

);

await setDoc(

doc(db,"chats",currentUser.uid),

{

phone:currentUser.email.replace("@aecf.local",""),

lastMessage:text,

lastTime:serverTimestamp()

},

{merge:true}

);

messageInput.value="";

};

function loadMessages(){

const q=query(

collection(db,"chats",currentUser.uid,"messages"),

orderBy("time","asc")

);

onSnapshot(q,(snapshot)=>{

messageBox.innerHTML="";
  snapshot.forEach((docSnap)=>{

const data=docSnap.data();

const bubble=document.createElement("div");

bubble.className="message";

if(data.sender==="user"){

bubble.classList.add("user");

}else{

bubble.classList.add("admin");

}

if(data.unsent){

bubble.innerHTML="<i>Message unsent</i>";

}else{

bubble.textContent=data.text;

}

messageBox.appendChild(bubble);

});

messageBox.scrollTop=messageBox.scrollHeight;

});

}

messageInput.addEventListener("keypress",(e)=>{

if(e.key==="Enter"){

sendBtn.click();

}

});
let pressTimer=null;

function enableUnsend(bubble,id,data){

if(data.sender!=="user") return;

bubble.ontouchstart=()=>{

pressTimer=setTimeout(async()=>{

const ok=confirm("Unsend this message?");

if(!ok) return;

await updateDoc(

doc(db,"chats",currentUser.uid,"messages",id),

{

unsentByUser:true

}

);

},700);

};

bubble.ontouchend=()=>{

clearTimeout(pressTimer);

};

}
