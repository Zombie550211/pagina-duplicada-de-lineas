import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Connecting',
  description: 'Política de privacidad de linea-latina.com. Conoce cómo protegemos tus datos personales.',
  alternates: { canonical: 'https://linea-latina.com/privacidad' },
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
          { title: null, body: 'Connecting S.A. de C.V. es un agente independiente de servicios móviles: no somos una compañía de red ni prestamos el servicio de telefonía. Este documento explica de qué manera obtenemos, manejamos y resguardamos su información cuando navega en linea-latina.com o solicita nuestra asesoría para contratar con un proveedor participante.' },
          { title: '1. Información que Recopilamos', body: 'Para asesorarle y tramitar su solicitud ante el proveedor que elija, es posible que recopilemos: nombre, número de teléfono, correo electrónico, dirección y los datos de identificación que el proveedor exija para dar de alta la línea.\n\nSi marca la casilla de autorización del formulario, guardamos además el texto exacto que aceptó, la fecha y hora y la dirección IP desde la que se envió, como registro del consentimiento.' },
          { title: '2. Uso de la Información', body: 'Usamos los datos para contactarle, comparar las opciones disponibles en su zona y trasladar su solicitud al proveedor que usted seleccione. El alta de la línea y la relación contractual posterior corresponden a ese proveedor.' },
          { title: '3. Compartición de Datos con Terceros', body: 'No vendemos ni arrendamos sus datos personales a terceros para que ellos los usen por su cuenta.\n\nSí los compartimos con el proveedor o proveedores participantes que usted elija, porque sin ello no pueden evaluar ni activar el servicio, y con los prestadores técnicos que operan nuestros sistemas (correo, alojamiento y analítica), limitados a esa función.\n\nUsamos además cookies publicitarias de Google Ads. Bajo la CCPA de California, ese uso puede considerarse una "venta" o "compartición" de información personal con fines de publicidad conductual, y usted puede oponerse: vea la sección 8.' },
          { title: '4. Seguridad de la Información', body: 'Hemos puesto en marcha medidas de seguridad tanto técnicas como administrativas para resguardar su información de accesos indebidos, extravíos o modificaciones.' },
          {
            title: '5. Derechos del Usuario',
            body: 'Información de Red del Cliente (CPNI): la CPNI —datos sobre sus facturas, destinos de llamadas y uso del servicio— la genera y custodia el operador que le presta la línea, conforme a las leyes federales de EE. UU. Como agente no accedemos a ella; si en algún trámite llegara a nuestras manos, la tratamos con la misma protección y no la usamos con fines de marketing.\n\nExclusión (Opt-Out): usted puede pedirnos en cualquier momento que dejemos de enviarle llamadas promocionales, mensajes de texto o correos de marketing. Lo añadiremos a nuestra lista interna de No Llamar.',
          },
          {
            title: '6. Uso de Cookies y Publicidad',
            body: 'Nuestro sitio utiliza cookies funcionales (para recordar preferencias), analíticas (para entender interacciones) y publicitarias (Google Ads, para mostrar anuncios relevantes basados en sus visitas). Puede optar por no recibir publicidad personalizada visitando google.com/settings/ads o aboutads.info.',
          },
          {
            title: '7. Consentimiento TCPA',
            body: 'Solo le contactamos si marcó de forma expresa la casilla de autorización en nuestro formulario. Esa casilla nunca viene premarcada y sin ella no procesamos la solicitud. Al marcarla, usted autoriza a Connecting S.A. de C.V. y a los proveedores participantes a contactarle al número que facilitó mediante llamadas y mensajes de texto (SMS), incluidos sistemas automatizados o mensajes pregrabados, con fines comerciales. Este consentimiento no es condición para contratar ningún servicio. Guardamos el texto exacto que usted aceptó junto con la fecha, la hora y la dirección IP desde la que se envió, como registro de la autorización. Puede revocarla en cualquier momento respondiendo STOP a un mensaje o llamando al +1 (888) 470-2820, y le añadiremos a nuestra lista interna de No Llamar. Aplican tarifas de mensajes y datos.',
          },
          {
            title: '8. Residentes de California (CCPA/CPRA)',
            body: 'Si reside en California, la CCPA le reconoce el derecho a saber qué información personal recopilamos sobre usted y con qué fin, a solicitar una copia, a pedir su eliminación, a corregir datos inexactos y a no sufrir trato discriminatorio por ejercer cualquiera de estos derechos.\n\nNo vendemos su información personal a cambio de dinero. Sin embargo, las cookies publicitarias de Google Ads que usamos para mostrarle anuncios relevantes pueden constituir una "venta" o una "compartición" para publicidad conductual según la definición amplia de la ley.\n\nPara oponerse, use el enlace "No vender mis datos (CCPA)" del pie de página del sitio: desactiva esas cookies en su navegador y revoca el consentimiento publicitario. También puede ejercer cualquiera de los derechos anteriores llamando al +1 (888) 470-2820, de lunes a domingo de 8:00 a. m. a 9:00 p. m. (hora central). Responderemos en los plazos que marca la ley y podemos pedirle datos para verificar su identidad antes de atender la solicitud.',
          },
          {
            title: '9. Conservación y Contacto',
            body: 'Conservamos los datos de contacto y el registro de consentimiento durante el tiempo necesario para gestionar su solicitud y para acreditar la autorización frente a una eventual reclamación, y después los eliminamos o anonimizamos.\n\nPara cualquier duda sobre esta política, o para ejercer sus derechos de acceso, corrección, eliminación u oposición, llame al +1 (888) 470-2820, de lunes a domingo de 8:00 a. m. a 9:00 p. m. (hora central).',
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
