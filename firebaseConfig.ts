// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDaCpe9LVnpl4gvBIsbJh-oOltXKiybWfA",
    authDomain: "tali-hotel.firebaseapp.com",
    projectId: "tali-hotel",
    storageBucket: "tali-hotel.appspot.com",
    messagingSenderId: "1090022375799",
    appId: "1:1090022375799:web:200f1160a2aada3190a172",
    measurementId: "G-D3SRNLBW4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage();

//https://console.firebase.google.com/u/0/project/tali-hotel/storage/tali-hotel.appspot.com/files/~2F
