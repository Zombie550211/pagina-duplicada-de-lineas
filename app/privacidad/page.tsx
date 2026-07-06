import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Connecting',
  description: 'Política de privacidad de lineas-moviles.com. Conoce cómo protegemos tus datos personales.',
  alternates: { canonical: 'https://lineas-moviles.com/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <>
      <nav style={{ background: 'rgba(255,255,255,.95)', borderBottom: '1px solid #E2E8F0', padding: '16px max(6%, calc((100% - 1280px) / 2))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 700, fontSize: '.92rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Volver al inicio
        </Link>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} />
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 2.5rem 80px' }}>
        <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#1D4ED8', marginBottom: '.6rem' }}>Legal</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#0F172A', marginBottom: '.5rem', lineHeight: 1.1 }}>
          Política de Privacidad
        </h1>
        <p style={{ fontSize: '.83rem', color: '#94A3B8', marginBottom: '2.5rem' }}>Última actualización: 2026</p>

        {[
          { title: null, body: 'En lineas-moviles.com, nos preocupamos por su privacidad y nos dedicamos a cuidar sus datos personales. Este documento explica de qué manera obtenemos, manejamos y resguardamos su información cuando navega en nuestro sitio web o usa nuestros servicios de telefonía móvil en Estados Unidos.' },
          { title: '1. Información que Recopilamos', body: 'Para brindarle nuestros servicios de telecomunicaciones, es posible que recopilemos: nombre, número de teléfono, correo electrónico e identificación necesaria para activar su línea móvil.' },
          { title: '2. Uso de la Información', body: 'Usamos los datos que recopilamos para tramitar sus pedidos de servicio y habilitar sus líneas móviles.' },
          { title: '3. Compartición de Datos con Terceros', body: 'No comercializamos ni arrendamos sus datos personales a otras empresas.' },
          { title: '4. Seguridad de la Información', body: 'Hemos puesto en marcha medidas de seguridad tanto técnicas como administrativas para resguardar su información de accesos indebidos, extravíos o modificaciones.' },
          {
            title: '5. Derechos del Usuario',
            body: 'Privacidad de la Información de Red del Cliente (CPNI): Protegemos su CPNI (datos sobre sus facturas, destinos de llamadas, etc.) de acuerdo con las leyes federales de EE. UU.\n\nExclusión (Opt-Out): Usted puede solicitar dejar de recibir llamadas promocionales o correos electrónicos de marketing en cualquier momento.',
          },
          {
            title: '6. Uso de Cookies y Publicidad',
            body: 'Nuestro sitio utiliza cookies funcionales (para recordar preferencias), analíticas (para entender interacciones) y publicitarias (Google Ads, para mostrar anuncios relevantes basados en sus visitas). Puede optar por no recibir publicidad personalizada visitando google.com/settings/ads o aboutads.info.',
          },
          {
            title: '7. Consentimiento TCPA',
            body: 'Al proporcionar su número de teléfono en nuestros formularios, usted autoriza expresamente a Connecting a contactarle mediante llamadas telefónicas y/o mensajes de texto (SMS) automatizados o preregistrados, relativos a nuestros servicios de telecomunicaciones. Este consentimiento no es condición para la compra de ningún servicio. Puede revocar su consentimiento en cualquier momento llamando al +1 (888) 861-7317. Aplican tarifas de mensajes y datos.',
          },
        ].map((card, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 20, padding: '2rem 2.2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            {card.title && (
              <h2 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: '1.35rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '.8rem' }}>
                {card.title}
              </h2>
            )}
            {card.body.split('\n\n').map((para, j) => (
              <p key={j} style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginBottom: '.8rem' }}>{para}</p>
            ))}
          </div>
        ))}
      </div>

      <footer style={{ background: '#0F172A', borderTop: '1px solid #1E293B', padding: '28px max(6%, calc((100% - 1280px) / 2))', textAlign: 'center', fontSize: '.82rem', color: '#475569' }}>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} style={{ display: 'block', margin: '0 auto .8rem', filter: 'brightness(10)' }} />
        © 2026 Connecting S.A. de C.V. Todos los derechos reservados. &nbsp;·&nbsp;
        <Link href="/terminos" style={{ color: '#60A5FA', textDecoration: 'none' }}>Términos y Condiciones</Link>
      </footer>
    </>
  )
}
