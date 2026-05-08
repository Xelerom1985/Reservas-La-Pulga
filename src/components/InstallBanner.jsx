export default function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 70,
      left: 12,
      right: 12,
      background: '#1a0509',
      border: '1px solid rgba(128,0,32,0.5)',
      borderRadius: 14,
      padding: '14px 16px',
      zIndex: 180,
      boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
    }}>
      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#f1e9d8' }}>
        Instalar app
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(241,233,216,0.5)' }}>
        Agregá Reservas La Pulga a tu pantalla de inicio
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onInstall}
          style={{
            flex: 1, background: 'linear-gradient(135deg,#800020,#a00028)',
            color: '#f1e9d8', border: 'none', borderRadius: 8,
            padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Instalar
        </button>
        <button
          onClick={onDismiss}
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)',
            color: 'rgba(241,233,216,0.6)', border: 'none', borderRadius: 8,
            padding: '10px 0', fontSize: 13, cursor: 'pointer',
          }}
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}
