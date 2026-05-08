import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set } from 'firebase/database'

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

// Bloques recurrentes por día de semana (1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie)
// from: hora inicio (inclusive), to: hora fin (exclusive)
await set(ref(db, 'config/bloqueados'), {
  "1": { from: 18, to: 22, label: 'Entrenamientos' },
  "2": { from: 18, to: 22, label: 'Entrenamientos' },
  "3": { from: 18, to: 23, label: 'Entrenamientos' },
  "4": { from: 18, to: 22, label: 'Entrenamientos' },
  "5": { from: 18, to: 23, label: 'Entrenamientos' },
})
console.log('✓ Bloques recurrentes guardados')

// 4 clientes generales
const clientes = [
  { nombre: 'Entrenamientos', tel: '0000000001' },
  { nombre: 'Handball',       tel: '0000000002' },
  { nombre: 'Futsal',         tel: '0000000003' },
  { nombre: 'Infantil',       tel: '0000000004' },
]

for (const c of clientes) {
  await set(ref(db, `clientes/${c.tel}`), {
    nombre: c.nombre,
    tel: c.tel,
    notas: 'Cliente general',
    createdAt: Date.now(),
  })
  console.log(`✓ Cliente agregado: ${c.nombre}`)
}

console.log('\n¡Listo!')
process.exit(0)
