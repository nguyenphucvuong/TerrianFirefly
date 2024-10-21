// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-eHeNn8X3V3__td26bDztXuvTKv5uqLM",

    authDomain: "terrianfirefly.firebaseapp.com",
    projectId: "terrianfirefly",
    storageBucket: "terrianfirefly.appspot.com",
    messagingSenderId: "713889504554",
    appId: "1:713889504554:web:6c56f82604a30e4b069253"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const storage = getStorage(app, "gs://terrianfirefly.appspot.com");