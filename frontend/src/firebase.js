import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD1s4UbeZPICin-IPM3PUPkbActaLtiPMw",
    authDomain: "jobportal-7ae2f.firebaseapp.com",
    projectId: "jobportal-7ae2f",
    storageBucket: "jobportal-7ae2f.firebasestorage.app",
    messagingSenderId: "41227681258",
    appId: "1:41227681258:web:69d10be91592a3dba04693",
    measurementId: "G-8KWZ03JQYW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export default app;
