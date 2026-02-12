import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC45fYbYZ-HA1tKt04BLi_WEv-9IWXxhCE",
    authDomain: "uu-memo.firebaseapp.com",
    projectId: "uu-memo",
    storageBucket: "uu-memo.firebasestorage.app",
    messagingSenderId: "446132884347",
    appId: "1:446132884347:web:72c744429604e4758923de",
    measurementId: "G-ZKZV3JK52J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let analytics;
// Analytics is only supported in browser environments
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export { app, auth, googleProvider, analytics };
