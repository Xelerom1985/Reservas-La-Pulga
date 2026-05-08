import { useState, useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { db, ref, onValue } from './firebase'
import Home from './pages/Home'
import Reservar from './pages/Reservar'
import MisReservas from './pages/MisReservas'
import Admin from './pages/Admin'
import LockButton from './components/LockButton'
import Navbar from './components/Navbar'
import UpdateBanner from './components/UpdateBanner'
import InstallBanner from './components/InstallBanner'
import RegisterModal from './components/RegisterModal'

const ADMIN_PASS = '2109'
const STORAGE_KEY = 'reservasPermanentAdmin'

export default function App() {
  const [page, setPage] = useState('home')
  const [authed, setAuthed] = useState(false)
  const [novedades, setNovedades] = useState([])
  const [turnos, setTurnos] = useState([])
  const [config, setConfig] = useState(null)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)
  const [exitToast, setExitToast] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const pageRef = useRef(page)
  const lastBackRef = useRef(null)

  useEffect(() => { pageRef.current = page }, [page])

  // Back button handler
  useEffect(() => {
    history.pushState(null, '')
    const handlePop = () => {
      if (pageRef.current !== 'home') {
        setPage('home')
        history.pushState(null, '')
      } else {
        const now = Date.now()
        if (lastBackRef.current && now - lastBackRef.current < 2000) return
        lastBackRef.current = now
        history.pushState(null, '')
        setExitToast(true)
        setTimeout(() => setExitToast(false), 2000)
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW()

  // Install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setShowInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstall(false)
      setInstallPrompt(null)
    }
  }

  // Auto-login admin
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') setAuthed(true)
  }, [])

  // Check first-time user
  useEffect(() => {
    const user = localStorage.getItem('reservasUser')
    if (!user) {
      const timer = setTimeout(() => setShowRegister(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  // Firebase subscriptions
  useEffect(() => {
    const u1 = onValue(ref(db, 'novedades'), snap => {
      const d = snap.val() || {}
      setNovedades(
        Object.entries(d)
          .map(([id, v]) => ({ id, ...v }))
          .filter(n => n.activo)
          .sort((a, b) => b.createdAt - a.createdAt)
      )
    })
    const u2 = onValue(ref(db, 'turnos'), snap => {
      const d = snap.val() || {}
      setTurnos(Object.entries(d).map(([id, v]) => ({ id, ...v })))
    })
    const u3 = onValue(ref(db, 'config'), snap => {
      setConfig(snap.val() || {})
    })
    return () => { u1(); u2(); u3() }
  }, [])

  const handleLogin = (permanent) => {
    setAuthed(true)
    if (permanent) localStorage.setItem(STORAGE_KEY, 'true')
  }

  const handleLogout = () => {
    setAuthed(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const handleRegisterSave = (nombre, tel) => {
    localStorage.setItem('reservasUser', JSON.stringify({ nombre, tel }))
    setShowRegister(false)
  }

  const showNavbar = page !== 'reservar'

  return (
    <div style={{ minHeight: '100vh', background: '#0d0306', color: '#f1e9d8', position: 'relative' }}>
      <LockButton authed={authed} onLogin={handleLogin} onLogout={handleLogout} adminPass={ADMIN_PASS} />

      {page === 'home' && (
        <Home
          novedades={novedades}
          onReservar={() => setPage('reservar')}
        />
      )}
      {page === 'reservar' && (
        <Reservar
          onBack={() => setPage('home')}
          turnos={turnos}
          config={config}
        />
      )}
      {page === 'misreservas' && (
        <MisReservas turnos={turnos} />
      )}
      {page === 'admin' && authed && (
        <Admin />
      )}
      {page === 'admin' && !authed && (
        <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
          <p style={{ color: 'rgba(241,233,216,0.35)', fontSize: 14 }}>
            Usá el candado para acceder
          </p>
        </div>
      )}

      {showNavbar && (
        <Navbar page={page} setPage={setPage} authed={authed} />
      )}

      {needRefresh && (
        <UpdateBanner onUpdate={() => updateServiceWorker(true)} />
      )}

      {showInstall && (
        <InstallBanner
          onInstall={handleInstall}
          onDismiss={() => setShowInstall(false)}
        />
      )}

      {showRegister && (
        <RegisterModal onSave={handleRegisterSave} />
      )}

      {exitToast && (
        <div style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(26,5,9,0.96)', border: '1px solid rgba(128,0,32,0.4)',
          borderRadius: 8, padding: '10px 20px', zIndex: 200,
          color: 'rgba(241,233,216,0.85)', fontSize: 13,
          whiteSpace: 'nowrap',
        }}>
          Presioná de nuevo para salir
        </div>
      )}
    </div>
  )
}
