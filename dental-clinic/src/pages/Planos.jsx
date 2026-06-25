import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '../data'

gsap.registerPlugin(ScrollTrigger)

export default function Planos() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-card', { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Planos</p>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-dark mb-4">Invista no seu sorriso</h2>
          <p className="font-heading text-dark/60 text-lg max-w-2xl mx-auto">Escolha o plano ideal para manter sua saúde bucal em excelência.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card rounded-[2rem] p-8 transition-all duration-300 ${plan.highlighted ? 'bg-primary text-white ring-4 ring-accent scale-105 shadow-2xl' : 'bg-background border border-dark/10 shadow-lg'}`}>
              {plan.highlighted && <div className="bg-accent text-primary text-xs font-mono font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-4">Mais Popular</div>}
              <h3 className={`font-heading font-bold text-xl mb-2 ${plan.highlighted ? 'text-white' : 'text-dark'}`}>{plan.name}</h3>
              <p className={`font-heading text-sm mb-6 ${plan.highlighted ? 'text-white/60' : 'text-dark/60'}`}>{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className={`font-heading font-bold text-4xl ${plan.highlighted ? 'text-accent' : 'text-dark'}`}>{plan.price}</span>
                <span className={`font-heading text-sm ${plan.highlighted ? 'text-white/50' : 'text-dark/50'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3"><Check size={16} className="text-accent" /><span className={`font-heading text-sm ${plan.highlighted ? 'text-white/80' : 'text-dark/70'}`}>{f}</span></li>
                ))}
              </ul>
              <Link to="/contato" className={`btn-magnetic block w-full py-4 rounded-xl font-heading font-semibold text-sm text-center transition-colors ${plan.highlighted ? 'bg-accent text-primary hover:bg-accent/90' : 'bg-dark text-white hover:bg-dark/90'}`}>Começar Agora</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
