# Infraestructura — linea-latina.com

Migrado de Render a AWS el 31 de agosto de 2026. Render ya no interviene en el hosting.

## Dónde vive

| Pieza | Valor |
|---|---|
| Dominio | `linea-latina.com` (+ `www`) |
| Hosting | AWS Amplify Hosting, app `d315xicjzn1gix`, región `us-east-2` |
| Plataforma | `WEB_COMPUTE` — Next.js 16 con SSR y API routes |
| CDN + TLS | CloudFront con certificado ACM `*.linea-latina.com` |
| DNS | Route 53 (hosted zone propia) |
| Registrador | Hostinger — solo registro y renovación; los NS apuntan a AWS |
| Cuenta AWS | `964060772387` |
| Repo | `Zombie550211/pagina-duplicada-de-lineas`, rama `main` |

Nameservers delegados: `ns-656.awsdns-18.net`, `ns-76.awsdns-09.com`,
`ns-1796.awsdns-32.co.uk`, `ns-1109.awsdns-10.org`.

**No revertir los nameservers a Hostinger:** su zona antigua sigue apuntando a un servicio de
Render suspendido y tumbaría el sitio.

## Despliegue

Push a `main` → Amplify construye y publica solo. El build spec es `amplify.yml` del repo;
no editarlo desde la consola, porque una copia guardada ahí tiene precedencia sobre el del
repositorio.

Variable de entorno en Amplify: `NODE_ENV=production`.

## Captación de leads: solo en local

El formulario existe en el código pero **no se compila ni se sirve en producción**. Está atado a
`NODE_ENV`, no a una variable de la consola, así que no se puede activar por accidente desde
Amplify.

| Elemento | Producción | `npm run dev` |
|---|---|---|
| Sección del formulario | no se renderiza | funciona |
| `/api/contact` | 404 | funciona |

El chatbot de Botpress se eliminó por completo el 24 de septiembre de 2026 (scripts, CSS, relay
de leads, dominios en la CSP y la ruta `/api/chatbot-lead`, que quedó sin consumidores).

En local, `/api/contact` necesita `RESEND_API_KEY`, `LEAD_TO_EMAIL` y opcionalmente
`LEAD_FROM_EMAIL`. Copia `.env.example` a `.env.local`; nunca pongas claves en el repo.
`onboarding@resend.dev` solo entrega correo a la cuenta dueña de Resend: para un buzón
corporativo hay que verificar el dominio en Resend.

La única conversión medible en producción es el clic a teléfono (`phone_call_click`), con el tag
`AW-18023363833`.

### Consentimiento TCPA

El formulario exige una casilla marcada de forma expresa, nunca premarcada, y el servidor la
valida con `z.literal(true)`. Cada lead archiva el texto exacto que el usuario aceptó, la marca de
tiempo y la IP: TCPA obliga a **demostrar** el consentimiento, no solo a pedirlo.

El texto vive duplicado en `TCPA_CONSENT_TEXT` (`app/page.tsx`) y en el markup de `index.html`, y
debe permanecer idéntico en ambos. Cambiarlo invalida los consentimientos recogidos bajo la
versión anterior, así que se versiona, no se edita a la ligera.

## Seguridad

`next.config.ts` emite HSTS, CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
y `Permissions-Policy`; `poweredByHeader` desactivado. Amplify no inyecta ninguna por su cuenta.
Fuera de local, el CSP no incluye los dominios de Botpress.

## Deuda técnica

1. **`index.html` duplica `app/page.tsx`.** Next 16 no sirve el HTML de la raíz: la página real es
   `app/page.tsx`. El commit `c2917c0` metió la conversión de formulario solo en `index.html`.
   Hoy da igual —no hay formulario en producción—, pero los dos archivos siguen divergiendo.
2. **Rate limit en memoria.** `app/api/contact/route.ts` usa un `Map` por instancia: inservible en
   el compute serverless si algún día se reactiva la ruta en producción. Mitigación: regla
   rate-based de AWS WAF o un contador en DynamoDB.
3. **`www` no redirige al apex**, sirve el mismo contenido en paralelo: contenido duplicado para
   Google. Se configura en Amplify → Dominios personalizados.
4. **Sin SPF ni DMARC** en la zona. Cualquiera puede falsificar correo desde `@linea-latina.com`.
   Se resuelve con dos registros TXT en Route 53:
   `linea-latina.com TXT "v=spf1 -all"` y
   `_dmarc.linea-latina.com TXT "v=DMARC1; p=reject; rua=mailto:<tu-correo>"`.
5. **MFA pendiente en el usuario raíz de AWS.** Esa cuenta aloja además el CRM y su RDS.

## El CRM es otro sistema

El CRM vive en `agentes-49dr.onrender.com`, **sigue en Render** y es independiente de esta
landing. Desde el 24 de septiembre de 2026 esta landing ya no lo invoca: la ruta que lo hacía
(`/api/chatbot-lead`) se eliminó junto con el chatbot, y con ella el uso de `WEBHOOK_LINEAS_KEY`.
