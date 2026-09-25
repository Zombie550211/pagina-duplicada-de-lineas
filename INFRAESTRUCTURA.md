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

El texto vive en un solo sitio, `TCPA_CONSENT_TEXT` (`app/page.tsx`). Cambiarlo invalida los
consentimientos recogidos bajo la versión anterior, así que se versiona, no se edita a la ligera.

## Seguridad

`next.config.ts` emite HSTS, CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`
y `Permissions-Policy`; `poweredByHeader` desactivado. Amplify no inyecta ninguna por su cuenta.
Fuera de local, el CSP no incluye los dominios de Botpress.

## Reglas de enrutado en Amplify

Una sola, creada el 25 de septiembre de 2026:

```
https://www.linea-latina.com  →  https://linea-latina.com   301
```

Antes había heredada una regla `/<*>` → `/index.html` con estado `404-200`: la plantilla de un
sitio estático tipo SPA, que convertía cualquier ruta inexistente en un 200 con la portada —un
soft-404 que Google penaliza— y que además apuntaba al `index.html` ya eliminado. Se quitó. Next
gestiona sus propias 404 en `WEB_COMPUTE`; **no reintroducir esa regla.**

Verificado en producción: `www` responde 301 al apex, el apex 200 y una ruta inexistente 404.

## Coherencia del contenido publicitario

Auditado el 25 de septiembre de 2026. La landing afirmaba cosas que sus propios textos legales y
su FAQ desmentían; todo eso se corrigió en el mismo pase:

- El soporte se anunciaba **24/7** en cuatro sitios mientras el footer declaraba el horario real.
  Ahora hay una sola fuente de verdad, `SUPPORT_HOURS` en `app/page.tsx`: **Lun–Dom 8AM–9PM CT**.
  Si cambia el horario de la operación, se cambia ahí y se propaga a stats, beneficios, planes y
  footer. Los Términos y la Privacidad lo repiten en prosa: hay que tocarlos a mano.
- **"Sin data caps"** contradecía el FAQ, que sí revela la priorización de red. Manda el FAQ: la
  FTC obliga a revelar el throttling, no a esconderlo.
- **Superlativos de red** ("la red 5G más rápida", "hasta 1 Gbps") eran incompatibles con
  presentarse como agente neutral de varios proveedores. Fuera. No se reintroducen: un agente no
  puede reclamar el rendimiento de una red que no opera.
- Los **legales hablaban en primera persona como si Connecting fuese el operador** ("activar su
  línea", "call center autorizado"). Reescritos como agente. Esto es exactamente el patrón de
  tergiversación por el que Google Ads suspende cuentas.
- Los Términos decían que el precio **podía incluir impuestos**; la landing los factura aparte.
  Manda la landing: precio base del plan, impuestos y cargos regulatorios por separado.
- El botón **"No vender mis datos (CCPA)"** ejercía un derecho que la Política de Privacidad no
  documentaba, y esa política además afirmaba no compartir datos. Añadida la sección 8 (CCPA/CPRA)
  y corregida la 3.

Los duplicados muertos (`index.html`, `terminos.html`, `privacidad.html` y `fanpage/`) se
eliminaron en el mismo commit. Next 16 no los servía, pero contenían precios viejos y claims ya
retirados: material publicitario listo para publicarse por accidente. **La única fuente es `app/`.**

## Credenciales de AWS en esta máquina

Dos perfiles, y el que sirve **no es el que está por defecto**:

| Perfil | Usuario IAM | Alcance |
|---|---|---|
| `default` | `crm-migration` | solo el CRM. No ve Route 53 ni Amplify |
| `connecting` | `connecting-deploy` | Route 53, ACM, S3, CloudFront y Amplify |

Para tocar DNS o hosting: `export AWS_PROFILE=connecting`. Con el perfil por defecto todo
responde `AccessDenied`, que parece falta de permisos en la cuenta y no lo es.

## Correo: el dominio no envía

Cerrado el 25 de septiembre de 2026. La zona no tiene MX —el dominio no recibe correo— y
tampoco envía, así que la postura es de rechazo total:

```
linea-latina.com          TXT  "v=spf1 -all"
_dmarc.linea-latina.com   TXT  "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s"
```

Sin `rua=`: ese campo publica un buzón en un registro DNS consultable por cualquiera. La
protección funciona igual; solo no llegan los informes agregados.

**`-all` prohíbe todo envío desde el dominio.** El día que se verifique `linea-latina.com` en
Resend para `LEAD_FROM_EMAIL`, este registro bloqueará esos correos: hay que pasarlo a
`v=spf1 include:_spf.resend.com -all` en el mismo cambio, no después.

## Deuda técnica

1. **Rate limit en memoria.** `app/api/contact/route.ts` usa un `Map` por instancia: inservible en
   el compute serverless si algún día se reactiva la ruta en producción. Mitigación: regla
   rate-based de AWS WAF o un contador en DynamoDB.
2. **MFA pendiente en el usuario raíz de AWS.** Esa cuenta aloja además el CRM y su RDS.
3. **`www` sigue sirviendo contenido duplicado en los otros 7 dominios.** Ver abajo.

## Los demás dominios de la cuenta

La cuenta `964060772387` aloja 8 zonas de landings, todas servidas por CloudFront:
`linea-latina.com`, `planeslineasmoviles.com`, `lineas-moviles.com`, `asistenteinternet.com`,
`speed-internet.com`, `offers-mobile.com`, `internetparatuhogar.com` y `tumovilplan.com`.

Auditadas el 25 de septiembre de 2026: **ninguna tenía SPF ni DMARC, ninguna tenía MX y en todas
`www` servía el mismo contenido que el apex en paralelo.** El problema no era de esta landing,
era de la cuenta entera.

**SPF y DMARC: cerrado en las 8 el 25 de septiembre de 2026.** Ninguna recibe correo, así que a
todas les aplicó el mismo par de registros, con una excepción: `speed-internet.com` ya tenía un
TXT de verificación de Search Console en el apex. Ahí el SPF se añadió **al mismo recordset**,
como segundo valor. Un `UPSERT` reemplaza el recordset entero: crear el SPF sin arrastrar el
valor existente habría borrado la verificación y tumbado la propiedad en Search Console. Antes de
tocar un TXT de apex hay que leer lo que ya hay.

Queda pendiente `www` → apex en las otras siete. No es copiar y pegar como el DNS: cada una
cuelga de una distribución de CloudFront distinta y la redirección 301 necesita una CloudFront
Function, para la que `connecting-deploy` tiene denegado `CreateFunction`. La excepción fue
`linea-latina.com`, que al estar en Amplify se resolvió con una custom rule sin permisos extra.

### Zona basura

La cuenta tiene una novena hosted zone llamada `servidordecrm\100gmail.com` — una dirección de
correo creada como si fuese un dominio. No resuelve nada y cuesta $0.50/mes. Conviene borrarla
tras confirmar que ningún registro apunta ahí.

## El CRM es otro sistema

El CRM vive en `agentes-49dr.onrender.com`, **sigue en Render** y es independiente de esta
landing. Desde el 24 de septiembre de 2026 esta landing ya no lo invoca: la ruta que lo hacía
(`/api/chatbot-lead`) se eliminó junto con el chatbot, y con ella el uso de `WEBHOOK_LINEAS_KEY`.
