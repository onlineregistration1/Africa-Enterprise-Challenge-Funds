import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const $ = id=>document.getElementById(id);
let phone = localStorage.getItem('phone');
let unsub = null;

if(phone){ enterChat(phone); } else { showAuth(); }

function showAuth(){
  $('authScreen').classList.remove('hidden');
  $('chatScreen').classList.add('hidden');
}

$('authBtn').onclick = async ()=>{
  const ph = $('phone').value.trim();
  const pw = $('pwd').value;
  const rep = $('repPwd').value;
  $('authMsg').textContent='';
  if(!ph ||!pw) return $('authMsg').textContent='Fill all fields';
  const email = ph+'@aef.chat';

  const uRef = doc(db,'users',ph);
  const snap = await getDoc(uRef);

  try{
    if(snap.exists()){
      $('repWrap').classList.add('hidden');
      await signInWithEmailAndPassword(auth, email, pw);
    }else{
      if(pw!==rep) return $('authMsg').textContent='Passwords do not match';
      await createUserWithEmailAndPassword(auth, email, pw);
      await setDoc(uRef,{createdAt:serverTimestamp(),lastSeen:serverTimestamp(),lastSender:'none'});
    }
    localStorage.setItem('phone',ph);
    enterChat(ph);
  }catch(e){ $('authMsg').textContent=e.message; }
}

function enterChat(ph){
  phone=ph;
  $('authScreen').classList.add('hidden');
  $('chatScreen').classList.remove('hidden');
  $('chatHead').textContent = ph;
  listen(ph);
  setTimeout(()=>$('msgInput').focus(),300);
}

function listen(ph){
  if(unsub) unsub();
  const q = query(collection(db,'chats',ph,'messages'), orderBy('ts','desc'));
  unsub = onSnapshot(q, snap=>{
    const box=$('chatBox'); box.innerHTML='';
    snap.forEach(d=>{
      const m=d.data();
      if(m.delUser) return;
      const div=document.createElement('div');
      div.className='msg '+(m.sender==='user'?'sent':'recv');
      if(m.img){
        const img=document.createElement('img');
        img.src=m.img;
        div.appendChild(img);
      }else{
        div.textContent=m.text;
      }
      box.appendChild(div);
    });
  });
}

async function sendMsg(text='',imgUrl=''){
  await addDoc(collection(db,'chats',phone,'messages'),{
    text, img:imgUrl||'', sender:'user', ts:serverTimestamp(), delUser:false, delAdmin:false
  });
  await updateDoc(doc(db,'users',phone),{lastSeen:serverTimestamp(),lastSender:'user'});
}

$('sendBtn').onclick = async ()=>{
  const txt=$('msgInput').value.trim();
  if(!txt) return;
  await sendMsg(txt,'');
  $('msgInput').value='';
  $('msgInput').focus();
}

$('imgInput').onchange = async (e)=>{
  const file=e.target.files[0];
  if(!file) return;
  const storageRef=ref(storage,`chats/${phone}/${Date.now()}_${file.name}`);
  const snap=await uploadBytes(storageRef,file);
  const url=await getDownloadURL(snap.ref);
  await sendMsg('',url);
  e.target.value='';
  $('msgInput').focus();
}

$('logoutBtn').onclick=async()=>{
  await signOut(auth);
  localStorage.clear();
  location.reload();
    }
