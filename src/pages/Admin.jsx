import { useState, useEffect } from 'react'
import { db, ref, onValue } from '../firebase'
import AdminCalendario from '../admin/AdminCalendario'
import AdminClientes from '../admin/AdminClientes'
import AdminNuevoTurno from '../admin/AdminNuevoTurno'
import AdminNovedades from '../admin/AdminNovedades'

const TABS = [
  { id: 'calendario', label: '📅 Calendario' },
  { id: 'nuevo', label: '➕ Nueva' },
  { id: 'clientes', label: '👤 Clientes' },
  { id: 'novedades', label: '📢 Novedades' },
]

export default function Admin() {
  const [tab, setTab] = useState('calendario')
  const [turnos, setTurnos] = useState([])
  const [clientes, setClientes] = useState([])
  const [novedades, setNovedades] = useState([])
  const [config, setConfig] = useState({})

  useEffect(() => {
    const u1 = onValue(ref(db, 'turnos'), snap => {
      const d = snap.val() || {}
      setTurnos(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u2 = onValue(ref(db, 'clientes'), snap => {
      const d = snap.val() || {}
      setClientes(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u3 = onValue(ref(db, 'novedades'), snap => {
      const d = snap.val() || {}
      setNovedades(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u4 = onValue(ref(db, 'config'), snap => {
      setConfig(snap.val() || {})
    })
    return () => { u1(); u2(); u3(); u4() }
  }, [])

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{
        padding: '40px 16px 14px',
        background: 'rgba(74,15,27,0.7)',
        borderBottom: '1px solid rgba(128,0,32,0.2)',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#f1e9d8', margin: 0, fontSize: 20, fontWeight: 700 }}>
          Panel Admin
        </h2>
      </div>

      {/* Tabs en 2 filas */}
      <div style={{ borderBottom: '1px solid rgba(128,0,32,0.2)' }}>
        <div style={{ display: 'flex' }}>
          {TABS.slice(0, 2).map(t => (
            <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid rgba(128,0,32,0.1)' }}>
          {TABS.slice(2).map(t => (
            <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => setTab(t.id)} />
          ))}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {tab === 'calendario' && <AdminCalendario turnos={turnos} config={config} />}
        {tab === 'clientes' && <AdminClientes clientes={clientes} />}
        {tab === 'nuevo' && <AdminNuevoTurno clientes={clientes} turnos={turnos} config={config} />}
        {tab === 'novedades' && <AdminNovedades novedades={novedades} />}
      </div>
    </div>
  )
}

function TabButton({ tab, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '13px 4px',
        background: 'transparent', border: 'none',
        borderBottom: `2px solid ${active ? '#800020' : 'transparent'}`,
        color: active ? '#f1e9d8' : 'rgba(241,233,216,0.4)',
        fontSize: 13, fontWeight: active ? 600 : 400,
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'color 0.15s',
      }}
    >
      {tab.label}
    </button>
  )
}
