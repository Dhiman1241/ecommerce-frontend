// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app'
import { getFirestore, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import { getFunctions } from 'firebase/functions'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_API_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_API_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_API_STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_API_APPID,
  measurementId: process.env.NEXT_PUBLIC_API_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const projectAuth = getAuth(app);
const projectFirestore = getFirestore(app);
const projectStorage = getStorage(app);
const functions = getFunctions(app);
const analytics = getAnalytics(app);

// Timestamp
const timestamp = serverTimestamp;

// Export services
export { projectFirestore, projectAuth, projectStorage, timestamp, functions, analytics };
