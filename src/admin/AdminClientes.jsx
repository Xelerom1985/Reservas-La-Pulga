import { useState } from 'react'
import { db, ref, update, remove } from '../firebase'

export default function AdminClientes({ clientes }) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})

  const filtered = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.tel?.includes(search)
  )

  const handleEdit = (c) => {
    setEditing(c.id)
    setEditData({ nombre: c.nombre || '', tel: c.tel || '', notas: c.notas || '' })
  }

  const handleSave = async () => {
    await update(ref(db, `clientes/${editing}`), editData)
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return
    await remove(ref(db, `clientes/${id}`))
  }

  return (
    <div>
      <input
        placeholder="Buscar por nombre o celular..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 14 }}
      />

      {filtered.length === 0 && (
        <p style={{ color: 'rgba(241,233,216,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          {search ? 'Sin resultados' : 'Sin clientes registrados'}
        </p>
      )}

      {filtered
        .sort((a, b) => a.nombre?.localeCompare(b.nombre || '') || 0)
        .map(c => (
          <div key={c.id} style={{
            background: '#1a0509', border: '1px solid rgba(128,0,32,0.25)',
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
          }}>
            {editing === c.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  placeholder="Nombre"
                  value={editData.nombre}
                  onChange={e => setEditData(p => ({...p, nombre: e.target.value}))}
                />
                <input
                  placeholder="Celular"
                  value={editData.tel}
                  onChange={e => setEditData(p => ({...p, tel: e.target.value}))}
                />
                <textarea
                  placeholder="Notas (opcional)"
                  rows={2}
                  value={editData.notas}
                  onChange={e => setEditData(p => ({...p, notas: e.target.value}))}
                  style={{ resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSave} style={btnSmallPrimary}>Guardar</button>
                  <button onClick={() => setEditing(null)} style={btnSmallGray}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{c.nombre}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>{c.tel}</p>
                  {c.notas && (
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#800020' }}>{c.notas}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(c)} style={{ ...btnIcon, color: 'rgba(241,233,216,0.6)' }}>✏️</button>
                  <button onClick={() => handleDelete(c.id)} style={{ ...btnIcon, color: '#f87171' }}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  )
}

const btnIcon = { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, padding: 2 }
const btnSmallPrimary = {
  flex: 1, padding: '8px 0', borderRadius: 6,
  background: 'linear-gradient(135deg,#800020,#a00028)',
  color: '#f1e9d8', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer',
}
const btnSmallGray = {
  flex: 1, padding: '8px 0', borderRadius: 6,
  background: 'rgba(255,255,255,0.08)', color: '#f1e9d8',
  fontSize: 13, border: 'none', cursor: 'pointer',
}
