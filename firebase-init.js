/* ==========================================================================
   FIREBASE CONFIG — WAJIB DIISI SEBELUM LOGIN GOOGLE & FIRESTORE BISA JALAN
   ==========================================================================
   Cara ambil config kamu sendiri:
   1. Buka https://console.firebase.google.com -> buat/pilih proyek.
   2. Project settings (ikon gerigi) -> General -> scroll ke "Your apps".
   3. Kalau belum ada app Web, klik ikon "</>" untuk daftarkan web app.
   4. Copy objek firebaseConfig yang muncul, tempel gantikan objek di bawah.
   5. Di Firebase Console, aktifkan:
        - Authentication -> Sign-in method -> Google (Enable)
        - Firestore Database -> Create database (mode production/test)
   6. Atur Firestore Security Rules minimal supaya user hanya bisa baca/tulis
      dokumennya sendiri, contoh:
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /users/{uid} {
              allow read: if request.auth != null;
              allow write: if request.auth != null && request.auth.uid == uid;
            }
          }
        }
      (Baca-semua-user dibutuhkan untuk dashboard admin broadcast di admin.html.
       Untuk produksi sebaiknya batasi read koleksi users hanya untuk akun admin
       tertentu, misalnya lewat custom claim role:"admin".)
   ========================================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, collection, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_FIREBASE_KAMU",
  authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
  projectId: "GANTI_DENGAN_PROJECT_ID",
  storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
  messagingSenderId: "GANTI_DENGAN_SENDER_ID",
  appId: "GANTI_DENGAN_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

/* Login pakai popup akun Google. Mengembalikan objek user Firebase, atau null kalau gagal/dibatalkan. */
async function loginWithGoogle(){
  try{
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }catch(err){
    console.error("Login Google gagal:", err);
    if(err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request"){
      alert("Login gagal, coba lagi ya. (" + err.code + ")");
    }
    return null;
  }
}
async function logout(){ await signOut(auth); }

/* Dipanggil tiap status login berubah (baru buka web, baru login, baru logout). */
function onAuthChange(callback){ onAuthStateChanged(auth, callback); }

/* Simpan/ubah data profil user ke Firestore koleksi "users", dokumen id = uid. merge:true supaya field yang tidak dikirim tidak ikut terhapus. */
async function saveUserProfile(uid, data){
  await setDoc(doc(db, "users", uid), data, { merge: true });
}
async function getUserProfile(uid){
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}
/* Dipakai oleh admin.html untuk ambil semua user terdaftar (buat broadcast email). */
async function getAllUsers(){
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

window.RevizaAuth = {
  loginWithGoogle, logout, onAuthChange,
  saveUserProfile, getUserProfile, getAllUsers,
  serverTimestamp
};
window.dispatchEvent(new Event("reviza-auth-ready"));
