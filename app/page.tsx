'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

// Captacion de leads (formulario + chatbot) solo en desarrollo local.
// En el build de produccion NODE_ENV es 'production' y todo esto sale del bundle.
const LEAD_TOOLS = process.env.NODE_ENV !== 'production'

// TCPA: el consentimiento debe ser expreso, por escrito y demostrable. Este texto
// es el que ve el usuario y el que se archiva con el lead — cambiarlo invalida los
// consentimientos ya recogidos bajo la version anterior.
const TCPA_CONSENT_TEXT =
  'Autorizo a Connecting S.A. de C.V. y a los proveedores participantes a contactarme al ' +
  'número que proporcioné, mediante llamadas y mensajes de texto, incluidos sistemas ' +
  'automatizados o mensajes pregrabados, con fines comerciales. Entiendo que este ' +
  'consentimiento no es condición para contratar ningún servicio y que puedo revocarlo en ' +
  'cualquier momento respondiendo STOP o pidiéndolo a un asesor. Aplican tarifas de ' +
  'mensajes y datos.'

const PHONE = '+18884702820'
const PHONE_DISPLAY = '+1 (888) 470-2820'

const heroSlides = [
  { src: '/images/hablando_por_telefono.webp', alt: 'Planes Móviles' },
  { src: '/images/familiaconectada.webp',      alt: 'Familia Conectada' },
  { src: '/images/altavelocidad.webp',          alt: 'Alta Velocidad 5G' },
]

const carouselItems = [
  {
    name: 'Samsung Galaxy Z Flip4',
    img: '/images/carrusel/Galaxy_Z_Flip4_detail.webp',
    specs: [
      { label: 'OS',         value: 'Android 12' },
      { label: 'Red',        value: '5G+ (mmWave & C-Band), 4G LTE' },
      { label: 'Batería',    value: '3,700 mAh · Hasta 32h de llamadas' },
      { label: 'Memoria',    value: '128GB / 256GB · 8GB RAM' },
      { label: 'Procesador', value: 'Snapdragon 8+ Gen 1' },
      { label: 'Pantalla',   value: '6.7" (abierto) · 1.9" (cerrado)' },
      { label: 'Cámara',     value: '12MP + 12MP trasera · 10MP frontal' },
    ],
  },
  {
    name: 'iPhone 17 Pro',
    img: '/images/carrusel/iPhone17pro.webp',
    specs: [
      { label: 'OS',         value: 'iOS 18' },
      { label: 'Red',        value: '5G (mmWave & Sub-6GHz), 4G LTE' },
      { label: 'Procesador', value: 'Apple A19 Pro' },
      { label: 'Pantalla',   value: '6.3" Super Retina XDR, ProMotion 120Hz' },
      { label: 'Cámara',     value: 'Sistema Pro 48MP + 12MP + 12MP' },
      { label: 'Batería',    value: 'Todo el día · Carga MagSafe' },
    ],
  },
  {
    name: 'iPhone Air',
    img: '/images/carrusel/iPhoneAir.webp',
    specs: [
      { label: 'OS',      value: 'iOS 18' },
      { label: 'Red',     value: '5G, 4G LTE' },
      { label: 'Diseño',  value: 'El iPhone más delgado de Apple' },
      { label: 'Pantalla',value: '6.6" Super Retina XDR' },
      { label: 'Cámara',  value: '48MP principal · 12MP frontal' },
      { label: 'Carga',   value: 'MagSafe + USB-C' },
    ],
  },
  {
    name: 'Samsung Galaxy Z Fold7',
    img: '/images/carrusel/samsung-galaxy-fold7-detail.webp',
    specs: [
      { label: 'OS',         value: 'Android 15 · One UI 7' },
      { label: 'Red',        value: '5G+ (mmWave & C-Band), 4G LTE' },
      { label: 'Pantalla',   value: '8" interior · 6.5" exterior' },
      { label: 'Procesador', value: 'Snapdragon 8 Elite' },
      { label: 'Cámara',     value: '200MP principal + 12MP ultra + 10MP zoom' },
      { label: 'Batería',    value: '4,400 mAh · Carga rápida 25W' },
    ],
  },
]

