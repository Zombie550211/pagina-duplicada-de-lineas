import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const ContactSchema = z.object({
  name:    z.string().min(2).max(80),
  phone:   z.string().regex(/^\+?1?\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/, 'Teléfono inválido'),
  email:   z.string().email('Correo inválido'),
  address: z.string().min(4).max(200),
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

  const { name, phone, email, address } = parsed.data
  const sName    = escapeHtml(name)
  const sPhone   = escapeHtml(phone)
  const sEmail   = escapeHtml(email)
  const sAddress = escapeHtml(address)

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Líneas Móviles <onboarding@resend.dev>',
      to: 'danielernestoperezmartinez394@gmail.com',
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
          <p style="margin-top:20px;font-size:.8rem;color:#9CA3AF;">Contactar en menos de 10 minutos.</p>
        </div>
      `,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/contact]', err)
    return NextResponse.json({ error: 'Error al enviar email.' }, { status: 500 })
  }
}
