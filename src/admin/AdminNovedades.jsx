import { useState } from 'react'
import { db, ref, push, set, update, remove } from '../firebase'

export default function AdminNovedades({ novedades }) {
  const [texto, setTexto] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    setSaving(true)
    const newRef = push(ref(db, 'novedades'))
    await set(newRef, { texto: texto.trim(), activo: true, createdAt: Date.now() })
    setTexto('')
    setSaving(false)
  }

  const handleToggle = async (n) => {
    await update(ref(db, `novedades/${n.id}`), { activo: !n.activo })
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    await remove(ref(db, `novedades/${id}`))
  }

  const sorted = [...novedades].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div>
      <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#800020', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Nueva novedad
        </p>
        <textarea
          rows={3}
          placeholder="Escribí la novedad para mostrar en el inicio..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          style={{ resize: 'none', marginBottom: 8 }}
        />
        <button
          type="submit"
          disabled={saving || !texto.trim()}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#800020,#a00028)',
            color: '#f1e9d8', fontWeight: 700,
            fontSize: 14, letterSpacing: 1, textTransform: 'uppercase',
            border: 'none', borderRadius: 10, padding: '12px 0', cursor: 'pointer',
            opacity: (saving || !texto.trim()) ? 0.5 : 1,
          }}
        >
          {saving ? 'Publicando...' : '📢 PUBLICAR'}
        </button>
      </form>

      {sorted.length === 0 && (
        <p style={{ color: 'rgba(241,233,216,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          No hay novedades
        </p>
      )}

      {sorted.map(n => (
        <div key={n.id} style={{
          background: n.activo ? 'rgba(128,0,32,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${n.activo ? 'rgba(128,0,32,0.35)' : 'rgba(255,255,255,0.06)'}`,
          borderRadius: 12, padding: '12px 14px', marginBottom: 8,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <p style={{
              margin: 0, fontSize: 14, lineHeight: 1.5, flex: 1,
              color: n.activo ? '#f1e9d8' : 'rgba(241,233,216,0.35)',
            }}>
              {n.texto}
            </p>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button
                onClick={() => handleToggle(n)}
                title={n.activo ? 'Ocultar' : 'Mostrar'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }}
              >
                {n.activo ? '👁️' : '🙈'}
              </button>
              <button
                onClick={() => handleDelete(n.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2, color: '#f87171' }}
              >
                🗑️
              </button>
            </div>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 10, color: 'rgba(241,233,216,0.25)', letterSpacing: 0.5 }}>
            {n.activo ? '✓ Visible en inicio' : '○ Oculta'}
          </p>
        </div>
      ))}
    </div>
  )
}
