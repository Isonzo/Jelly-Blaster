// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXxxDq2qqtoO9K_VWOfQTKogm1k6-wxTg",
  authDomain: "jelly-blaster.firebaseapp.com",
  projectId: "jelly-blaster",
  storageBucket: "jelly-blaster.appspot.com",
  messagingSenderId: "339213151254",
  appId: "1:339213151254:web:dae8a1c9d52a4bc3659937"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export default firestore
