import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCPLetgCHWg2JdCTmnes0fjheMoybuPCjk",
  authDomain: "instagram-clone-70163.firebaseapp.com",
  projectId: "instagram-clone-70163",
  storageBucket: "instagram-clone-70163.appspot.com",
  messagingSenderId: "927240750696",
  appId: "1:927240750696:web:53a1d5ac6554c1b3cadddd",
  measurementId: "G-12QC6Y5K8B",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
