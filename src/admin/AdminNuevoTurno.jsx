import { useState } from 'react'
import { db, ref, push, set } from '../firebase'
import { getSlotsForDay, formatDateDisplay } from '../utils/slots'

export default function AdminNuevoTurno({ clientes, turnos, config }) {
  const [fecha, setFecha] = useState('')
  const [horaDesde, setHoraDesde] = useState('')
  const [horaHasta, setHoraHasta] = useState('')
  const [clienteSearch, setClienteSearch] = useState('')
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoTel, setNuevoTel] = useState('')
  const [actividad, setActividad] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const slots = getSlotsForDay(config)
  const turnosDelDia = turnos.filter(t => t.fecha === fecha)

  // Para horaHasta solo mostrar horas posteriores a horaDesde
  const slotsHasta = horaDesde
    ? slots.filter(s => s > horaDesde)
    : []

  // Calcular cuántas horas se van a reservar
  const horasSeleccionadas = () => {
    if (!horaDesde) return []
    const fin = horaHasta || null
    if (!fin) return [horaDesde]
    const result = []
    for (const s of slots) {
      if (s >= horaDesde && s < fin) result.push(s)
    }
    return result
  }

  const horas = horasSeleccionadas()

  // Verificar si alguna hora ya está ocupada
  const conflictos = horas.filter(h => turnosDelDia.some(t => t.hora === h))

  const clientesFiltrados = clienteSearch.length > 1
    ? clientes.filter(c =>
        c.nombre?.toLowerCase().includes(clienteSearch.toLowerCase()) ||
        c.tel?.includes(clienteSearch)
      ).slice(0, 6)
    : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fecha || !horaDesde) return alert('Elegí fecha y hora de inicio')

    const nombre = selectedCliente?.nombre || nuevoNombre.trim()
    const tel = selectedCliente?.tel || nuevoTel.trim()
    if (!nombre || !tel) return alert('Completá nombre y celular')

    if (conflictos.length > 0) {
      return alert(`Los siguientes horarios ya están ocupados: ${conflictos.join(', ')}`)
    }

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

      // Crear una reserva por cada hora del rango
      for (const hora of horas) {
        const newRef = push(ref(db, 'turnos'))
        await set(newRef, {
          fecha,
          hora,
          clienteNombre: nombre,
          clienteTel: tel,
          actividad: actividad.trim() || null,
          createdAt: Date.now(),
        })
      }

      setDone(true)
      setTimeout(() => {
        setDone(false)
        setFecha(''); setHoraDesde(''); setHoraHasta('')
        setClienteSearch(''); setSelectedCliente(null)
        setNuevoNombre(''); setNuevoTel(''); setActividad('')
      }, 2500)
    } catch {
      alert('Error al guardar.')
    }
    setSaving(false)
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <p style={{ color: '#f1e9d8', fontWeight: 700, marginTop: 12, fontSize: 16 }}>
          {horas.length > 1 ? `${horas.length} reservas agregadas` : 'Reserva agregada'}
        </p>
        {horas.length > 1 && (
          <p style={{ color: 'rgba(241,233,216,0.45)', fontSize: 13 }}>
            {horas[0]} — {horaHasta}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: '0 0 4px', fontSize: 13, color: '#800020', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
        Nueva reserva manual
      </p>

      {/* Fecha */}
      <div>
        <p style={labelStyle}>Fecha</p>
        <input
          type="date"
          value={fecha}
          onChange={e => { setFecha(e.target.value); setHoraDesde(''); setHoraHasta('') }}
          style={{ colorScheme: 'dark' }}
          required
        />
      </div>

      {/* Hora desde / hasta */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={labelStyle}>Hora desde</p>
          <select
            value={horaDesde}
            onChange={e => { setHoraDesde(e.target.value); setHoraHasta('') }}
            required
            disabled={!fecha}
          >
            <option value="">-- inicio --</option>
            {slots.map(s => {
              const ocupado = turnosDelDia.some(t => t.hora === s)
              return (
                <option key={s} value={s}>
                  {s}{ocupado ? ' ✗' : ''}
                </option>
              )
            })}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <p style={labelStyle}>Hora hasta (opcional)</p>
          <select
            value={horaHasta}
            onChange={e => setHoraHasta(e.target.value)}
            disabled={!horaDesde}
          >
            <option value="">-- 1 hora --</option>
            {slotsHasta.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview del rango */}
      {horas.length > 0 && (
        <div style={{
          background: conflictos.length > 0 ? 'rgba(248,113,113,0.1)' : 'rgba(128,0,32,0.12)',
          border: `1px solid ${conflictos.length > 0 ? 'rgba(248,113,113,0.4)' : 'rgba(128,0,32,0.35)'}`,
          borderRadius: 10, padding: '10px 14px',
        }}>
          {conflictos.length > 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: '#f87171' }}>
              ⚠️ Conflicto en: {conflictos.join(', ')}
            </p>
          ) : (
            <p style={{ margin: 0, fontSize: 13, color: '#f1e9d8' }}>
              ✓ {horas.length} {horas.length === 1 ? 'hora' : 'horas'}: {horas[0]}{horas.length > 1 ? ` → ${horaHasta}` : ''}
              {fecha && <span style={{ color: 'rgba(241,233,216,0.45)', marginLeft: 6 }}>· {formatDateDisplay(fecha)}</span>}
            </p>
          )}
        </div>
      )}

      {/* Buscar cliente existente */}
      <div>
        <p style={labelStyle}>Cliente</p>
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
          <p style={{ ...labelStyle, marginBottom: 8 }}>O ingresá datos nuevos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input placeholder="Nombre completo" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} />
            <input placeholder="Celular" type="tel" value={nuevoTel} onChange={e => setNuevoTel(e.target.value)} />
          </div>
        </div>
      )}

      <div>
        <p style={labelStyle}>Actividad (opcional)</p>
        <input
          placeholder="fútbol, entrenamiento, torneo..."
          value={actividad}
          onChange={e => setActividad(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={saving || conflictos.length > 0}
        style={{
          marginTop: 4,
          background: 'linear-gradient(135deg,#800020,#a00028)',
          color: '#f1e9d8', fontWeight: 700,
          fontSize: 15, letterSpacing: 2, textTransform: 'uppercase',
          border: 'none', borderRadius: 12, padding: '15px 0', cursor: 'pointer',
          opacity: (saving || conflictos.length > 0) ? 0.5 : 1,
        }}
      >
        {saving ? 'Guardando...' : horas.length > 1 ? `+ AGREGAR ${horas.length} HORAS` : '+ AGREGAR RESERVA'}
      </button>
    </form>
  )
}

const labelStyle = {
  margin: '0 0 5px', fontSize: 11,
  color: 'rgba(241,233,216,0.45)', letterSpacing: 0.5, textTransform: 'uppercase',
}
