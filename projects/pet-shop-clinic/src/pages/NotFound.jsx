import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Home, RotateCcw } from 'lucide-react'
import { BRAND } from '../data'

export default function NotFound() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })
      tl.fromTo('.notfound-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
        .fromTo('.notfound-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .fromTo('.notfound-actions', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.3')
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 pt-32">
      <div className="max-w-md mx-auto text-center">
        <div className="notfound-title mb-8">
          <span className="font-mono text-accent text-8xl md:text-9xl font-bold block leading-none">404</span>
          <span className="font-heading text-dark/50 text-sm tracking-widest uppercase block mt-2">Página não encontrada</span>
        </div>
        <p className="notfound-text font-heading text-dark/60 text-lg mb-10 max-w-sm mx-auto">
          Ops! Parece que esta página não existe ou foi movida. Não se preocupe, podemos te levar para o lugar certo.
        </p>
        <div className="notfound-actions flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-magnetic inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
            <Home size={18} className="relative z-10" />
            <span className="relative z-10">Voltar ao Início</span>
          </Link>
          <Link to="/contato" className="btn-magnetic inline-flex items-center justify-center gap-2 border border-dark/20 text-dark px-8 py-4 rounded-full font-heading font-medium text-base hover:bg-dark/5 transition-colors">
            <RotateCcw size={18} className="relative z-10" />
            <span className="relative z-10">Fale Conosco</span>
          </Link>
        </div>
        <p className="font-mono text-dark/30 text-xs tracking-widest uppercase mt-12">{BRAND.name}</p>
      </div>
    </section>
  )
}