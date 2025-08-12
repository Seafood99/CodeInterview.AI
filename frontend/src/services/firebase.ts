import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDR9EwqELAaC3HzWYTx-sEHL6XAQb6b_1E",
    authDomain: "code-interview-simulator.firebaseapp.com",
    projectId: "code-interview-simulator",
    storageBucket: "code-interview-simulator.firebasestorage.app",
    messagingSenderId: "875116065695",
    appId: "1:875116065695:web:8b00d72387641a993943aa",
    measurementId: "G-7617SL0G5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore with long polling to avoid WebChannel 400 issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true
});

export default app;