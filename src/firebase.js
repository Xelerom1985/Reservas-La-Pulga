import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, update, push, remove } from 'firebase/database'

// COMPLETAR con la config del proyecto "reservas-la-pulga" en Firebase Console
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "reservas-la-pulga.firebaseapp.com",
  databaseURL: "https://reservas-la-pulga-default-rtdb.firebaseio.com",
  projectId: "reservas-la-pulga",
  storageBucket: "reservas-la-pulga.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export { ref, onValue, set, update, push, remove }
