const express = require("express");
const { Resend } = require("resend");
const { z } = require("zod");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.use(express.json({ limit: "16kb" }));

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "https://linea-latina.com";

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === ALLOWED_ORIGIN || !origin) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiadas solicitudes. Intenta en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const ContactSchema = z.object({
  name:    z.string().min(2).max(80),
  phone:   z.string().regex(/^\+?1?\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}$/, "Teléfono inválido"),
  email:   z.string().email("Correo inválido"),
  address: z.string().min(4).max(200),
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

app.post("/api/contact", contactLimiter, async (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "Datos inválidos.", details: parsed.error.flatten().fieldErrors });
  }

  const { name, phone, email, address } = parsed.data;
  const sName    = escapeHtml(name);
  const sPhone   = escapeHtml(phone);
  const sEmail   = escapeHtml(email);
  const sAddress = escapeHtml(address);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Líneas Móviles <onboarding@resend.dev>",
      to: "danielernestoperezmartinez394@gmail.com",
      subject: `Nuevo lead: ${sName}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #E5E7EB;border-radius:12px;">
          <h2 style="color:#2563EB;margin-bottom:16px;">Nuevo Lead — Líneas Móviles</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;font-weight:700;color:#374151;width:120px;">Nombre</td>
              <td style="padding:10px 0;color:#111827;">${sName}</td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Teléfono</td>
              <td style="padding:10px 0;"><a href="tel:${sPhone}" style="color:#2563EB;">${sPhone}</a></td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Correo</td>
              <td style="padding:10px 0;"><a href="mailto:${sEmail}" style="color:#2563EB;">${sEmail}</a></td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Dirección</td>
              <td style="padding:10px 0;color:#111827;">${sAddress}</td>
            </tr>
            <tr style="border-top:1px solid #F3F4F6;">
              <td style="padding:10px 0;font-weight:700;color:#374151;">Fuente</td>
              <td style="padding:10px 0;color:#6B7280;">Lead magnet — ¿No puedes llamar ahora?</td>
            </tr>
          </table>
          <p style="margin-top:20px;font-size:.8rem;color:#9CA3AF;">Contactar en menos de 10 minutos.</p>
        </div>
      `,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return res.status(500).json({ error: "Error al enviar email." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
