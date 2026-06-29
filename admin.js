import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDocs, collection, addDoc, query, orderBy, onSnapshot, updateDoc, deleteDoc, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh2fHMUbysckAxdIA8dcz8sHWrcLbW1EQ",
  authDomain: "african-enterprise-challenge-f.firebaseapp.com",
  projectId: "african-enterprise-challenge-f",
  storageBucket: "african-enterprise-challenge-f.firebasestorage.app",
  messagingSenderId: "85146331644",
  appId: "1:85146331644:web:b28599e0c8b75498fe6a79",
  measurementId: "G-6C670QY54S"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const ADMIN_USER="Kibet Davis";
const ADMIN_PASS="Kwenik254$";
const $=id=>document.getElementById(id);

let activePhone=null; let unsub=null;

if(localStorage.getItem('admin')==='1'){ showAdmin(); }

$('aLogin').onclick=()=>{
  if($('aUser').value===ADMIN_USER && $('aPass').value===ADMIN_PASS){
    localStorage.setItem('admin','1'); showAdmin();
  }else $('aMsg').textContent='Wrong credentials';
}

$('aLogout').onclick=()=>{localStorage.removeItem('admin');location.reload();}
$('backBtn').onclick=()=>{closeChat();}

function showAdmin(){
  $('loginScreen').classList.add('hidden');
  $('adminScreen').classList.remove('hidden');
  loadUsers();
}

async function loadUsers(){
  $('userList').innerHTML='Loading...';
  const snap=await getDocs(collection(db,'users'));
  const users=[];
  snap.forEach(d=>users.push({id:d.id,...d.data()}));
  users.sort((a,b)=>(b.lastSeen?.seconds||0)-(a.lastSeen?.seconds||0));

  $('userList').innerHTML='';
  users.forEach(u=>{
    const row=document.createElement('div');
    row.className='userRow'+(u.lastSender==='user'?' unread':'');
    row.innerHTML=`<span>${u.id}</span><span class="time">${u.lastSeen?new Date(u.lastSeen.seconds*1000).toLocaleTimeString():''}</span>`;
    row.onclick=()=>openChat(u.id,row);
    row.oncontextmenu=e=>{e.preventDefault(); if(confirm('Delete '+u.id+' and all chats?')) delUser(u.id);}; // Long press delete
    $('userList').appendChild(row);
  });
}

function openChat(phone,row){
  activePhone=phone;
  row.classList.remove('unread'); // Mark as read
  $('userList').classList.add('hidden');
  $('chatBox').classList.remove('hidden');
  $('inputWrap').classList.remove('hidden');
  $('backBtn').classList.remove('hidden');
  $('aHead').textContent='Chat: '+phone;
  listen(phone);
  setTimeout(()=>$('msgInput').focus(),300);
}

function closeChat(){
  if(unsub) unsub();
  $('userList').classList.remove('hidden');
  $('chatBox').classList.add('hidden');
  $('inputWrap').classList.add('hidden');
  $('backBtn').classList.add('hidden');
  $('aHead').textContent='Admin';
  activePhone=null;
}

function listen(phone){
  if(unsub) unsub();
  const q=query(collection(db,'chats',phone,'messages'), orderBy('ts','desc'));
  unsub=onSnapshot(q,snap=>{
    $('chatBox').innerHTML='';
    snap.forEach(d=>{
      const m=d.data();
      if(m.delAdmin) return; // Admin unsent = blank for both
      const div=document.createElement('div');
      div.className='msg '+(m.sender==='admin'?'sent':'recv');
      if(m.delUser) div.classList.add('deleted'), div.textContent='Deleted message'; // Admin sees this
      else if(m.img){ const img=document.createElement('img'); img.src=m.img; div.appendChild(img); }
      else div.textContent=m.text;
      div.ondblclick=()=>unsend(d.id,phone); // Admin only: double tap to unsend
      $('chatBox').appendChild(div);
    });
  });
}

async function sendMsg(text='',imgUrl=''){
  await addDoc(collection(db,'chats',activePhone,'messages'),{
    text, img:imgUrl||'', sender:'admin', ts:serverTimestamp(), delUser:false, delAdmin:false
  });
  await updateDoc(doc(db,'users',activePhone),{lastSeen:serverTimestamp(),lastSender:'admin'});
}

$('sendBtn').onclick=async()=>{
  const txt=$('msgInput').value.trim();
  if(!txt&&!$('imgInput').files[0]) return;
  await sendMsg(txt,'');
  $('msgInput').value='';$('previewBar').classList.remove('show');
  $('msgInput').focus();
}

$('imgInput').onchange = async (e)=>{
  const file=e.target.files[0];
  if(!file||!activePhone) return;
  const storageRef=ref(storage,`chats/${activePhone}/${Date.now()}_${file.name}`);
  const snap=await uploadBytes(storageRef,file);
  const url=await getDownloadURL(snap.ref);
  await sendMsg('',url);
  e.target.value='';
  $('msgInput').focus();
}

$('msgInput').oninput=()=>{
  const p=$('previewBar');
  if($('msgInput').value){p.textContent=$('msgInput').value;p.classList.add('show');}
  else p.classList.remove('show');
}

async function unsend(id,phone){
  await updateDoc(doc(db,'chats',phone,'messages',id),{delUser:true,delAdmin:true}); // Blank for both
}

async function delUser(phone){
  const batch=writeBatch(db);
  batch.delete(doc(db,'users',phone));
  const msgs=await getDocs(collection(db,'chats',phone,'messages'));
  msgs.forEach(d=>batch.delete(d.ref));
  await batch.commit();
  closeChat(); loadUsers();
    }
