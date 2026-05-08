import { useState } from 'react'
import { db, ref, push, set } from '../firebase'
import { getSlotsForDay, formatDateDisplay } from '../utils/slots'

export default function AdminNuevoTurno({ clientes, turnos, config }) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [clienteSearch, setClienteSearch] = useState('')
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoTel, setNuevoTel] = useState('')
  const [actividad, setActividad] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const slots = getSlotsForDay(config)
  const turnosDelDia = turnos.filter(t => t.fecha === fecha)
  const slotsDisponibles = slots.filter(s => !turnosDelDia.some(t => t.hora === s))

  const clientesFiltrados = clienteSearch.length > 1
    ? clientes.filter(c =>
        c.nombre?.toLowerCase().includes(clienteSearch.toLowerCase()) ||
        c.tel?.includes(clienteSearch)
      ).slice(0, 6)
    : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fecha || !hora) return alert('Elegí fecha y hora')

    const nombre = selectedCliente?.nombre || nuevoNombre.trim()
    const tel = selectedCliente?.tel || nuevoTel.trim()
    if (!nombre || !tel) return alert('Completá nombre y celular')

    const ocupado = turnosDelDia.some(t => t.hora === hora)
    if (ocupado) return alert('Ese horario ya está reservado')

    setSaving(true)
    try {
      if (!selectedCliente && nuevoNombre && nuevoTel) {
        const cleanTel = nuevoTel.replace(/\D/g, '') || String(Date.now())
        set(ref(db, `clientes/${cleanTel}`), {
          nombre: nuevoNombre.trim(),
          tel: nuevoTel.trim(),
          createdAt: Date.now(),
        })
      }
      const newRef = push(ref(db, 'turnos'))
      await set(newRef, {
        fecha,
        hora,
        clienteNombre: nombre,
        clienteTel: tel,
        actividad: actividad.trim() || null,
        createdAt: Date.now(),
      })
      setDone(true)
      setTimeout(() => {
        setDone(false)
        setFecha(''); setHora(''); setClienteSearch(''); setSelectedCliente(null)
        setNuevoNombre(''); setNuevoTel(''); setActividad('')
      }, 2000)
    } catch {
      alert('Error al guardar.')
    }
    setSaving(false)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <p style={{ color: '#f1e9d8', fontWeight: 700, marginTop: 12 }}>Reserva agregada</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#800020', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
        Nueva reserva manual
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={label}>Fecha</p>
          <input
            type="date"
            value={fecha}
            onChange={e => { setFecha(e.target.value); setHora('') }}
            style={{ colorScheme: 'dark' }}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <p style={label}>Hora</p>
          <select
            value={hora}
            onChange={e => setHora(e.target.value)}
            required
            disabled={!fecha}
          >
            <option value="">-- hora --</option>
            {slots.map(s => {
              const ocupado = turnosDelDia.some(t => t.hora === s)
              return (
                <option key={s} value={s} disabled={ocupado}>
                  {s}{ocupado ? ' (ocupado)' : ''}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      {/* Buscar cliente existente */}
      <div>
        <p style={label}>Cliente</p>
        {selectedCliente ? (
          <div style={{
            background: 'rgba(128,0,32,0.15)', border: '1px solid rgba(128,0,32,0.4)',
            borderRadius: 10, padding: '10px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{selectedCliente.nombre}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,233,216,0.5)' }}>{selectedCliente.tel}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCliente(null)}
              style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18 }}
            >
              ✕
            </button>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Buscar cliente por nombre o tel..."
              value={clienteSearch}
              onChange={e => setClienteSearch(e.target.value)}
            />
            {clientesFiltrados.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                background: '#2a0d14', border: '1px solid rgba(128,0,32,0.4)',
                borderRadius: 10, zIndex: 10, overflow: 'hidden', marginTop: 2,
              }}>
                {clientesFiltrados.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setSelectedCliente(c); setClienteSearch('') }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 14px',
                      background: 'transparent', border: 'none',
                      borderBottom: '1px solid rgba(128,0,32,0.15)',
                      cursor: 'pointer', color: '#f1e9d8',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                    <span style={{ fontSize: 12, color: 'rgba(241,233,216,0.45)', marginLeft: 8 }}>{c.tel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nuevo cliente si no se encontró */}
      {!selectedCliente && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(128,0,32,0.2)',
          borderRadius: 10, padding: '12px',
        }}>
          <p style={{ ...label, marginBottom: 8 }}>O ingresá datos nuevos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              placeholder="Nombre completo"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
            />
            <input
              placeholder="Celular"
              type="tel"
              value={nuevoTel}
              onChange={e => setNuevoTel(e.target.value)}
            />
          </div>
        </div>
      )}

      <div>
        <p style={label}>Actividad (opcional)</p>
        <input
          placeholder="fútbol, entrenamiento, torneo..."
          value={actividad}
          onChange={e => setActividad(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          marginTop: 4,
          background: 'linear-gradient(135deg,#800020,#a00028)',
          color: '#f1e9d8', fontWeight: 700,
          fontSize: 15, letterSpacing: 2, textTransform: 'uppercase',
          border: 'none', borderRadius: 12, padding: '15px 0', cursor: 'pointer',
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? 'Guardando...' : '+ AGREGAR RESERVA'}
      </button>
    </form>
  )
}

const label = {
  margin: '0 0 5px', fontSize: 11,
  color: 'rgba(241,233,216,0.45)', letterSpacing: 0.5, textTransform: 'uppercase',
}