const faqs = [
  {
    q: '¿Realmente no hay contratos forzosos?',
    a: '¡Exacto! Creemos en la libertad del cliente. No estás atado a plazos mínimos de permanencia; puedes cancelar el servicio cuando lo desees sin pagar penalizaciones por "terminación anticipada".',
  },
  {
    q: '¿Qué requisitos necesito para contratar si soy extranjero?',
    a: 'Solo necesitas una identificación oficial vigente. Aceptamos pasaporte de cualquier país para abrir tu cuenta, facilitando el proceso sin necesidad de trámites complicados.',
  },
  {
    q: '¿El precio de mi factura cambiará después de unos meses?',
    a: 'El precio base del plan no sube por promociones que expiran. Aparte del plan se facturan los impuestos y cargos regulatorios, que varían según tu estado y el proveedor. Te desglosamos el total estimado antes de que contrates.',
  },
  {
    q: '¿Qué significa que los datos móviles sean "ilimitados"?',
    a: 'Significa que no pagas cargos extra por consumo. Ten en cuenta que los proveedores aplican priorización de red a partir de cierto consumo mensual, lo que puede reducir la velocidad en horas de congestión. El umbral en GB depende del proveedor y del plan; te lo confirmamos antes de que contrates.',
  },
  {
    q: '¿En qué condiciones viene el equipo?',
    a: 'Depende del proveedor y del plan. Según el caso el equipo puede entrar financiado a plazos, con un pago inicial o sujeto a permanencia mínima para conservar el descuento. No entregamos equipos por nuestra cuenta: las condiciones, la garantía y el financiamiento los fija el proveedor, y te las explicamos en detalle antes de que firmes.',
  },
  {
    q: '¿Con qué proveedores trabajan?',
    a: 'Somos un agente independiente y trabajamos con varios proveedores de servicios móviles en Estados Unidos. No pertenecemos a ninguno de ellos. Revisamos contigo cuál conviene más según tu zona, tu presupuesto y el uso que le des a la línea.',
  },
  {
    q: '¿Necesito una verificación de crédito para aplicar?',
    a: '¡Al permitir la contratación con pasaporte y no tener contratos a largo plazo, nuestros requisitos son mucho más flexibles que los de las compañías tradicionales. ¡Consulta con nosotros para una aprobación rápida!',
  },
  {
    q: '¿Cuánto tiempo tarda el envío del equipo?',
    a: 'Una vez aprobada tu solicitud, solemos agendar el envío en un plazo de 24 a 72 horas hábiles. El plazo final lo define el proveedor que elijas.',
  },
  {
    q: '¿Puedo cambiar de plan más adelante?',
    a: '¡Por supuesto! Al no haber contrato, puedes subir o bajar de plan según tus necesidades. Como trabajamos con varios proveedores, también podemos revisar contigo si otro se ajusta mejor.',
  },
]

