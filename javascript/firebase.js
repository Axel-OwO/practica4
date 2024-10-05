
// Importa las funciones necesarias desde los SDKs de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDp1NymuX4XGBYuddJAKZtq7fTRwtjuOtw",
  authDomain: "practica4-19d73.firebaseapp.com",
  projectId: "practica4-19d73",
  storageBucket: "practica4-19d73.appspot.com",
  messagingSenderId: "513686780731",
  appId: "1:513686780731:web:2e722de8ed7569ecab151e"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

console.log("Firebase Realtime Database inicializado");
