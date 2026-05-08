import { useState } from 'react'
import { db, ref, set } from '../firebase'

export default function RegisterModal({ onSave }) {
  const [nombre, setNombre] = useState('')
  const [tel, setTel] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim() || !tel.trim()) {
      setError(true)
      return
    }
    const cleanTel = tel.replace(/\D/g, '') || String(Date.now())
    set(ref(db, `clientes/${cleanTel}`), {
      nombre: nombre.trim(),
      tel: tel.trim(),
      createdAt: Date.now(),
    })
    onSave(nombre.trim(), tel.trim())
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 150, padding: 16,
    }}>
      <div style={{
        background: '#1a0509',
        border: '1px solid rgba(128,0,32,0.5)',
        borderRadius: 20,
        padding: 28,
        width: '100%',
        maxWidth: 340,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚽</div>
          <h2 style={{ color: '#f1e9d8', margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>
            ¡Bienvenido!
          </h2>
          <p style={{ color: 'rgba(241,233,216,0.5)', fontSize: 13, margin: 0 }}>
            Ingresá tus datos para reservar
          </p>
        </div>

        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(128,0,32,0.6),transparent)', marginBottom: 20 }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={e => { setNombre(e.target.value); setError(false) }}
            autoFocus
          />
          <input
            placeholder="Tu número de celular"
            type="tel"
            value={tel}
            onChange={e => { setTel(e.target.value); setError(false) }}
          />
          {error && (
            <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', margin: 0 }}>
              Completá nombre y celular
            </p>
          )}
          <button
            type="submit"
            style={{
              marginTop: 4,
              width: '100%',
              background: 'linear-gradient(135deg,#800020,#a00028)',
              color: '#f1e9d8',
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 2,
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 12,
              padding: '16px 0',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(128,0,32,0.4)',
            }}
          >
            CONTINUAR
          </button>
        </form>
      </div>
    </div>
  )
}
