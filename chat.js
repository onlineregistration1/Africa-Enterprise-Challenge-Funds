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

const messages=document.getElementById("messages");
const input=document.getElementById("messageInput");
const sendBtn=document.getElementById("sendBtn");
const logoutBtn=document.getElementById("logoutBtn");

let currentUser=null;

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="index.html";
return;

}

currentUser=user;

loadMessages();

});

logoutBtn.onclick=async()=>{

await signOut(auth);

window.location="index.html";

};

sendBtn.onclick=async()=>{

const text=input.value.trim();

if(text==="") return;

await addDoc(

collection(db,"users",currentUser.uid,"messages"),

{

sender:"user",

text:text,

unsent:false,

time:serverTimestamp()

}

);

input.value="";

};

function loadMessages(){

const q=query(

collection(db,"users",currentUser.uid,"messages"),

orderBy("time","asc")

);

onSnapshot(q,(snapshot)=>{

messages.innerHTML="";

snapshot.forEach((doc)=>{

const data=doc.data();

const bubble=document.createElement("div");

bubble.className="message "+data.sender;

bubble.innerHTML=data.unsent
? "<i>Message unsent</i>"
: data.text;

messages.appendChild(bubble);

});

messages.scrollTop=messages.scrollHeight;

});

}
import {
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let messageRefs=[];

function loadMessages(){

const q=query(

collection(db,"users",currentUser.uid,"messages"),

orderBy("time","asc")

);

onSnapshot(q,(snapshot)=>{

messages.innerHTML="";
messageRefs=[];

snapshot.forEach((snap)=>{

const data=snap.data();

messageRefs.push({
id:snap.id,
sender:data.sender
});

const bubble=document.createElement("div");

bubble.className="message "+data.sender;

if(data.unsent){

bubble.innerHTML="<i>Message unsent</i>";

}else{

bubble.innerHTML=data.text;

}

if(data.sender==="user"){

bubble.oncontextmenu=(e)=>{

e.preventDefault();

unsendMessage(snap.id);

};

bubble.ontouchstart=()=>{

pressTimer=setTimeout(()=>{

unsendMessage(snap.id);

},700);

};

bubble.ontouchend=()=>{

clearTimeout(pressTimer);

};

}

messages.appendChild(bubble);

});

messages.scrollTop=messages.scrollHeight;

});

}

async function unsendMessage(id){

const ok=confirm("Unsend this message?");

if(!ok)return;

await updateDoc(

doc(db,"users",currentUser.uid,"messages",id),

{

unsent:true

}

);

}

let pressTimer;
