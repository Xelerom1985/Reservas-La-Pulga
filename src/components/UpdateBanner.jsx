export default function UpdateBanner({ onUpdate }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 70,
      left: 12,
      right: 12,
      background: '#4a0f1b',
      border: '1px solid rgba(128,0,32,0.6)',
      borderRadius: 12,
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 180,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: '#f1e9d8' }}>
        Nueva versión disponible
      </p>
      <button
        onClick={onUpdate}
        style={{
          background: '#800020',
          color: '#f1e9d8',
          border: 'none',
          borderRadius: 8,
          padding: '7px 14px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: 0.5,
        }}
      >
        Actualizar
      </button>
    </div>
  )
}
