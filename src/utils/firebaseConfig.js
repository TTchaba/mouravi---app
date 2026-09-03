import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

/**
 * Firebase Configuration
 * Load configuration from environment variables
 * These should be defined in .env.local
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app = null;
let analytics = null;
let auth = null;

try {
  // Validate that configuration is present
  if (!firebaseConfig.apiKey) {
    console.warn(
      'Firebase configuration is missing. Please add .env.local with Firebase credentials.'
    );
  } else {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Initialize analytics only if supported
    // Some browsers may block analytics or it may not be available
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log('✓ Firebase Analytics initialized');
      } else {
        console.log('ℹ Firebase Analytics is not supported in this environment');
      }
    });
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error.message);
}

export { app, analytics, auth };
