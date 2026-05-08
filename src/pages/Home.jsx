export default function Home({ novedades, onReservar }) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: 'rgba(74,15,27,0.9)',
        backdropFilter: 'blur(8px)',
        padding: '44px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <img
          src="/logo.png"
          alt="La Pulga"
          style={{
            width: 56, height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 0 20px rgba(128,0,32,0.4)',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(241,233,216,0.55)', letterSpacing: 3, textTransform: 'uppercase' }}>
            Club Social y Deportivo
          </p>
          <h1 style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 700, color: '#f1e9d8', lineHeight: 1.2 }}>
            21 de Septiembre
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,233,216,0.45)' }}>
            Reserva de cancha de fútbol
          </p>
        </div>
      </div>

      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Novedades */}
        {novedades.length > 0 && (
          <div style={{
            background: 'rgba(26,5,9,0.88)',
            border: '1px solid rgba(128,0,32,0.35)',
            borderRadius: 16,
            padding: '14px 16px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 4, height: 18, background: '#800020', borderRadius: 4 }} />
              <p style={{ margin: 0, fontSize: 11, color: '#800020', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                Novedades
              </p>
            </div>
            {novedades.map(n => (
              <div key={n.id} style={{
                background: 'rgba(128,0,32,0.1)',
                border: '1px solid rgba(128,0,32,0.2)',
                borderRadius: 10,
                padding: '10px 12px',
                marginBottom: 8,
              }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: '#f1e9d8' }}>
                  {n.texto}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Botón Reservar */}
        <div style={{
          background: 'rgba(26,5,9,0.88)',
          border: '1px solid rgba(128,0,32,0.3)',
          borderRadius: 16,
          padding: '20px 16px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 4, height: 18, background: '#800020', borderRadius: 4 }} />
            <p style={{ margin: 0, fontSize: 11, color: '#800020', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
              Reservar cancha
            </p>
          </div>
          <button
            onClick={onReservar}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#800020,#a00028,#800020)',
              color: '#f1e9d8',
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 2,
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 14,
              padding: '18px 0',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(128,0,32,0.4)',
            }}
          >
            ⚽ RESERVAR
          </button>
          <p style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'rgba(241,233,216,0.35)',
            marginTop: 10,
            marginBottom: 0,
          }}>
            Turnos de 1 hora · Elegí día y horario
          </p>
        </div>

        {/* Footer: MercadoPago + WhatsApp */}
        <div style={{
          background: 'rgba(26,5,9,0.88)',
          border: '1px solid rgba(128,0,32,0.2)',
          borderRadius: 16,
          padding: '16px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          {/* MercadoPago */}
          <a
            href="https://mpago.la/2UaHMYT"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: '#009ee3',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(0,158,227,0.3)',
            }}>
              <svg width="28" height="28" viewBox="0 0 50 50" fill="white">
                <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 42C13.4 44 4 34.6 4 23s9.4-21 21-21 21 9.4 21 21-9.4 21-21 21zm-2-30h-6l-4 16h5l1-4h4l1 4h5l-4-16h-2zm-3 8l1-5h2l1 5h-4zm16-8h-5l-3 16h5l3-16z"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, color: 'rgba(241,233,216,0.5)', letterSpacing: 0.5, textAlign: 'center' }}>
              Transferir
            </span>
            <span style={{ fontSize: 10, color: 'rgba(241,233,216,0.35)', letterSpacing: 0.5, textAlign: 'center' }}>
              estela.21.mebel.35
            </span>
            <span style={{ fontSize: 10, color: '#800020', fontWeight: 600, textAlign: 'center' }}>
              Mínimo $10.000
            </span>
          </a>

          <div style={{ width: 1, height: 60, background: 'rgba(241,233,216,0.08)' }} />

          {/* WhatsApp */}
          <a
            href="https://wa.me/5491160231431"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: '#25D366',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(37,211,102,0.3)',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <span style={{ fontSize: 10, color: 'rgba(241,233,216,0.5)', letterSpacing: 0.5, textAlign: 'center' }}>
              Contacto
            </span>
            <span style={{ fontSize: 10, color: 'rgba(241,233,216,0.35)', letterSpacing: 0.5, textAlign: 'center' }}>
              +54 9 11 6023-1431
            </span>
          </a>
        </div>

      </div>
    </div>
  )
}
