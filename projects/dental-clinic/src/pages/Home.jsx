import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Calendar, ChevronRight } from 'lucide-react'
import { BRAND } from '../data'

function Philosophy() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.philosophy-text', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.3, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80" alt="Textura" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-primary" />
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="philosophy-text font-mono text-accent text-sm tracking-widest uppercase mb-8">Nossa Filosofia</p>
        <h2 className="philosophy-text font-heading text-white/60 text-xl md:text-2xl mb-4 max-w-3xl mx-auto">A maioria das clínicas foca em: <span className="text-white">tratar problemas.</span></h2>
        <h2 className="philosophy-text font-drama italic text-4xl md:text-6xl lg:text-7xl text-white mt-8 max-w-4xl mx-auto leading-tight">Nós focamos em: <span className="text-accent">prevenir o inesperado.</span></h2>
        <div className="philosophy-text mt-16 flex items-center justify-center gap-8 flex-wrap">
          <div className="text-center"><span className="block font-mono text-accent text-3xl md:text-4xl font-bold">98%</span><span className="font-heading text-white/50 text-sm">Satisfação</span></div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center"><span className="block font-mono text-accent text-3xl md:text-4xl font-bold">15k+</span><span className="font-heading text-white/50 text-sm">Pacientes</span></div>
          <div className="w-px h-12 bg-white/20" />
          <div className="text-center"><span className="block font-mono text-accent text-3xl md:text-4xl font-bold">20+</span><span className="font-heading text-white/50 text-sm">Anos</span></div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
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
    <>
      <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=80" alt="Clínica" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
          <div className="max-w-3xl">
            <p className="hero-line-1 font-mono text-accent text-sm md:text-base tracking-widest uppercase mb-4 opacity-0">Odontologia de Precisão</p>
            <h1 className="mb-6">
              <span className="hero-line-1 block font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-tight opacity-0">Cada sorriso é</span>
              <span className="hero-line-2 block font-drama italic text-5xl md:text-7xl lg:text-8xl text-accent leading-none mt-2 opacity-0">uma obra de arte.</span>
            </h1>
            <p className="hero-line-2 font-heading text-white/70 text-lg md:text-xl max-w-xl mb-8 opacity-0">{BRAND.purpose}</p>
            <div className="hero-cta flex flex-col sm:flex-row gap-4 opacity-0">
              <Link to="/contato" className="btn-magnetic inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
                <span className="relative z-10">Agendar Consulta</span>
                <Calendar size={18} className="relative z-10" />
              </Link>
              <Link to="/servicos" className="btn-magnetic inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-full font-heading font-medium text-base hover:bg-white/10 transition-colors">
                Conhecer Serviços
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Philosophy />
    </>
  )
}
