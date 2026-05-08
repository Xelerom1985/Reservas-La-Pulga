import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue, set, update, push, remove } from 'firebase/database'

// COMPLETAR con la config del proyecto "reservas-la-pulga" en Firebase Console
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6bDiv1BwVQEDBH8SokGM2g31IRx9EN5o",
  authDomain: "reservas-la-pulga.firebaseapp.com",
  databaseURL: "https://reservas-la-pulga-default-rtdb.firebaseio.com",
  projectId: "reservas-la-pulga",
  storageBucket: "reservas-la-pulga.firebasestorage.app",
  messagingSenderId: "207618080359",
  appId: "1:207618080359:web:16aa7473c9d9bbc429dec2",
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export { ref, onValue, set, update, push, remove }
