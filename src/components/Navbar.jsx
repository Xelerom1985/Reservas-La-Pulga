const items = [
  {
    id: 'home',
    label: 'Inicio',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'misreservas',
    label: 'Mis Reservas',
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Admin',
    adminOnly: true,
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function Navbar({ page, setPage, authed }) {
  const visible = items.filter(i => !i.adminOnly || authed)

  return (
    <nav className="safe-area-bottom" style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(10,2,4,0.94)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(128,0,32,0.25)',
      display: 'flex',
      zIndex: 40,
    }}>
      {visible.map(item => {
        const active = page === item.id
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px 10px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#f1e9d8' : 'rgba(241,233,216,0.3)',
              transition: 'color 0.15s',
              gap: 3,
              position: 'relative',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
            {active && (
              <span style={{
                position: 'absolute', bottom: 0,
                width: 28, height: 2,
                background: 'rgba(241,233,216,0.6)',
                borderRadius: '2px 2px 0 0',
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
