import { useState } from 'react'

export default function LockButton({ authed, onLogin, onLogout, adminPass }) {
  const [open, setOpen] = useState(false)
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [permanent, setPermanent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pass === adminPass) {
      onLogin(permanent)
      setOpen(false)
      setPass('')
      setError(false)
      setPermanent(false)
    } else {
      setError(true)
    }
  }

  return (
    <>
      <button
        onClick={() => authed ? onLogout() : setOpen(true)}
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 50,
          width: 44,
          height: 44,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(26,5,9,0.7)',
          border: `1px solid rgba(128,0,32,${authed ? '0.6' : '0.3'})`,
          cursor: 'pointer',
          fontSize: 20,
          opacity: authed ? 1 : 0.6,
          backdropFilter: 'blur(8px)',
        }}
      >
        {authed ? '🔓' : '🔒'}
      </button>

      {open && (
        <div
          onClick={() => { setOpen(false); setPass(''); setError(false) }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#1a0509',
              border: '1px solid rgba(128,0,32,0.5)',
              borderRadius: 20,
              padding: 24,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <h2 style={{ color: '#f1e9d8', textAlign: 'center', margin: '0 0 4px', fontSize: 20, fontWeight: 700 }}>
              Acceso Admin
            </h2>
            <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(128,0,32,0.6),transparent)', margin: '10px 0 20px' }} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="PIN"
                value={pass}
                onChange={e => { setPass(e.target.value); setError(false) }}
                autoFocus
              />
              {error && (
                <p style={{ color: '#f87171', fontSize: 13, textAlign: 'center', margin: 0 }}>
                  PIN incorrecto
                </p>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={permanent}
                  onChange={e => setPermanent(e.target.checked)}
                  style={{ width: 'auto', padding: 0, border: 'none', background: 'transparent' }}
                />
                <span style={{ color: 'rgba(241,233,216,0.65)' }}>Recordar en este dispositivo</span>
              </label>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg,#800020,#a00028)',
                  color: '#f1e9d8',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 10,
                  padding: '13px 0',
                  cursor: 'pointer',
                  marginTop: 4,
                }}
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