export default function Home() {
  const [heroSlide, setHeroSlide]       = useState(0)
  const heroTimer                        = useRef<ReturnType<typeof setInterval> | null>(null)
  const [carouselIdx, setCarouselIdx]   = useState(0)
  const carouselTimer                    = useRef<ReturnType<typeof setInterval> | null>(null)
  const [openFaq, setOpenFaq]           = useState<number | null>(null)
  const [form, setForm]                 = useState({ name: '', phone: '', email: '', address: '', consent: false })
  const [formState, setFormState]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [cookieVisible, setCookieVisible] = useState(false)
  const [scrollPct, setScrollPct]       = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [cnt, setCnt]                   = useState(0)
  const planRefs                         = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const canvasRef                        = useRef<HTMLCanvasElement>(null)

  /* canvas particles */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    type P = { x:number; y:number; vx:number; vy:number; r:number; o:number }
    const pts: P[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .45,
      vy: (Math.random() - .5) * .45,
      r: Math.random() * 1.4 + .4,
      o: Math.random() * .45 + .1,
    }))
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx*dx + dy*dy)
          if (d < 130) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0,212,255,${.13*(1-d/130)})`
            ctx.lineWidth = .6
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,212,255,${p.o})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* scroll progress */
  useEffect(() => {
    const onScroll = () => {
      const d = document.documentElement
      setScrollPct((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* stat counters */
  useEffect(() => {
    const el = document.querySelector('.stats-strip')
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStatsVisible(true); io.disconnect() }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!statsVisible) return
    const dur = 1600
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const ease = 1 - (1 - p) ** 3
      setCnt(Math.round(55 * ease))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [statsVisible])

  /* plan card tilt */
  const onTiltMove = (e: React.MouseEvent, idx: number) => {
    const el = planRefs.current[idx]
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - .5) * 14
    const y = ((e.clientY - r.top) / r.height - .5) * -14
    el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`
    el.style.transition = 'transform .1s ease'
  }
  const onTiltLeave = (idx: number) => {
    const el = planRefs.current[idx]
    if (!el) return
    el.style.transform = ''
    el.style.transition = 'transform .45s ease, background .3s'
  }

  /* hero timer */
  const startHeroTimer = useCallback(() => {
    if (heroTimer.current) clearInterval(heroTimer.current)
    heroTimer.current = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 6000)
  }, [])

  useEffect(() => {
    startHeroTimer()
    return () => { if (heroTimer.current) clearInterval(heroTimer.current) }
  }, [startHeroTimer])

  /* carousel timer */
  const startCarouselTimer = useCallback(() => {
    if (carouselTimer.current) clearInterval(carouselTimer.current)
    carouselTimer.current = setInterval(() => setCarouselIdx(i => (i + 1) % carouselItems.length), 5000)
  }, [])

  useEffect(() => {
    startCarouselTimer()
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current) }
  }, [startCarouselTimer])

  /* cookie banner */
  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setCookieVisible(true)
  }, [])

  /* reveal on scroll */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'))
      return
    }
    const vh = window.innerHeight
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => {
      if (el.getBoundingClientRect().top < vh) el.classList.add('visible')
      else io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  /* phone click */
  const onPhoneClick = () => {
    window.gtag?.('event', 'phone_call_click', { phone_number: PHONE })
  }

  /* carousel nav */
  const goCarousel = (n: number) => {
    setCarouselIdx((n + carouselItems.length) % carouselItems.length)
    startCarouselTimer()
  }

  /* form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { name, phone, email, address, consent } = form
    if (!name || !phone || !email || !address || !consent) return
    setFormState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email, address,
          consent: true,
          consentText: TCPA_CONSENT_TEXT,
          consentAt: new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (data.ok) {
        window.gtag?.('event', 'lead_magnet_submit', { name, phone })
        setFormState('success')
      } else {
        setFormState('error')
      }
    } catch {
      setFormState('error')
    }
  }

  /* cookie */
  const acceptCookie = () => {
    localStorage.setItem('cookie_consent', 'granted')
    window.gtag?.('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' })
    setCookieVisible(false)
  }
  const rejectCookie = () => {
    localStorage.setItem('cookie_consent', 'denied')
    window.gtag?.('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    setCookieVisible(false)
  }

  return (
    <>
      {/* SCROLL PROGRESS */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      {/* NAV */}
      <nav>
        <div className="nav-left">
          <Link href="#servicios" className="nav-link">Servicios</Link>
          <Link href="#familiar"  className="nav-link">Familias</Link>
          <Link href="#planes"    className="nav-link">Planes</Link>
          <Link href="#quienes-somos" className="nav-link">Nosotros</Link>
        </div>

        <div className="nav-right">
          <Link href="#faq" className="nav-link">Preguntas</Link>
          <a href={`tel:${PHONE}`} className="nav-cta" onClick={onPhoneClick}>Llamar</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="servicios">
        <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:2, pointerEvents:'none' }} />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-slides">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide${i === heroSlide ? ' active' : ''}`}>
              <Image src={slide.src} alt={slide.alt} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority={i === 0} />
            </div>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">Conectamos familias en todo Estados Unidos</span>
            <p className="hero-eyebrow">Redes 5G nacionales · Varios proveedores</p>
            <h1>Conecta a tu<br /><em>Familia</em> hoy.</h1>
            <p className="hero-sub">Planes sin contratos desde $55/mes + impuestos. Soporte 100% en español. Activa hoy mismo.</p>
            <div className="hero-actions">
              <a href={`tel:${PHONE}`} className="btn-hero-main" onClick={onPhoneClick}>📞 Hablar con un Asesor</a>
              <Link href="#planes" className="btn-hero-ghost">Ver planes →</Link>
            </div>
          </div>
          <div className="hero-pagination">
            <p className="hero-page-counter"><span>{heroSlide + 1}</span> / {heroSlides.length}</p>
            <div className="hero-dots">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === heroSlide ? ' active' : ''}`}
                  onClick={() => { setHeroSlide(i); startHeroTimer() }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        {[
          {
            num: '0', label: 'Contratos Forzosos',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
          },
          {
            num: 'USA', label: 'Cobertura Nacional',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
          },
          {
            num: `$${cnt}`, label: 'Desde / mes + imp.',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          },
          {
            num: '24/7', label: 'Soporte en Español',
            icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
          },
        ].map((s, i) => (
          <div key={i} className={`stat-item reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* WHY SECTION */}
      <section className="why-section">
        <div className="why-header reveal">
          <span className="section-eyebrow">Por qué elegirnos</span>
          <h2 className="why-title">La diferencia que<br /><em>marca el servicio.</em></h2>
        </div>
        <div className="why-grid">
          {[
            {
              title: 'Sin contratos',
              desc: 'Cancela cuando quieras. Sin penalizaciones por terminación anticipada ni permanencia forzosa.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
            },
            {
              title: 'Soporte en español',
              desc: 'Atención 24/7 por agentes nativos que te entienden. Sin barreras de idioma.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
            },
            {
              title: 'Red 5G nacional',
              desc: 'Cobertura nacional sobre las principales redes 5G del país. El alcance exacto depende del proveedor y plan que elijas.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16.1a6 6 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
            },
            {
              title: 'Activación express',
              desc: 'Tu línea activa en menos de 24 horas. Solo necesitas tu pasaporte. Así de simple.',
              icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
            },
          ].map((item, i) => (
            <div key={i} className={`why-card reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
              <div className="why-icon">{item.icon}</div>
              <div className="why-card-title">{item.title}</div>
              <div className="why-card-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT 1: Familias */}
      <section className="split" id="familiar">
        <div className="split-image reveal">
          <Image src="/images/familiaconectada.webp" alt="Familia Conectada" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="split-content reveal reveal-delay-1">
          <span className="split-tag">Planes Familiares</span>
          <h2>Ahorra más<br /><em>por línea.</em></h2>
          <p>Agrega hasta 4 líneas y disfruta de tarifas reducidas. Cuantas más líneas, más ahorras. Toda tu familia en la red 5G más rápida de Estados Unidos.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Hablar con un Asesor</a></div>
        </div>
      </section>

      {/* SPLIT 2: Datos ilimitados */}
      <section className="split split-dark">
        <div className="split-content reveal">
          <span className="split-tag">Sin Límites</span>
          <h2>Datos<br /><em>ilimitados.</em></h2>
          <p>Sin data caps, sin sorpresas. Streaming en 4K, videollamadas y gaming todo el mes sin interrupciones ni cargos extra.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Conocer Más</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/datos-ilimitados.webp" alt="Datos Ilimitados" fill style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* CAROUSEL DISPOSITIVOS */}
      <section className="carousel-section" id="dispositivos">
        <div className="carousel-header reveal">
          <span className="section-eyebrow">Tecnología de Punta</span>
          <h2 className="section-title">Teléfonos de<br /><em>Alta Gama.</em></h2>
          <p className="section-sub">Los mejores dispositivos disponibles para tu plan móvil.</p>
        </div>
        <div className="carousel-wrapper">
          <div className="carousel-track" style={{ transform: `translateX(-${carouselIdx * 100}%)` }}>
            {carouselItems.map((item, i) => (
              <div key={i} className="carousel-slide">
                <div className="carousel-slide-inner">
                  <div className="carousel-img-wrap">
                    <Image src={item.img} alt={item.name} width={400} height={400} style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '100%' }} />
                  </div>
                  <div className="carousel-info">
                    <div className="carousel-name">{item.name}</div>
                    <ul className="carousel-specs">
                      {item.specs.map((s, j) => (
                        <li key={j}><span className="spec-label">{s.label}</span> {s.value}</li>
                      ))}
                    </ul>
                    <a href={`tel:${PHONE}`} className="btn-dark" style={{ width: 'fit-content' }} onClick={onPhoneClick}>Contactar un Asesor</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-controls">
          <div className="carousel-progress">
            {carouselItems.map((_, i) => (
              <button key={i} className={`carousel-dot${i === carouselIdx ? ' active' : ''}`} onClick={() => goCarousel(i)} />
            ))}
          </div>
          <div className="carousel-counter">
            <strong>{carouselIdx + 1}</strong> / {carouselItems.length}
          </div>
          <div className="carousel-nav">
            <button className="carousel-btn" onClick={() => goCarousel(carouselIdx - 1)}>←</button>
            <button className="carousel-btn" onClick={() => goCarousel(carouselIdx + 1)}>→</button>
          </div>
        </div>
      </section>

      {/* PLANES */}
      <section className="plans-section" id="planes">
        <div className="section-header reveal">
          <span className="section-eyebrow">Precios Transparentes</span>
          <h2 className="section-title">Elige tu Plan.</h2>
          <p className="section-sub">Precio base del plan. Los impuestos y cargos regulatorios se facturan aparte y varían según tu estado y el proveedor.</p>
        </div>
        <div className="plans-grid">
          {[
            { badge: 'Plan 01',    name: 'Básico',   price: '55',  features: ['Datos ilimitados 5G', 'Llamadas y mensajes ilimitados', 'Soporte 24/7 en español'],           cond: 'Precio por línea, sin impuestos. Sujeto a disponibilidad del proveedor en tu zona.',      featured: false },
            { badge: 'Recomendado', name: 'Familiar', price: '150', features: ['Hasta 4 líneas incluidas', 'Datos ilimitados para todos', 'Descuentos por líneas adicionales'], cond: 'Precio total por hasta 4 líneas, sin impuestos. Requiere activarlas con el mismo proveedor.', featured: true  },
            { badge: 'Plan 03',    name: 'Premium',  price: '90',  features: ['Datos ilimitados 5G', 'Opción de dispositivo de alta gama', 'Soporte en español 24/7'],        cond: 'Precio por línea, sin impuestos. El dispositivo y sus condiciones los define el proveedor.',  featured: false },
          ].map((plan, i) => (
            <div
              key={i}
              ref={el => { planRefs.current[i] = el }}
              className={`plan-card reveal${plan.featured ? ' featured' : ''}${i > 0 ? ` reveal-delay-${i}` : ''}`}
              onMouseMove={e => onTiltMove(e, i)}
              onMouseLeave={() => onTiltLeave(i)}
            >
              <span className="plan-badge">{plan.badge}</span>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price"><sup>$</sup>{plan.price}<sub>/mes</sub></div>
              <div className="plan-tax">+ impuestos y cargos regulatorios</div>
              <hr className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
              <a href={`tel:${PHONE}`} className="plan-cta" onClick={onPhoneClick}>Hablar con un Asesor</a>
              <p className="plan-cond">{plan.cond}</p>
              <Link href="/terminos" className="plan-cond plan-cond-link">Ver condiciones completas</Link>
            </div>
          ))}
        </div>
      </section>

      {/* SPLIT 3: Cobertura */}
      <section className="split split-cream" id="cobertura">
        <div className="split-image reveal">
          <Image src="/images/mapa_de_cobertura.webp" alt="Cobertura Nacional" fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="split-content reveal reveal-delay-1">
          <span className="split-tag">Cobertura y Velocidad</span>
          <h2>Cobertura en<br /><em>todo el país.</em></h2>
          <p>Trabajamos con varios proveedores sobre las principales redes 5G de Estados Unidos. Verificamos contigo la cobertura real en tu zona antes de que contrates.</p>
          <div><a href={`tel:${PHONE}`} className="btn-dark" onClick={onPhoneClick}>Verificar Cobertura</a></div>
        </div>
      </section>

      {/* SPLIT 4: Velocidad */}
      <section className="split split-dark">
        <div className="split-content reveal">
          <span className="split-tag">5G Ultra Rápido</span>
          <h2>Hasta<br /><em>1 Gbps.</em></h2>
          <p>Streaming en HD, videollamadas y gaming sin interrupciones. La conexión más rápida para tu familia, disponible hoy.</p>
          <div><a href={`tel:${PHONE}`} className="btn-outline-white" onClick={onPhoneClick}>Hablar con un Asesor</a></div>
        </div>
        <div className="split-image reveal reveal-delay-1">
          <Image src="/images/altavelocidad.webp" alt="Alta Velocidad 5G" fill style={{ objectFit: 'cover' }} />
        </div>
      </section>

      {/* QUIENES SOMOS: identidad del anunciante exigida por Google Ads */}
      <section className="about-section" id="quienes-somos">
        <div className="about-header reveal">
          <span className="section-eyebrow">Quiénes somos</span>
          <h2 className="section-title">Un agente,<br /><em>no una red.</em></h2>
        </div>
        <div className="about-body reveal reveal-delay-1">
          <p className="about-disclaimer">
            Connecting S.A. de C.V. es un agente independiente de servicios móviles. Ayudamos a
            consumidores en Estados Unidos a conocer opciones de telefonía móvil y conectarse con
            proveedores participantes. No somos una compañía de red móvil ni afirmamos ser
            representantes de ningún operador salvo cuando se indique expresamente.
          </p>
          <p>
            No trabajamos con un solo operador: comparamos planes de <strong>varios proveedores</strong> y
            te mostramos cuál se ajusta mejor a tu zona, tu presupuesto y tu consumo. Nuestros agentes
            atienden en español, verifican la cobertura disponible en tu dirección y te explican las
            alternativas antes de que contrates. El contrato final de servicio se establece entre tú y
            la compañía proveedora que elijas.
          </p>
          <p>
            Las marcas, nombres comerciales y logotipos de terceros que aparezcan en este sitio
            pertenecen a sus respectivos titulares. Los planes, precios y disponibilidad los determina
            cada proveedor y están sujetos a cambios sin previo aviso.
          </p>
          <div className="about-meta">
            <span><strong>Razón social:</strong> Connecting S.A. de C.V.</span>
            <span><strong>Operaciones:</strong> Texas, Estados Unidos</span>
            <span><strong>Contacto:</strong> {PHONE_DISPLAY}</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="section-header reveal">
          <span className="section-eyebrow">Resolvemos tus dudas</span>
          <h2 className="section-title">Preguntas<br /><em>Frecuentes.</em></h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item reveal${openFaq === i ? ' open' : ''}`}>
              <button
                className="faq-question"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LEAD MAGNET — solo local */}
      {LEAD_TOOLS && (
      <section className="lead-section">
        <span className="lead-eyebrow">Contacto Directo</span>
        <h2>¿No puedes<br /><em>llamar ahora?</em></h2>
        <p>Déjanos tus datos y un asesor te contactará en menos de 10 minutos.</p>
        {formState === 'success' ? (
          <p style={{ marginTop: '2rem', color: 'rgba(255,255,255,.7)', fontSize: '.9rem' }}>
            ✓ Recibido. Te llamamos en menos de 10 minutos.
          </p>
        ) : (
          <form className="lead-form" onSubmit={handleSubmit}>
            <input className="lead-input" type="text"  placeholder="Nombre completo"    required value={form.name}    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input className="lead-input" type="tel"   placeholder="Número de teléfono" required value={form.phone}   onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <input className="lead-input" type="email" placeholder="Correo electrónico" required value={form.email}   onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="lead-input" type="text"  placeholder="Dirección"          required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            <label className="lead-consent">
              <input
                type="checkbox"
                required
                checked={form.consent}
                onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))}
              />
              <span>{TCPA_CONSENT_TEXT}</span>
            </label>
            <button type="submit" className="lead-btn" disabled={formState === 'loading' || !form.consent}>
              {formState === 'loading' ? 'Enviando...' : 'Que me llamen →'}
            </button>
          </form>
        )}
        {formState === 'error' && (
          <p style={{ marginTop: '12px', color: '#F87171', fontSize: '.85rem' }}>Error al enviar. Intenta de nuevo.</p>
        )}
        <p className="lead-note">
          Tratamos tus datos conforme a nuestra <Link href="/privacidad">Política de Privacidad</Link>.
          Puedes pedir que te retiremos de la lista de contacto en cualquier momento.
        </p>
      </section>
      )}

      {/* FOOTER */}
      <footer className="footer" id="contacto">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Quiénes Somos</h4>
            <p>Agente independiente de servicios móviles. Comparamos planes de varios proveedores participantes en las mejores redes 5G de Estados Unidos.</p>
            <Link href="/#quienes-somos" className="footer-brand-link">Conocer más →</Link>
            <p className="footer-brand-loc">Texas, EE.UU.</p>
          </div>
          <div className="footer-col">
            <h4>Servicios</h4>
            <Link href="#servicios">Planes Móviles</Link>
            <Link href="#familiar">Planes Familiares</Link>
            <Link href="#dispositivos">Dispositivos</Link>
            <Link href="#planes">Precios</Link>
          </div>
          <div className="footer-col">
            <h4>Empresa</h4>
            <Link href="#quienes-somos">Quiénes Somos</Link>
            <Link href="#cobertura">Cobertura</Link>
            <Link href="#faq">Preguntas Frecuentes</Link>
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos</Link>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <a href={`tel:${PHONE}`} onClick={onPhoneClick}>{PHONE_DISPLAY}</a>
            <a>Lun–Dom 8:00AM–9:00PM</a>
            <a>Texas, Estados Unidos</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Connecting S.A. de C.V. · Agente independiente de servicios móviles.</span>
          <span>
            <Link href="/privacidad">Privacidad</Link> &nbsp;·&nbsp;
            <Link href="/terminos">Términos</Link> &nbsp;·&nbsp;
            <button
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.3)', fontSize: '.74rem', cursor: 'pointer', padding: 0 }}
              onClick={() => { rejectCookie(); setCookieVisible(true) }}
            >
              No vender mis datos (CCPA)
            </button>
          </span>
        </div>
      </footer>

      {/* CTA DE LLAMADA FLOTANTE */}
      <a
        href={`tel:${PHONE}`}
        className={`footer-call${cookieVisible ? ' raised' : ''}`}
        onClick={onPhoneClick}
        aria-label={`Llamar ahora al ${PHONE_DISPLAY}`}
      >
        📞 &nbsp;¡Llama ahora!
      </a>

      {/* COOKIE BANNER */}
      <div id="cookie-banner" className={cookieVisible ? 'visible' : ''} role="dialog" aria-label="Aviso de cookies">
        <p className="cookie-text">
          Usamos cookies propias y de terceros (incluido Google Ads) para mejorar tu experiencia y mostrarte publicidad relevante.{' '}
          <Link href="/privacidad">Política de Privacidad</Link>.
        </p>
        <div className="cookie-actions">
          <button className="cookie-reject" onClick={rejectCookie}>Rechazar</button>
          <button className="cookie-accept" onClick={acceptCookie}>Aceptar</button>
        </div>
      </div>
    </>
  )
}
