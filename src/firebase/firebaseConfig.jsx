import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getDatabase } from "firebase/database"; 
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; 


const firebaseConfig = {
  apiKey: "AIzaSyDKZmmTPCk0o0TJno2H0MZ5iGThuqaRyVg",
  authDomain: "tododata-c0787.firebaseapp.com",
  databaseURL: "https://tododata-c0787-default-rtdb.firebaseio.com",
  projectId: "tododata-c0787",
  storageBucket: "tododata-c0787.firebasestorage.app",
  messagingSenderId: "584136044926",
  appId: "1:584136044926:web:fd1246b1ab277bf1af432f" 
};

// Inicializa Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp(); 
}


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const database = getDatabase(app); 

export { app, auth, database }; 