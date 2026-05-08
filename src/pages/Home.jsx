import { useState } from 'react'

const ALIAS = 'estela.21.mebel.35'

export default function Home({ novedades, onReservar }) {
  const [copied, setCopied] = useState(false)

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(ALIAS).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: 'rgba(74,15,27,0.85)',
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
            width: 62, height: 62,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.25)',
            boxShadow: '0 0 20px rgba(128,0,32,0.4)',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,233,216,0.55)', letterSpacing: 3, textTransform: 'uppercase' }}>
            Club Social y Deportivo
          </p>
          <h1 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 700, color: '#f1e9d8', lineHeight: 1.2 }}>
            21 de Septiembre
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,233,216,0.45)' }}>
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
              <p style={{ margin: 0, fontSize: 13, color: '#800020', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
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
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: '#f1e9d8' }}>
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
            <p style={{ margin: 0, fontSize: 13, color: '#800020', fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
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
              fontSize: 19,
              letterSpacing: 2,
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 14,
              padding: '20px 0',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(128,0,32,0.4)',
            }}
          >
            ⚽ RESERVAR
          </button>
          <p style={{
            textAlign: 'center',
            fontSize: 13,
            color: 'rgba(241,233,216,0.4)',
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
          padding: '18px 16px',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'stretch',
        }}>
          {/* MercadoPago */}
          <button
            onClick={handleCopyAlias}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1 }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: copied ? '#00b359' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: copied ? '0 2px 12px rgba(0,179,89,0.4)' : 'none',
              transition: 'background 0.3s',
              overflow: 'hidden',
            }}>
              {copied ? (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <img src="/mercado.png" alt="MercadoPago" style={{ width: 56, height: 56, objectFit: 'contain' }} />
              )}
            </div>
            <span style={{ fontSize: 12, color: copied ? '#00b359' : 'rgba(241,233,216,0.6)', textAlign: 'center', transition: 'color 0.3s' }}>
              {copied ? '¡Copiado!' : 'Transferir'}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(241,233,216,0.4)', textAlign: 'center' }}>
              {ALIAS}
            </span>
            <span style={{ fontSize: 11, color: '#800020', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Reserva mínima $10.000
            </span>
          </button>

          <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(241,233,216,0.08)', margin: '0 8px' }} />

          {/* WhatsApp */}
          <a
            href="https://wa.me/5491160231431"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textDecoration: 'none', flex: 1 }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: '#25D366',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(37,211,102,0.3)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <span style={{ fontSize: 12, color: 'rgba(241,233,216,0.6)', textAlign: 'center' }}>
              Contacto
            </span>
            <span style={{ fontSize: 12, color: '#f1e9d8', fontWeight: 600, textAlign: 'center' }}>
              Stella
            </span>
            <span style={{ fontSize: 11, color: 'rgba(241,233,216,0.4)', textAlign: 'center' }}>
              +54 9 11 6023-1431
            </span>
          </a>
        </div>

      </div>
    </div>
  )
}
