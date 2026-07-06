import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Líneas Móviles | Planes 5G para tu Familia',
  description:
    'Planes de líneas móviles 5G desde $55/mes. Sin contratos, soporte en español, activación rápida. Cobertura en el 99% de Estados Unidos para tu familia.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://lineas-moviles.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preload" as="image" href="/images/hablando_por_telefono.webp" />
        {/* Google Ads Consent Mode v2 — must initialize before gtag.js fires */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              var _sc=typeof localStorage!=='undefined'?localStorage.getItem('cookie_consent'):null;
              var _cs=_sc==='granted'?'granted':'denied';
              gtag('consent','default',{ad_storage:_cs,analytics_storage:_cs,ad_user_data:_cs,ad_personalization:_cs,wait_for_update:_sc?0:600});
              gtag('js',new Date());
              gtag('config','AW-18023363833');
            `,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important;}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18023363833"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://files.bpcontent.cloud/2026/04/18/01/20260418013659-Y2Z6AC4H.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
