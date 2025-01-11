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

// sarfan
// const firebaseConfig = {
//   apiKey: "AIzaSyBSQCV5rr7tUHeKx-wCMgScW8d6aOCrshc",
//   authDomain: "pizza-2fc07.firebaseapp.com",
//   projectId: "pizza-2fc07",
//   storageBucket: "pizza-2fc07.firebasestorage.app",
//   messagingSenderId: "1082528850111",
//   appId: "1:1082528850111:web:2997a8d549bdff5813260a",
//   measurementId: "G-6T1SD7ZY0K"
// };


const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);

export { app, auth };
