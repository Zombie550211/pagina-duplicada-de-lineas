# Migración Render → AWS Amplify Hosting

Dominio: `lineas-moviles.com` · App: Next.js 16 (SSR + API routes) · Repo: `Zombie550211/pagina-duplicada-de-lineas`

## Estado de origen (verificado)

| Recurso | Valor actual |
|---|---|
| Registrador / DNS | Hostinger (`helios.dns-parking.com`, `aster.dns-parking.com`) |
| Apex `A` | `216.24.57.1` (Render) |
| `www` `CNAME` | `page-lineas-moviles-wl2f.onrender.com` |
| API legacy | `lineas-moviles-api.onrender.com` (Express `api.js`) — se apaga |
| CRM webhook | `agentes-49dr.onrender.com` — **no se toca**, es servicio externo |

## Bloqueo conocido: apex + DNS externo

Amplify no expone IP fija; entrega un target CloudFront que requiere `ALIAS`/`ANAME` en el apex.
Hostinger DNS **no soporta ALIAS en el apex**. Dos salidas:

- **Ruta A (recomendada):** mover solo la zona DNS a Route 53 (el dominio sigue registrado en Hostinger).
  Alias A en apex → Amplify. Cero cambios en canonical, sitemap ni URLs finales de Google Ads.
- **Ruta B (DNS en Hostinger):** `www` pasa a ser el host canónico. Obliga a actualizar
  `alternates.canonical` en `app/layout.tsx`, las URLs finales de las campañas de Ads y la
  propiedad de Search Console. El apex queda sin resolver salvo que Hostinger habilite redirección.

## 1. Preparación del repo (hecho)

- `amplify.yml` — build spec (`npm ci` + `next build`, caché de `node_modules` y `.next/cache`).
- `next.config.ts` — HSTS, CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `poweredByHeader: false`. Amplify no inyecta cabeceras de seguridad por sí solo.
- `index.html` — el formulario ya no llama a Render: `fetch('/api/contact')` same-origin.

## 2. Crear la app en Amplify

1. Consola AWS → Amplify → **Create new app** → GitHub → repo `pagina-duplicada-de-lineas`, rama `main`.
2. Amplify detecta Next.js SSR y provisiona plataforma `WEB_COMPUTE`. Confirmar que el build spec
   detectado es el `amplify.yml` del repo.
3. Región: `us-east-1` (menor latencia al tráfico US de las campañas).

## 3. Variables de entorno (Amplify → App settings → Environment variables)

| Clave | Valor |
|---|---|
| `RESEND_API_KEY` | (mismo valor que en Render) |
| `WEBHOOK_LINEAS_KEY` | (mismo valor que en Render) |
| `NODE_ENV` | `production` |

Sin `WEBHOOK_LINEAS_KEY` la ruta `/api/chatbot-lead` responde 503 y se pierden los leads del chatbot.

## 4. Verificación en la URL de Amplify (antes de tocar DNS)

- [ ] `https://main.<appid>.amplifyapp.com` carga la landing.
- [ ] `POST /api/contact` con payload válido → `{"ok":true}` y llega el email.
- [ ] `POST /api/chatbot-lead` → relay al CRM responde 200.
- [ ] `curl -sI` muestra `strict-transport-security` y `content-security-policy`.
- [ ] Botpress, gtag y las fuentes cargan sin errores de CSP en consola.
- [ ] Lighthouse móvil: LCP < 2.5s, CLS < 0.1.

## 5. Dominio custom

**Ruta A — zona en Route 53**
1. Route 53 → Hosted zone `lineas-moviles.com`. Replicar todos los registros actuales de Hostinger
   (especialmente MX y TXT/SPF del correo — si se pierden, se cae el email del dominio).
2. Amplify → Domain management → añadir `lineas-moviles.com` + subdominio `www`. Amplify crea los
   registros en Route 53 automáticamente y emite el certificado ACM.
3. En Hostinger, cambiar los nameservers a los 4 de la hosted zone.

**Ruta B — zona en Hostinger**
1. Amplify → Domain management → añadir solo `www.lineas-moviles.com`.
2. En Hostinger crear el `CNAME` de validación ACM que muestre Amplify y el `CNAME`
   `www` → target de Amplify. Borrar el `CNAME` `www` → Render.
3. Actualizar canonical a `https://www.lineas-moviles.com` y las URLs finales en Google Ads.

## 6. Cutover

1. **24h antes:** bajar el TTL de los registros del dominio a 300s en Hostinger.
2. Cambiar los registros (o los NS en la Ruta A).
3. Validar propagación: `dig +short lineas-moviles.com A` y `dig +short www.lineas-moviles.com`.
4. Mantener el servicio de Render **encendido 48h** como rollback.
5. Verificar en Google Ads que las conversiones `AW-18023363833` siguen registrando.

## 7. Limpieza (tras 48h estables)

- Suspender el web service `lineas-moviles` en Render.
- Suspender `lineas-moviles-api` (Express) — ya no lo llama nadie.
- Borrar `render.yaml` y `api.js` del repo.
- Restaurar el TTL a 3600s.

## Deuda técnica detectada

1. **Rate limit inefectivo en serverless.** `app/api/contact/route.ts` guarda el contador en un `Map`
   en memoria; en el compute de Amplify cada instancia tiene el suyo y se reciclan. Mitigación:
   regla rate-based de AWS WAF sobre la distribución de Amplify, o DynamoDB como contador.
2. **`index.html` duplica `app/page.tsx`.** Next 16 no sirve el HTML de la raíz: la página en
   producción es `app/page.tsx`. El commit `c2917c0` (conversión de formulario de leads) se aplicó
   solo a `index.html`, así que **la página real no dispara la conversión `AW-18023363833/vhjLCP…`
   al enviar el formulario** — solo `lead_magnet_submit`.
3. **`api.js`** replica `app/api/contact/route.ts` en Express. Código muerto tras el cutover.
