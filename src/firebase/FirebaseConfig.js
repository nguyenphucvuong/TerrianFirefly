// Import the functions you need from the SDKs you need

import { getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword , 
  GoogleAuthProvider, 
  getReactNativePersistence, 
  sendPasswordResetEmail,
  initializeAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firestore } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
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
export const app = initializeApp(firebaseConfig);
// Khởi tạo Firebase Auth với AsyncStorage để duy trì trạng thái xác thực
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const provider = new GoogleAuthProvider();
//export const analytics = getAnalytics(app);
// Initialize Firebase
export const db = getFirestore(app);
export const storage = getStorage(app);
