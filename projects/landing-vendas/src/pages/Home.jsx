import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight, Check, Shield, Star } from 'lucide-react'
import { BRAND, CATEGORIES, PAINS, BENEFITS, TESTIMONIALS, FAQS } from '../data'

gsap.registerPlugin(ScrollTrigger)

function Hero() {
  const heroRef = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 })
      tl.fromTo('.hero-line-1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .fromTo('.hero-line-2', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.7')
        .fromTo('.hero-cta', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.5')
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80" alt="Fútbol" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
        <div className="max-w-3xl">
          <p className="hero-line-1 font-mono text-accent text-sm md:text-base tracking-widest uppercase mb-4 opacity-0">Acceso Inmediato &middot; Pago Único</p>
          <h1 className="mb-6">
            <span className="hero-line-1 block font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-tight opacity-0">
              Más de 300 Ejercicios de Fútbol
            </span>
            <span className="hero-line-2 block font-drama italic text-5xl md:text-7xl lg:text-8xl text-accent leading-none mt-2 opacity-0">
              Prontos para Usar.
            </span>
          </h1>
          <p className="hero-line-2 font-heading text-white/70 text-lg md:text-xl max-w-xl mb-8 opacity-0">{BRAND.purpose}</p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 opacity-0">
              <a href="https://pay.cakto.com.br/9fuib6v_992374" target="_blank" rel="noopener noreferrer" className="btn-magnetic inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
              <span className="relative z-10">Quiero Acceder Ahora</span>
              <ChevronRight size={18} className="relative z-10" />
            </a>
            <a href="#categorias" className="btn-magnetic inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-heading font-medium text-base hover:bg-white/10 transition-colors">
              Ver Categorias
              <ChevronRight size={18} />
            </a>
          </div>
          <div className="hero-cta mt-8 flex items-center gap-6 opacity-0">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-gradient-to-br from-accent/30 to-accent/60" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
              </div>
              <p className="mt-0.5 text-xs text-white/40"><span className="font-semibold text-white/70">4.9/5</span> — +230 entrenadores ya lo usan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PainPoints() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pain-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="pain-item font-mono text-accent text-sm tracking-widest uppercase mb-4">¿Te pasa esto?</p>
          <h2 className="pain-item font-heading text-white text-3xl md:text-5xl font-bold leading-tight">Si sos entrenador, esto te suena</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <div key={i} className="pain-item rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-5 font-heading font-bold text-white text-lg">{p.title}</h3>
              <p className="mt-3 font-heading text-white/50 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cat-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="categorias" ref={ref} className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="cat-item font-mono text-accent text-sm tracking-widest uppercase mb-4">Lo que incluye</p>
          <h2 className="cat-item font-heading text-dark text-3xl md:text-5xl font-bold leading-tight">Todo lo que necesitás en un solo catálogo</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="cat-item group relative rounded-2xl border border-dark/10 bg-white p-6 transition-all hover:border-accent/30 hover:-translate-y-1 hover:shadow-lg">
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/5 transition-all group-hover:bg-accent/10" />
              <div className="relative">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="mt-3 font-heading text-sm font-bold text-dark">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ben-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04]" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="ben-item font-mono text-accent text-sm tracking-widest uppercase mb-4">Beneficios</p>
          <h2 className="ben-item font-heading text-white text-3xl md:text-5xl font-bold leading-tight">Más que un catálogo, tu herramienta de venta</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="ben-item rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 transition-all hover:border-accent/20">
              <span className="text-3xl">{b.icon}</span>
              <h3 className="mt-4 font-heading font-bold text-white text-lg">{b.title}</h3>
              <p className="mt-2 font-heading text-white/50 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.test-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonios" ref={ref} className="py-32 md:py-40 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="test-item font-mono text-accent text-sm tracking-widest uppercase mb-4">Testimonios</p>
          <h2 className="test-item font-heading text-dark text-3xl md:text-5xl font-bold leading-tight">Lo que dicen los que ya lo usan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="test-item rounded-2xl border border-dark/10 bg-white p-6 transition-all hover:border-accent/20 hover:shadow-lg">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
              </div>
              <p className="mt-4 font-drama italic text-dark/80 text-lg leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-primary">{t.name.charAt(0)}</div>
                <div>
                  <p className="font-heading text-sm font-bold text-dark">{t.name}</p>
                  <p className="font-mono text-xs text-dark/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="test-item mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-5 py-2">
            <span className="font-heading text-sm text-dark/60">⭐ +230 entrenadores ya transformaron su equipo con este catálogo</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="comprar" ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1920&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.04]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="cta-item font-mono text-accent text-sm tracking-widest uppercase mb-4">Oferta por tiempo limitado</p>
        <h2 className="cta-item font-heading text-white text-3xl md:text-5xl font-bold leading-tight">
          Dejá de perder tiempo creando entrenamientos.
          <br />
          <span className="gradient-text">Empezá a cerrar trabajos hoy.</span>
        </h2>
        <p className="cta-item mx-auto mt-4 max-w-xl font-heading text-white/50 text-lg">Accedé a +300 ejercicios de fútbol organizados por categoría con medidas, equipamientos y planos incluidos. Pago único, acceso de por vida.</p>
        <div className="cta-item mt-10 inline-flex items-center gap-4 rounded-2xl bg-white/[0.05] px-8 py-4 border border-white/[0.08]">
          <span className="font-drama italic text-2xl text-white/40 line-through decoration-accent/50">{BRAND.oldPrice} USD</span>
          <span className="font-mono text-5xl font-bold text-accent">{BRAND.price}</span>
          <span className="font-mono text-sm text-white/40">USD</span>
          <span className="rounded-full bg-accent/20 px-3 py-1 font-mono text-xs font-bold text-accent">-74%</span>
        </div>
        <div className="cta-item mt-8">
          <a href="https://pay.cakto.com.br/9fuib6v_992374" target="_blank" rel="noopener noreferrer" className="btn-magnetic inline-flex items-center justify-center gap-2 bg-accent text-primary px-10 py-5 rounded-full font-heading text-lg font-bold">
            <span className="relative z-10">Quiero Acceder Ahora</span>
            <ChevronRight size={20} className="relative z-10" />
          </a>
        </div>
        <div className="cta-item mt-6 flex flex-wrap items-center justify-center gap-6 font-heading text-sm text-white/40">
          <span className="flex items-center gap-1.5"><Shield size={16} className="text-emerald-400" /> Garantía 7 días</span>
          <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400" /> Acceso inmediato</span>
          <span className="flex items-center gap-1.5"><Check size={16} className="text-emerald-400" /> Pago único</span>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="faq" ref={ref} className="py-32 md:py-40 bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="faq-item font-mono text-accent text-sm tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="faq-item font-heading text-dark text-3xl md:text-5xl font-bold leading-tight">Preguntas frecuentes</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item rounded-2xl border border-dark/10 bg-white overflow-hidden transition-all">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="font-heading text-sm font-bold text-dark sm:text-base">{faq.q}</span>
                <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dark/5 text-dark/40 text-xs transition-transform font-mono ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="font-heading text-sm leading-relaxed text-dark/60">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Categories />
      <Benefits />
      <Testimonials />
      <CTA />
    </>
  )
}
