import type { NextConfig } from 'next'

// Amplify Hosting no inyecta cabeceras de seguridad: se emiten desde la app.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  {
    // gtag y Botpress requieren inline/eval: se restringe todo lo demas.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.botpress.cloud https://files.bpcontent.cloud",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google.com https://www.google.com.mx https://googleads.g.doubleclick.net https://files.bpcontent.cloud",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.botpress.cloud https://*.bpcontent.cloud wss://*.botpress.cloud",
      "frame-src https://td.doubleclick.net https://www.googletagmanager.com https://*.botpress.cloud",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
