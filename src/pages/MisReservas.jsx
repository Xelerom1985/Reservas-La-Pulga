import { formatDateDisplay } from '../utils/slots'

function isUpcoming(fecha, hora) {
  const now = new Date()
  const [h] = hora.split(':').map(Number)
  const d = new Date(`${fecha}T${String(h).padStart(2,'0')}:00:00`)
  return d >= now
}

export default function MisReservas({ turnos }) {
  const user = JSON.parse(localStorage.getItem('reservasUser') || 'null')

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
        <div style={{ padding: '40px 16px', borderBottom: '1px solid rgba(128,0,32,0.2)', background: 'rgba(74,15,27,0.7)', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f1e9d8' }}>Mis Reservas</h2>
        </div>
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(241,233,216,0.4)', fontSize: 14 }}>
            Registrate para ver tus reservas
          </p>
        </div>
      </div>
    )
  }

  const misReservas = turnos
    .filter(t => t.clienteTel === user.tel || t.clienteNombre === user.nombre)
    .sort((a, b) => (a.fecha + a.hora) < (b.fecha + b.hora) ? -1 : 1)

  const proximas = misReservas.filter(t => isUpcoming(t.fecha, t.hora))
  const pasadas = misReservas.filter(t => !isUpcoming(t.fecha, t.hora))

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{
        padding: '40px 16px 16px',
        background: 'rgba(74,15,27,0.7)',
        borderBottom: '1px solid rgba(128,0,32,0.2)',
        marginBottom: 4,
      }}>
        <h2 style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 700, color: '#f1e9d8' }}>Mis Reservas</h2>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>{user.nombre}</p>
      </div>

      <div style={{ padding: '14px 14px' }}>
        {misReservas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <p style={{ color: 'rgba(241,233,216,0.4)', fontSize: 14 }}>
              No tenés reservas aún
            </p>
          </div>
        )}

        {proximas.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 16, background: '#800020', borderRadius: 4 }} />
              <p style={{ margin: 0, fontSize: 11, color: '#800020', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                Próximas
              </p>
            </div>
            {proximas.map(t => (
              <ReservaCard key={t.id} turno={t} upcoming />
            ))}
          </div>
        )}

        {pasadas.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 16, background: 'rgba(128,0,32,0.4)', borderRadius: 4 }} />
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(241,233,216,0.35)', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                Historial
              </p>
            </div>
            {pasadas.map(t => (
              <ReservaCard key={t.id} turno={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ReservaCard({ turno: t, upcoming }) {
  return (
    <div style={{
      background: upcoming ? 'rgba(128,0,32,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${upcoming ? 'rgba(128,0,32,0.35)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 14,
      padding: '14px 16px',
      marginBottom: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 15, color: upcoming ? '#f1e9d8' : 'rgba(241,233,216,0.5)' }}>
            {formatDateDisplay(t.fecha)}
          </p>
          <p style={{ margin: 0, fontSize: 13, color: upcoming ? 'rgba(241,233,216,0.7)' : 'rgba(241,233,216,0.35)' }}>
            {t.hora} hs · 1 hora
          </p>
          {t.actividad && (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: upcoming ? '#800020' : 'rgba(128,0,32,0.5)' }}>
              {t.actividad}
            </p>
          )}
        </div>
        {upcoming && (
          <span style={{
            background: 'rgba(128,0,32,0.3)', color: '#f1e9d8',
            fontSize: 10, fontWeight: 600, letterSpacing: 1,
            padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase',
          }}>
            Confirmada
          </span>
        )}
      </div>
    </div>
  )
}
