import { useState } from 'react'
import { db, ref, remove, update } from '../firebase'
import { getSlotsForDay, formatDateDisplay } from '../utils/slots'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES = ['D','L','M','M','J','V','S']

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

export default function AdminCalendario({ turnos, config }) {
  const now = new Date()
  const today = toDateStr(now)

  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)
  const [editing, setEditing] = useState(null)
  const [editData, setEditData] = useState({})

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const turnosDelDia = turnos
    .filter(t => t.fecha === selectedDate)
    .sort((a, b) => a.hora > b.hora ? 1 : -1)

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    await remove(ref(db, `turnos/${id}`))
  }

  const handleEdit = (t) => {
    setEditing(t.id)
    setEditData({ fecha: t.fecha, hora: t.hora, actividad: t.actividad || '' })
  }

  const handleSaveEdit = async () => {
    await update(ref(db, `turnos/${editing}`), {
      fecha: editData.fecha,
      hora: editData.hora,
      actividad: editData.actividad || null,
    })
    setEditing(null)
  }

  const slots = getSlotsForDay(config)

  return (
    <div>
      {/* Navegación mes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button onClick={() => setCurrentMonth(new Date(year, month-1, 1))} style={navBtn}>‹</button>
        <span style={{ fontWeight: 700, color: '#f1e9d8', fontSize: 15 }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={() => setCurrentMonth(new Date(year, month+1, 1))} style={navBtn}>›</button>
      </div>

      {/* Cabecera días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 10, padding: '3px 0', color: 'rgba(241,233,216,0.4)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grilla días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 16 }}>
        {Array(firstDayOfWeek).fill(null).map((_,i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_,i) => {
          const day = i+1
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const isSelected = ds === selectedDate
          const isToday = ds === today
          const count = turnos.filter(t => t.fecha === ds).length
          const isFull = count >= slots.length && slots.length > 0

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(ds)}
              style={{
                aspectRatio: '1/1',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 8, gap: 2, padding: 2,
                background: isSelected ? '#800020' : isToday ? 'rgba(128,0,32,0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isSelected ? '#800020' : isToday ? 'rgba(128,0,32,0.5)' : 'rgba(255,255,255,0.05)'}`,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: 12, fontWeight: isToday ? 700 : 400,
                color: isSelected ? '#f1e9d8' : '#f1e9d8',
              }}>
                {day}
              </span>
              {count > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 700, lineHeight: 1,
                  color: isSelected ? '#f1e9d8' : isFull ? '#f87171' : '#800020',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Detalle del día */}
      <div style={{ borderTop: '1px solid rgba(128,0,32,0.25)', paddingTop: 14 }}>
        <p style={{ fontSize: 13, color: '#800020', fontWeight: 600, margin: '0 0 10px' }}>
          {formatDateDisplay(selectedDate)} — {turnosDelDia.length} reserva{turnosDelDia.length !== 1 ? 's' : ''}
        </p>

        {turnosDelDia.length === 0 && (
          <p style={{ color: 'rgba(241,233,216,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
            Sin reservas este día
          </p>
        )}

        {turnosDelDia.map(t => (
          <div key={t.id} style={{
            background: '#1a0509', border: '1px solid rgba(128,0,32,0.25)',
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
          }}>
            {editing === t.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="date" value={editData.fecha} onChange={e => setEditData(p => ({...p, fecha: e.target.value}))} style={{ colorScheme: 'dark' }} />
                  <select value={editData.hora} onChange={e => setEditData(p => ({...p, hora: e.target.value}))}>
                    {slots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <input
                  placeholder="Actividad (opcional)"
                  value={editData.actividad}
                  onChange={e => setEditData(p => ({...p, actividad: e.target.value}))}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSaveEdit} style={btnSmallPrimary}>Guardar</button>
                  <button onClick={() => setEditing(null)} style={btnSmallGray}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>
                    {t.hora} — {t.clienteNombre}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>
                    {t.clienteTel}{t.actividad ? ` · ${t.actividad}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleEdit(t)} style={{ ...btnIcon, color: 'rgba(241,233,216,0.6)' }}>✏️</button>
                  <button onClick={() => handleDelete(t.id)} style={{ ...btnIcon, color: '#f87171' }}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const navBtn = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'rgba(128,0,32,0.2)', border: 'none',
  color: '#f1e9d8', fontSize: 20, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
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
