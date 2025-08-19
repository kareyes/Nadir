import { browser } from "$app/environment";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAzdHhF2RCs1Esujh5j5QxPBdePPkaDLKg",
	authDomain: "ouro-460410.firebaseapp.com",
	projectId: "ouro-460410",
	storageBucket: "ouro-460410.firebasestorage.app",
	messagingSenderId: "1022064731481",
	appId: "1:1022064731481:web:49a9438ddac779763a5848",
	measurementId: "G-DE3NL2CDD7",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = browser ? getAnalytics(app) : null;
