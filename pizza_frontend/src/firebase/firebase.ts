import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Asluf
const firebaseConfig = {
  apiKey: "AIzaSyAoorsQjNGBpEYdvy-EtlNnCpKS1z4zqh4",
  authDomain: "pizza-shop-fd3ae.firebaseapp.com",
  projectId: "pizza-shop-fd3ae",
  storageBucket: "pizza-shop-fd3ae.firebasestorage.app",
  messagingSenderId: "314208871803",
  appId: "1:314208871803:web:5bbe53f9132f9cc7dcc9de",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);

export { app, auth };
