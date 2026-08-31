# Migración Render → AWS Amplify Hosting

Dominio: `linea-latina.com` · App: Next.js 16 (SSR + API routes) · Repo: `Zombie550211/pagina-duplicada-de-lineas`

## Estado de origen (verificado)

| Recurso | Valor |
|---|---|
| Servicio Render | `pagina-duplicada-de-lineas2` (`srv-d8sqiarsq97s73e5goag`), plan Standard — **Suspended** |
| Registrador / DNS | Hostinger (`solar.dns-parking.com`, `lunar.dns-parking.com`) |
| Apex `A` | `216.24.57.1` (Render) → responde **503** |
| `www` `CNAME` | `pagina-duplicada-de-lineas2.onrender.com` → responde **503** |
| Env vars en Render | solo `PORT=10000` |
| CRM webhook | `agentes-49dr.onrender.com` — **no se toca**, servicio externo vivo |

`lineas-moviles.com` es **otro** servicio de Render (`page-lineas-moviles-wl2f`), fuera del alcance de este repo.

## Credenciales: no existían en Render

El servicio solo tenía `PORT`. En producción eso significaba:

- `/api/contact` → 500 en cada envío (falta `RESEND_API_KEY`)
- `/api/chatbot-lead` → 503 (falta `WEBHOOK_LINEAS_KEY`)

Ninguno de los dos formularios capturaba leads. `RESEND_API_KEY` se crea nueva en
`resend.com → API Keys → Create API Key` (permiso *Sending access*); Resend no permite
recuperar una clave existente. `WEBHOOK_LINEAS_KEY` es la clave compartida que valida el CRM:
su valor de origen está en el `.env` de `CRM_CONNECTING`.

## Cuenta AWS

| Dato | Valor |
|---|---|
| Cuenta | `964060772387` |
| Región | `us-east-2` (Ohio) |
| IAM CLI | `crm-migration` — **sin permisos de Amplify, ACM, Route 53 ni CloudFront** |
| Infra existente | EC2 `crm-connecting-backend` + RDS MySQL (el CRM) — no se toca |

La app se crea desde la consola con la cuenta admin: la IAM del CLI no puede, y la conexión con
GitHub requiere el OAuth que solo se completa en la consola.

## Bloqueo conocido: apex + DNS externo

Amplify no expone IP fija; el apex necesita `ALIAS`/`ANAME` hacia CloudFront y **Hostinger no lo
soporta**. Dos salidas:

- **Ruta A (recomendada):** mover la zona DNS a Route 53 (el dominio sigue registrado en Hostinger).
  Alias A en el apex → Amplify. `linea-latina.com` sigue siendo el host canónico.
- **Ruta B:** `www.linea-latina.com` pasa a canónico vía CNAME. Obliga a actualizar el canonical
  del código, las URLs finales de Google Ads y Search Console.

## 1. Preparación del repo (hecho)

- `amplify.yml` — build spec (`npm ci` + `next build`, caché de `node_modules` y `.next/cache`).
- `next.config.ts` — HSTS, CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `poweredByHeader: false`. Amplify no inyecta cabeceras de seguridad por sí solo.
- `index.html` — el formulario usa `/api/contact` same-origin; sin dependencia de Render.
- Identidad de dominio corregida: canonical, términos y privacidad decían `lineas-moviles.com`
  (dominio ajeno). Riesgo de desindexación y de desaprobación en Google Ads. Ahora `linea-latina.com`.

## 2. Crear la app en Amplify

1. Consola → Amplify (región **us-east-2**) → **Deploy an app** → GitHub → repo
   `pagina-duplicada-de-lineas`, rama `main`.
2. Nombre: `linea-latina`. Amplify detecta Next.js SSR y provisiona `WEB_COMPUTE`.
3. Rol de servicio: **crear uno nuevo** (logs SSR en CloudWatch).
4. **No abrir "Editar archivo YML"**: guardarlo fija una copia en consola con precedencia sobre
   el `amplify.yml` del repo.

## 3. Variables de entorno

| Clave | Valor |
|---|---|
| `RESEND_API_KEY` | clave nueva de Resend |
| `WEBHOOK_LINEAS_KEY` | la que valida el CRM |
| `NODE_ENV` | `production` |

Se pueden añadir después del primer deploy; un **Redeploy this version** las activa.

## 4. Verificación en la URL de Amplify (antes de tocar DNS)

- [ ] `https://main.<appid>.amplifyapp.com` carga la landing.
- [ ] `POST /api/contact` con payload válido → `{"ok":true}` y llega el email.
- [ ] `POST /api/chatbot-lead` → relay al CRM responde 200.
- [ ] `curl -sI` muestra `strict-transport-security` y `content-security-policy`.
- [ ] Botpress, gtag y las fuentes cargan sin errores de CSP en consola.
- [ ] Lighthouse móvil: LCP < 2.5s, CLS < 0.1.

## 5. Dominio y cutover

1. **24h antes:** bajar el TTL a 300s en Hostinger.
2. Amplify → Domain management → añadir `linea-latina.com` + `www`, y crear en el DNS los
   registros que indique (validación ACM incluida). Borrar los registros que apuntan a Render.
3. Validar: `dig +short linea-latina.com A` y `dig +short www.linea-latina.com`.
4. Verificar en Google Ads que las conversiones `AW-18023363833` siguen registrando.

## 6. Limpieza (tras 48h estables)

- Eliminar el servicio `pagina-duplicada-de-lineas2` en Render.
- Borrar `render.yaml` y `api.js` del repo.
- Restaurar el TTL a 3600s.

## Deuda técnica detectada

1. **Rate limit inefectivo en serverless.** `app/api/contact/route.ts` guarda el contador en un `Map`
   en memoria; en el compute de Amplify cada instancia tiene el suyo y se reciclan. Mitigación:
   regla rate-based de AWS WAF, o DynamoDB como contador.
2. **`index.html` duplica `app/page.tsx`.** Next 16 no sirve el HTML de la raíz: la página en
   producción es `app/page.tsx`. El commit `c2917c0` (conversión de formulario) se aplicó solo a
   `index.html`, así que **la página real no dispara la conversión `AW-18023363833/vhjLCP…`** al
   enviar el formulario: solo `lead_magnet_submit`.
3. **`api.js`** replica `app/api/contact/route.ts` en Express. Código muerto tras el cutover.
