import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Connecting',
  description: 'Términos y condiciones de servicio de lineas-moviles.com. Connecting opera como call center autorizado para servicios de telecomunicaciones.',
  alternates: { canonical: 'https://lineas-moviles.com/terminos' },
}

const sections = [
  {
    title: null,
    highlight: true,
    body: 'Este documento rige el uso de nuestro sitio web. Al navegar en lineas-moviles.com, el usuario acepta que la información de planes y precios está sujeta a cambios por parte de los proveedores. Nosotros proporcionamos asesoría informativa y técnica, pero el contrato final de servicio se establece entre el cliente y la compañía proveedora seleccionada.\n\nConnecting opera como call center de atención al cliente para servicios de telefonía móvil. Nuestros agentes autorizados atienden llamadas entrantes para verificar disponibilidad y conectar a los usuarios con proveedores participantes.',
    bullets: ['No somos el proveedor directo del servicio.', 'La disponibilidad y precios pueden variar según ubicación.'],
  },
  {
    title: 'Descripción de los Servicios',
    body: 'lineas-moviles.com actúa como agente independiente de servicios de telecomunicaciones, facilitando el acceso a:\n• Telefonía Móvil E-SIM o SIM Física: Planes de voz, texto y datos mediante redes inalámbricas.\n• Telefonía Móvil y Dispositivos con financiamiento: Planes de redes ilimitadas, llamadas ilimitadas dentro de todo el continente americano.',
  },
  {
    title: 'Elegibilidad y Contratación',
    body: 'Para contratar nuestros servicios, el usuario debe:\n• Ser mayor de 18 años.\n• Residir en una zona con cobertura garantizada (sujeta a verificación técnica).\n• Proporcionar información veraz y actualizada durante el proceso de venta telefónica.',
  },
  {
    title: 'Política de Uso Aceptable',
    body: 'Protegemos tus datos personales conforme a la ley. Los datos recabados en nuestros formularios se utilizan exclusivamente para contactarte y gestionar tu solicitud de servicio.\n\nDivulgación de Afiliación: lineas-moviles.com puede recibir una comisión por parte de los proveedores de servicios cuando un usuario realiza una contratación a través de nuestra plataforma. Esto no genera un costo adicional para el usuario y nos permite mantener nuestro servicio de asesoría gratuito.',
  },
  {
    title: 'Tarifas, Facturación y Pagos',
    body: 'Todos los precios se muestran en dólares de los Estados Unidos (USD) y podrían incluir impuestos de la zona, del estado y cargos del gobierno federal que correspondan.',
  },
  {
    title: 'Consentimiento para Comunicaciones (TCPA)',
    body: 'Cuando nos da su número de teléfono en nuestra página web o en formularios, usted está de acuerdo en que le llamemos o le enviemos mensajes. Estos mensajes tratarán sobre cómo configurar su servicio, ayuda técnica y ofertas especiales. Si cambia de opinión, puede pedirnos que no le llamemos más, y lo añadiremos a nuestra lista interna de "No llamar".',
  },
  {
    title: 'Limitación de Responsabilidad',
    body: 'lineas-moviles.com no se hará cargo de:\n• Problemas con el servicio causados por el clima, arreglos en la red o errores en los aparatos del cliente.\n• La pérdida o el daño de información derivado del uso del servicio móvil.\n• La velocidad de datos móviles, que puede variar según la ubicación, cobertura y congestión de la red del operador.',
  },
  {
    title: 'Privacidad de los Datos',
    body: 'Tu privacidad es muy importante. La información que recogemos en la llamada de venta, como tu nombre y número de teléfono, se guarda de forma muy segura. Solo la compartimos con las compañías de red que necesitan esta información para que puedas usar tu servicio.',
  },
  {
    title: 'Modificaciones de los Términos',
    body: 'Mantenemos nuestros términos actualizados para reflejar cambios en las promociones del mercado. Te invitamos a revisar esta sección periódicamente para conocer las condiciones vigentes que aplicarán a tu navegación.',
  },
  {
    title: 'Contacto',
    body: 'Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de los canales oficiales publicados en lineas-moviles.com o llamando al +1 (888) 861-7317.',
    phone: '+18888617317',
  },
]

export default function TerminosPage() {
  return (
    <>
      <nav style={{ background: 'rgba(255,255,255,.95)', borderBottom: '1px solid #E2E8F0', padding: '16px max(6%, calc((100% - 1280px) / 2))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 700, fontSize: '.92rem' }}>
          ← Volver al inicio
        </Link>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} />
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 2.5rem 80px' }}>
        <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#1D4ED8', marginBottom: '.6rem' }}>Legal</div>
        <h1 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#0F172A', marginBottom: '.5rem', lineHeight: 1.1 }}>
          Términos y Condiciones
        </h1>
        <p style={{ fontSize: '.83rem', color: '#94A3B8', marginBottom: '2.5rem' }}>Última actualización: 2026</p>

        {sections.map((s, i) => (
          <div
            key={i}
            style={{
              background: s.highlight ? '#EFF6FF' : '#fff',
              border: `1px solid ${s.highlight ? '#BFDBFE' : '#E2E8F0'}`,
              borderRadius: 20,
              padding: '2rem 2.2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,.06)',
            }}
          >
            {s.title && (
              <h2 style={{ fontFamily: 'var(--font-cormorant, "Cormorant Garamond", Georgia, serif)', fontSize: '1.35rem', fontWeight: 700, color: '#1D4ED8', marginBottom: '.8rem' }}>
                {s.title}
              </h2>
            )}
            {s.body.split('\n\n').map((para, j) => (
              <p key={j} style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginBottom: '.8rem' }}>
                {s.phone && para.includes('+1 (888) 861-7317') ? (
                  <>
                    {para.replace('+1 (888) 861-7317', '')}
                    <a href={`tel:${s.phone}`} style={{ color: '#1D4ED8', fontWeight: 700 }}>+1 (888) 861-7317</a>
                  </>
                ) : para}
              </p>
            ))}
            {s.bullets && (
              <ul style={{ paddingLeft: '1.4rem', margin: '.5rem 0' }}>
                {s.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.8, marginBottom: '.3rem' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <footer style={{ background: '#0F172A', borderTop: '1px solid #1E293B', padding: '28px max(6%, calc((100% - 1280px) / 2))', textAlign: 'center', fontSize: '.82rem', color: '#475569' }}>
        <Image src="/images/Connecting_logo.webp" alt="Connecting" width={80} height={32} style={{ display: 'block', margin: '0 auto .8rem', filter: 'brightness(10)' }} />
        © 2026 Connecting S.A. de C.V. Todos los derechos reservados. &nbsp;·&nbsp;
        <Link href="/privacidad" style={{ color: '#60A5FA', textDecoration: 'none' }}>Política de Privacidad</Link>
      </footer>
    </>
  )
}
