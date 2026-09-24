import type { NextConfig } from 'next'

// Amplify Hosting no inyecta cabeceras de seguridad: se emiten desde la app.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  {
    // gtag requiere inline/eval: se restringe todo lo demas.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google.com https://www.google.com.mx https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://td.doubleclick.net https://stats.g.doubleclick.net",
      // pagead2 recibe las conversiones de Ads (/ccm/collect): sin el, gtag las pierde
      // en silencio y la campana deja de medir.
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://td.doubleclick.net https://stats.g.doubleclick.net https://www.google.com",
      "frame-src https://td.doubleclick.net https://www.googletagmanager.com",
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
