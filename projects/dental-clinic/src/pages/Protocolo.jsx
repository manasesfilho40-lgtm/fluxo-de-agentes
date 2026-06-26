import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight } from 'lucide-react'
import { PROTOCOL_STEPS } from '../data'

gsap.registerPlugin(ScrollTrigger)

function ProtocolCard({ step, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: ref.current, start: 'top center', end: 'bottom center', onEnter: () => gsap.to(ref.current, { scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out' }) })
    })
    return () => ctx.revert()
  }, [])

  const anim = step.animation === 'helix' ? (
    <svg viewBox="0 0 200 200" className="w-full h-full opacity-20">
      <defs><linearGradient id={`g${index}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#C9A84C" /><stop offset="100%" stopColor="#C9A84C" stopOpacity="0.3" /></linearGradient></defs>
      <path d="M100 20 C130 50, 170 80, 100 100 C30 120, 70 150, 100 180" fill="none" stroke={`url(#g${index})`} strokeWidth="2" className="animate-pulse" />
      <path d="M100 20 C70 50, 30 80, 100 100 C170 120, 130 150, 100 180" fill="none" stroke={`url(#g${index})`} strokeWidth="2" className="animate-pulse" />
    </svg>
  ) : step.animation === 'scan' ? (
    <div className="w-full h-full relative overflow-hidden opacity-20">
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-1">{Array.from({ length: 64 }).map((_, i) => <div key={i} className="bg-accent/20 rounded-full" />)}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent animate-scan" />
    </div>
  ) : (
    <svg viewBox="0 0 400 100" className="w-full h-full opacity-20">
      <path d="M0 50 L50 50 L70 20 L90 80 L110 30 L130 70 L150 50 L200 50 L220 20 L240 80 L260 30 L280 70 L300 50 L350 50 L370 20 L390 80 L400 50" fill="none" stroke="#C9A84C" strokeWidth="2" className="ekg-path" />
    </svg>
  )

  return (
    <div ref={ref} className="card-stack sticky bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden" style={{ top: `${120 + index * 40}px`, zIndex: index + 1 }}>
      <div className="absolute inset-0 pointer-events-none">{anim}</div>
      <div className="relative z-10">
        <span className="font-mono text-accent text-sm tracking-widest">PASSO {step.number}</span>
        <h3 className="font-heading font-bold text-2xl md:text-3xl text-dark mt-4 mb-4">{step.title}</h3>
        <p className="font-heading text-dark/60 text-lg max-w-xl">{step.description}</p>
      </div>
    </div>
  )
}

export default function Protocolo() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.protocol-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="pt-32 pb-24 md:pt-40 md:pb-32 px-6 bg-ivory">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 protocol-title">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Nosso Processo</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark">Protocolo de Excelência</h2>
        </div>
        <div className="space-y-8">{PROTOCOL_STEPS.map((s, i) => <ProtocolCard key={s.number} step={s} index={i} />)}</div>
        <div className="text-center mt-16">
          <Link to="/contato" className="btn-magnetic inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
            Começar Agora
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
