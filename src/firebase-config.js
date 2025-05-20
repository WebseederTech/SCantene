import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAFXjHN_utxxgK_Kbj_C6ATGx8dvQCrv8",
  authDomain: "osiya-ecommerce.firebaseapp.com",
  projectId: "osiya-ecommerce",
  storageBucket: "osiya-ecommerce.firebasestorage.app",
  messagingSenderId: "554466933544",
  appId: "1:554466933544:web:2ab8f808ec6b1f5013ee1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Set up messaging
const messaging = getMessaging(app);


// Listen for incoming messages
onMessage(messaging, (payload) => {
  console.log("Notification received:", payload);
  alert(`📲 ${payload.notification.title}: ${payload.notification.message}`);
});

export { messaging, getToken, onMessage };
