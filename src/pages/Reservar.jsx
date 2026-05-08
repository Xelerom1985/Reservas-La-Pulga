import { useState } from 'react'
import { db, ref, push, set } from '../firebase'
import { getSlotsForDay, isDayClosed, formatDateDisplay } from '../utils/slots'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAY_NAMES = ['D','L','M','M','J','V','S']

export default function Reservar({ onBack, turnos, config }) {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedHora, setSelectedHora] = useState(null)
  const [actividad, setActividad] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [regNombre, setRegNombre] = useState('')
  const [regTel, setRegTel] = useState('')

  const user = JSON.parse(localStorage.getItem('reservasUser') || 'null')

  const turnosDelDia = turnos.filter(t => t.fecha === selectedDate)
  const slots = getSlotsForDay(config)

  const slotDisponibilidad = slots.map(hora => ({
    hora,
    ocupado: turnosDelDia.some(t => t.hora === hora),
  }))

  const handleConfirm = async () => {
    const currentUser = user || (regNombre && regTel ? { nombre: regNombre, tel: regTel } : null)
    if (!currentUser) return

    if (!user && regNombre && regTel) {
      localStorage.setItem('reservasUser', JSON.stringify({ nombre: regNombre.trim(), tel: regTel.trim() }))
      const cleanTel = regTel.replace(/\D/g, '') || String(Date.now())
      set(ref(db, `clientes/${cleanTel}`), {
        nombre: regNombre.trim(),
        tel: regTel.trim(),
        createdAt: Date.now(),
      })
    }

    setSaving(true)
    try {
      const newRef = push(ref(db, 'turnos'))
      await set(newRef, {
        fecha: selectedDate,
        hora: selectedHora,
        clienteNombre: currentUser.nombre,
        clienteTel: currentUser.tel,
        actividad: actividad.trim() || null,
        createdAt: Date.now(),
      })
      setDone(true)
    } catch {
      alert('Error al guardar. Intentá de nuevo.')
    }
    setSaving(false)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: '#f1e9d8', textAlign: 'center', margin: '0 0 4px', fontSize: 24, fontWeight: 700 }}>
          ¡Reserva confirmada!
        </h2>
        <p style={{ color: 'rgba(241,233,216,0.5)', fontSize: 13, marginBottom: 20 }}>
          Recordá pagar la seña mínima de $10.000
        </p>
        <div style={{
          background: '#1a0509', border: '1px solid rgba(128,0,32,0.35)',
          borderRadius: 16, padding: '18px 20px', width: '100%', maxWidth: 310, marginBottom: 24,
        }}>
          {[
            ['Día', formatDateDisplay(selectedDate)],
            ['Hora', `${selectedHora} — ${selectedHora.replace(':00', '')}:59`],
            ['Nombre', user?.nombre || regNombre],
          ].map(([label, val]) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid rgba(128,0,32,0.15)',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
            </div>
          ))}
          {actividad && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>Actividad</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{actividad}</span>
            </div>
          )}
        </div>
        <button onClick={onBack} style={btnPrimary}>
          Volver al inicio
        </button>
      </div>
    )
  }

  const stepTitles = ['', 'Elegir día', 'Elegir horario', 'Confirmar reserva']

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 24 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: '1px solid rgba(128,0,32,0.2)',
        background: 'rgba(26,5,9,0.6)',
      }}>
        <button
          onClick={step > 1 ? () => setStep(s => s - 1) : onBack}
          style={{ background: 'none', border: 'none', color: 'rgba(241,233,216,0.6)', fontSize: 24, cursor: 'pointer', padding: 0, lineHeight: 1 }}
        >
          ←
        </button>
        <h2 style={{ color: '#f1e9d8', margin: 0, fontSize: 18, fontWeight: 700 }}>
          {stepTitles[step]}
        </h2>
      </div>

      {/* Barra de progreso */}
      <div style={{ display: 'flex', gap: 4, padding: '10px 16px 0' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: s <= step ? '#800020' : 'rgba(128,0,32,0.2)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ padding: '16px' }}>

        {/* Paso 1: Calendario */}
        {step === 1 && (
          <CalendarPicker
            config={config}
            turnos={turnos}
            onSelect={date => { setSelectedDate(date); setStep(2) }}
          />
        )}

        {/* Paso 2: Horarios */}
        {step === 2 && (
          <div>
            <p style={{ fontSize: 13, color: 'rgba(241,233,216,0.5)', marginTop: 0, marginBottom: 14 }}>
              {formatDateDisplay(selectedDate)}
            </p>
            {slotDisponibilidad.length === 0 ? (
              <p style={{ color: 'rgba(241,233,216,0.35)', textAlign: 'center', marginTop: 32, fontSize: 14 }}>
                Sin horarios disponibles este día
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {slotDisponibilidad.map(({ hora, ocupado }) => (
                  <button
                    key={hora}
                    disabled={ocupado}
                    onClick={() => { setSelectedHora(hora); setStep(3) }}
                    style={{
                      padding: '14px 0', borderRadius: 12,
                      background: ocupado ? 'rgba(255,255,255,0.03)' : 'rgba(128,0,32,0.15)',
                      border: `1px solid ${ocupado ? 'rgba(255,255,255,0.06)' : 'rgba(128,0,32,0.4)'}`,
                      color: ocupado ? 'rgba(241,233,216,0.2)' : '#f1e9d8',
                      fontWeight: 600, fontSize: 15,
                      cursor: ocupado ? 'not-allowed' : 'pointer', lineHeight: 1.3,
                    }}
                  >
                    {hora}
                    {ocupado && (
                      <span style={{ display: 'block', fontSize: 10, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>
                        Ocupado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {step === 3 && (
          <div>
            {/* Resumen */}
            <div style={{
              background: '#1a0509', border: '1px solid rgba(128,0,32,0.3)',
              borderRadius: 14, padding: 16, marginBottom: 14,
            }}>
              <p style={{ color: '#800020', margin: '0 0 10px', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                Resumen
              </p>
              {[
                ['Día', formatDateDisplay(selectedDate)],
                ['Hora', `${selectedHora} — ${selectedHora.replace(':00', '')}:59`],
              ].map(([label, val]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid rgba(128,0,32,0.12)',
                }}>
                  <span style={{ fontSize: 13, color: 'rgba(241,233,216,0.45)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: 12 }}>
                <input
                  placeholder="Actividad (opcional): fútbol, entrenamiento..."
                  value={actividad}
                  onChange={e => setActividad(e.target.value)}
                />
              </div>
            </div>

            {/* Datos del usuario */}
            {user ? (
              <div style={{
                background: '#1a0509', border: '1px solid rgba(128,0,32,0.2)',
                borderRadius: 12, padding: '12px 16px', marginBottom: 14,
              }}>
                <p style={{ fontSize: 11, color: 'rgba(241,233,216,0.4)', margin: '0 0 4px', letterSpacing: 1 }}>
                  RESERVA A NOMBRE DE
                </p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{user.nombre}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(241,233,216,0.5)' }}>{user.tel}</p>
              </div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: 'rgba(241,233,216,0.55)', marginBottom: 10 }}>
                  Completá tus datos:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    placeholder="Tu nombre"
                    value={regNombre}
                    onChange={e => setRegNombre(e.target.value)}
                  />
                  <input
                    placeholder="Tu celular"
                    type="tel"
                    value={regTel}
                    onChange={e => setRegTel(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Aviso de pago */}
            <div style={{
              background: 'rgba(128,0,32,0.1)', border: '1px solid rgba(128,0,32,0.25)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 14,
            }}>
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,233,216,0.6)', lineHeight: 1.5 }}>
                💳 Recordá transferir la seña mínima de <strong>$10.000</strong> al alias{' '}
                <strong style={{ color: '#f1e9d8' }}>estela.21.mebel.35</strong>
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={saving || (!user && (!regNombre || !regTel))}
              style={{
                ...btnPrimary,
                width: '100%',
                opacity: (saving || (!user && (!regNombre || !regTel))) ? 0.5 : 1,
              }}
            >
              {saving ? 'Guardando...' : '✓ CONFIRMAR RESERVA'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

function CalendarPicker({ config, turnos, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const canGoPrev = currentMonth > new Date(today.getFullYear(), today.getMonth(), 1)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))} disabled={!canGoPrev}
          style={{ ...navBtn, opacity: canGoPrev ? 1 : 0.25 }}>‹</button>
        <span style={{ fontWeight: 700, color: '#f1e9d8', fontSize: 16 }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))} style={navBtn}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAY_NAMES.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: 11, padding: '4px 0',
            color: i === 0 ? 'rgba(241,233,216,0.2)' : 'rgba(241,233,216,0.4)',
          }}>
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1
          const date = new Date(year, month, day)
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isPast = date < today
          const closed = isDayClosed(dateStr, config)
          const isToday = date.getTime() === today.getTime()
          const disabled = isPast || closed
          const count = turnos.filter(t => t.fecha === dateStr).length
          const slots = getSlotsForDay(config)
          const isFull = count >= slots.length && slots.length > 0

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              style={{
                aspectRatio: '1/1',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                borderRadius: 10, fontSize: 13, gap: 2,
                fontWeight: isToday ? 700 : 400,
                background: isToday ? 'rgba(128,0,32,0.25)' : closed ? 'rgba(248,113,113,0.06)' : 'transparent',
                border: `1px solid ${isToday ? 'rgba(128,0,32,0.6)' : closed ? 'rgba(248,113,113,0.15)' : 'transparent'}`,
                color: disabled ? 'rgba(241,233,216,0.15)' : '#f1e9d8',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
              {count > 0 && !disabled && (
                <span style={{
                  fontSize: 9, fontWeight: 700, lineHeight: 1,
                  color: isFull ? '#f87171' : '#800020',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 12, justifyContent: 'center' }}>
        <span style={{ fontSize: 10, color: 'rgba(241,233,216,0.3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#800020' }} />
          Cantidad de reservas
        </span>
      </div>
    </div>
  )
}

const navBtn = {
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: '50%', background: 'rgba(128,0,32,0.15)', border: 'none',
  color: '#f1e9d8', fontSize: 22, cursor: 'pointer',
}

const btnPrimary = {
  background: 'linear-gradient(135deg,#800020,#a00028)',
  color: '#f1e9d8', fontWeight: 700,
  fontSize: 15, letterSpacing: 2, textTransform: 'uppercase',
  border: 'none', cursor: 'pointer', borderRadius: 12, padding: '16px 0',
  boxShadow: '0 4px 20px rgba(128,0,32,0.35)',
}
