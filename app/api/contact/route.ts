import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const ContactSchema = z.object({
  name:    z.string().min(2).max(80),
  phone:   z.string().regex(/^\+?1?\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/, 'Teléfono inválido'),
  email:   z.string().email('Correo inválido'),
  address: z.string().min(4).max(200),
  // TCPA: solo se acepta el consentimiento afirmativo, con el texto exacto que vio
  // el usuario y la hora en que lo marco. Es la prueba en caso de reclamacion.
  consent:     z.literal(true),
  consentText: z.string().min(40).max(1000),
  consentAt:   z.iso.datetime(),
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const rateLimitMap = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const window = 15 * 60 * 1000
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + window })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  // Captacion de leads deshabilitada en produccion: la ruta no existe fuera de local.
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta en 15 minutos.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido.' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos.', details: parsed.error.flatten().fieldErrors }, { status: 422 })
  }

  const { name, phone, email, address, consentText, consentAt } = parsed.data
  const sName    = escapeHtml(name)
  const sPhone   = escapeHtml(phone)
  const sEmail   = escapeHtml(email)
  const sAddress = escapeHtml(address)
  const sConsentText = escapeHtml(consentText)
  const sConsentAt   = escapeHtml(consentAt)
  const sIp          = escapeHtml(ip)

  // Sin la clave, el constructor lanza fuera del try y la ruta responde un 500 sin
  // controlar: se comprueba antes para no exponer el fallo interno.
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[/api/contact] falta RESEND_API_KEY')
    return NextResponse.json({ error: 'Servicio de correo no configurado.' }, { status: 503 })
  }
  const leadTo = process.env.LEAD_TO_EMAIL
  if (!leadTo) {
    console.error('[/api/contact] falta LEAD_TO_EMAIL')
    return NextResponse.json({ error: 'Servicio de correo no configurado.' }, { status: 503 })
  }
  // onboarding@resend.dev solo sirve para pruebas: en produccion hace falta un
  // dominio verificado en Resend o los correos no se entregan.
  const leadFrom = process.env.LEAD_FROM_EMAIL ?? 'Líneas Móviles <onboarding@resend.dev>'

  const resend = new Resend(apiKey)

  try {
    // Resend no lanza en errores de API: devuelve { data, error }. Sin mirar `error`
    // el endpoint respondia ok aunque el correo nunca saliera, perdiendo el lead.
    const { error } = await resend.emails.send({
      from: leadFrom,
      to: leadTo,
      subject: `Nuevo lead: ${sName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E5E7EB;border-radius:12px;">
          <h2 style="color:#2563EB;margin-bottom:16px;">Nuevo Lead — Líneas Móviles</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;font-weight:700;color:#374151;width:120px;">Nombre</td><td style="padding:10px 0;color:#111827;">${sName}</td></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 0;font-weight:700;color:#374151;">Teléfono</td><td style="padding:10px 0;"><a href="tel:${sPhone}" style="color:#2563EB;">${sPhone}</a></td></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 0;font-weight:700;color:#374151;">Correo</td><td style="padding:10px 0;"><a href="mailto:${sEmail}" style="color:#2563EB;">${sEmail}</a></td></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 0;font-weight:700;color:#374151;">Dirección</td><td style="padding:10px 0;color:#111827;">${sAddress}</td></tr>
            <tr style="border-top:1px solid #F3F4F6;"><td style="padding:10px 0;font-weight:700;color:#374151;">Fuente</td><td style="padding:10px 0;color:#6B7280;">Lead magnet — ¿No puedes llamar ahora?</td></tr>
          </table>
          <div style="margin-top:20px;padding:14px;background:#F9FAFB;border-left:3px solid #2563EB;border-radius:4px;">
            <p style="margin:0 0 8px;font-weight:700;color:#374151;font-size:.8rem;">Registro de consentimiento (TCPA)</p>
            <p style="margin:0 0 6px;font-size:.72rem;color:#6B7280;">Marcado el <strong>${sConsentAt}</strong> desde IP <strong>${sIp}</strong></p>
            <p style="margin:0;font-size:.7rem;color:#9CA3AF;line-height:1.5;">"${sConsentText}"</p>
          </div>
          <p style="margin-top:20px;font-size:.8rem;color:#9CA3AF;">Contactar en menos de 10 minutos.</p>
        </div>
      `,
    })

    if (error) {
      // El lead se registra en el log para poder recuperarlo a mano si el correo falla.
      console.error('[/api/contact] Resend rechazo el envio:', error, '| lead:', { name, phone, email })
      return NextResponse.json({ error: 'Error al enviar email.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/contact]', err, '| lead:', { name, phone, email })
    return NextResponse.json({ error: 'Error al enviar email.' }, { status: 500 })
  }
}
