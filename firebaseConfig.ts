import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDaCpe9LVnpl4gvBIsbJh-oOltXKiybWfA",
    authDomain: "tali-hotel.firebaseapp.com",
    projectId: "tali-hotel",
    storageBucket: "tali-hotel.appspot.com",
    messagingSenderId: "1090022375799",
    appId: "1:1090022375799:web:200f1160a2aada3190a172",
    measurementId: "G-D3SRNLBW4E"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage();

export { app, storage };

let analytics = null;

if (typeof window !== 'undefined') {
    import('firebase/analytics')
        .then(async ({ isSupported, getAnalytics }) => {
            if (await isSupported()) {
                const analyticsApp = getAnalytics(app);
                analytics = analyticsApp;
            }
        })
        .catch((error) => {
            console.error('Error while loading Firebase Analytics:', error);
        });
}

export { analytics };
//https://console.firebase.google.com/u/0/project/tali-hotel/storage/tali-hotel.appspot.com/files/~2F
