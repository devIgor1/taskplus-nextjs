// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACQ97AdeoTddb14QOkDc9y7-HAwD4P39g",
  authDomain: "taskplus-3354d.firebaseapp.com",
  projectId: "taskplus-3354d",
  storageBucket: "taskplus-3354d.appspot.com",
  messagingSenderId: "21980070976",
  appId: "1:21980070976:web:11636a47b97358113f4ba5",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
