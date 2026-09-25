import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Connecting',
  description: 'Términos y condiciones de linea-latina.com. Connecting es un agente independiente que conecta usuarios con proveedores participantes de telefonía móvil.',
  alternates: { canonical: 'https://linea-latina.com/terminos' },
}

const sections = [
  {
    title: null,
    highlight: true,
    body: 'Este documento rige el uso de nuestro sitio web. Al navegar en linea-latina.com, el usuario acepta que la información de planes y precios está sujeta a cambios por parte de los proveedores. Nosotros proporcionamos asesoría informativa y técnica, pero el contrato final de servicio se establece entre el cliente y la compañía proveedora seleccionada.\n\nConnecting S.A. de C.V. es un agente independiente de servicios móviles. No somos una compañía de red móvil ni representantes de ningún operador, salvo cuando se indique expresamente. Nuestros agentes atienden llamadas para comparar opciones, verificar disponibilidad y conectar a los usuarios con proveedores participantes.',
    bullets: [
      'No somos el proveedor del servicio: la línea la presta el operador que usted elija.',
      'La disponibilidad, los planes y los precios los fija cada proveedor y varían según la ubicación.',
      'Las marcas y logotipos de terceros pertenecen a sus respectivos titulares.',
    ],
  },
  {
    title: 'Descripción de los Servicios',
    body: 'linea-latina.com actúa como agente independiente de servicios de telecomunicaciones. No prestamos el servicio: facilitamos el acceso a la oferta de los proveedores participantes.\n• Telefonía móvil eSIM o SIM física: planes de voz, texto y datos sobre redes inalámbricas de terceros.\n• Dispositivos con financiamiento: el equipo, su garantía y las condiciones de financiamiento los define y presta el proveedor, no Connecting.\n\nEl alcance de las llamadas y los datos incluidos, así como los destinos cubiertos, los determina el plan del proveedor que usted contrate y se le detallan antes de contratar.',
  },
  {
    title: 'Elegibilidad y Contratación',
    body: 'Para contratar a través de nuestra asesoría, el usuario debe:\n• Ser mayor de 18 años.\n• Residir en una zona donde el proveedor elegido ofrezca cobertura, lo que se verifica antes de contratar.\n• Presentar una identificación oficial vigente; aceptamos pasaporte de cualquier país.\n• Proporcionar información veraz y actualizada durante el proceso de venta telefónica.\n\nAlgunos proveedores consultan el historial crediticio, en particular cuando se financia un equipo. Le informamos si aplica en su caso antes de iniciar el trámite.',
  },
  {
    title: 'Divulgación de Afiliación',
    body: 'linea-latina.com puede recibir una comisión por parte de los proveedores de servicios cuando un usuario realiza una contratación a través de nuestra asesoría. Esto no genera un costo adicional para el usuario y nos permite mantener el servicio de asesoría gratuito.\n\nEsa comisión no condiciona la recomendación: comparamos la oferta de varios proveedores según la cobertura de su zona, su presupuesto y su consumo.',
  },
  {
    title: 'Tarifas, Facturación y Pagos',
    body: 'Todos los precios se muestran en dólares de los Estados Unidos (USD) y corresponden al precio base del plan. Los impuestos locales, estatales y los cargos regulatorios federales se facturan aparte y varían según su estado y el proveedor; no están incluidos en los precios publicados en este sitio.\n\nLa facturación, los métodos de pago y cualquier cargo por activación o equipo los gestiona directamente el proveedor que usted contrate. Le desglosamos el total estimado antes de que contrate.',
  },
  {
    title: 'Consentimiento para Comunicaciones (TCPA)',
    body: 'Solo le contactamos si marcó de forma expresa la casilla de autorización del formulario, que nunca viene premarcada. Esos mensajes tratarán sobre cómo configurar su servicio, ayuda técnica y ofertas especiales. Este consentimiento no es condición para contratar ningún servicio. Si cambia de opinión, puede pedirnos que no le llamemos más respondiendo STOP o llamando al +1 (888) 470-2820, y lo añadiremos a nuestra lista interna de "No llamar".',
  },
  {
    title: 'Limitación de Responsabilidad',
    body: 'linea-latina.com no se hará cargo de:\n• Problemas con el servicio causados por el clima, arreglos en la red o errores en los aparatos del cliente.\n• La pérdida o el daño de información derivado del uso del servicio móvil.\n• La velocidad de datos móviles, que puede variar según la ubicación, cobertura y congestión de la red del operador.',
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
    body: 'Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de los canales oficiales publicados en linea-latina.com o llamando al +1 (888) 470-2820, de lunes a domingo de 8:00 a. m. a 9:00 p. m. (hora central).',
    phone: '+18884702820',
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
                {s.phone && para.includes('+1 (888) 470-2820') ? (
                  <>
                    {para.replace('+1 (888) 470-2820', '')}
                    <a href={`tel:${s.phone}`} style={{ color: '#1D4ED8', fontWeight: 700 }}>+1 (888) 470-2820</a>
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
