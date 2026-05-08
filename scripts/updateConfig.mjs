import { initializeApp } from 'firebase/app'
import { getDatabase, ref, update } from 'firebase/database'

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
const db = getDatabase(app)

await update(ref(db, 'config'), { horaInicio: 8, horaFin: 23 })
console.log('✓ Config actualizada: 08:00 a 22:00 (último turno)')
process.exit(0)
