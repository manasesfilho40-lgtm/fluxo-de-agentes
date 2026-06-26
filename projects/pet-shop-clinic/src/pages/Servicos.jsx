import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scissors, Sparkles, Heart, ChevronRight, Check } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function DiagnosticShuffler({ labels }) {
  const [cards, setCards] = useState(labels)
  const containerRef = useRef(null)
  useEffect(() => {
    const iv = setInterval(() => setCards(p => { const n = [...p]; n.unshift(n.pop()); return n }), 3000)
    return () => clearInterval(iv)
  }, [])
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.shuffler-card'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.7)' })
    }
  }, [cards])
  return (
    <div ref={containerRef} className="relative h-32 overflow-hidden">
      {cards.map((label, i) => (
        <div key={label} className="shuffler-card absolute inset-x-0 bg-white border border-dark/10 rounded-2xl p-4 flex items-center shadow-sm" style={{ top: `${i * 44}px` }}>
          <div className="w-2 h-2 rounded-full bg-accent mr-3 flex-shrink-0" />
          <span className="font-heading font-medium text-dark">{label}</span>
        </div>
      ))}
    </div>
  )
}

function CursorScheduler({ days, label }) {
  const [active, setActive] = useState(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [show, setShow] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const run = () => {
      setShow(true)
      const ri = Math.floor(Math.random() * days.length)
      const el = ref.current?.children[ri]
      if (el) {
        const r = el.getBoundingClientRect()
        const g = ref.current.getBoundingClientRect()
        gsap.to({}, {
          duration: 1,
          onUpdate() { setPos({ x: r.left - g.left + r.width / 2, y: r.top - g.top + r.height / 2 }) },
          onComplete() { setActive(ri); setTimeout(() => { setShow(false); setActive(null) }, 1500) }
        })
      }
    }
    const iv = setInterval(run, 4000)
    run()
    return () => clearInterval(iv)
  }, [days.length])
  return (
    <div className="relative">
      <div ref={ref} className="grid grid-cols-7 gap-2 relative">
        {days.map((d, i) => (
          <div key={d} className={`aspect-square rounded-xl flex items-center justify-center font-mono text-sm transition-all duration-300 ${active === i ? 'bg-accent text-primary scale-95' : 'bg-white text-dark/60 border border-dark/10'}`}>{d}</div>
        ))}
        {show && (
          <div className="absolute w-4 h-4 pointer-events-none transition-all duration-1000 ease-out z-10" style={{ left: `${pos.x - 8}px`, top: `${pos.y - 8}px` }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full"><path d="M5 3l14 8-6 2-2 6L5 3z" fill="#C9A84C" stroke="#0D0D12" strokeWidth="1" /></svg>
          </div>
        )}
      </div>
      <button className="btn-magnetic mt-4 w-full bg-accent text-primary py-3 rounded-xl font-heading font-semibold text-sm">{label}</button>
    </div>
  )
}

const SERVICES = [
  {
    id: 1,
    number: '01',
    icon: Scissors,
    title: 'Tosa Japonesa Premium',
    subtitle: 'Arte milenar japonesa para seu pet brilhar',
    description: 'Técnicas tradicionais japonesas de grooming que transformam seu pet em uma verdadeira obra de arte. Cada corte é único e personalizado para realçar a beleza natural do seu amigo.',
    details: [
      'Corte tradicional Nippo Style',
      'Níveis personalizados para cada raça',
      'Finalização com produtos premium',
      'Ambiente climatizado e tranquilo',
    ],
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    interactive: <DiagnosticShuffler labels={['Tosa Japonesa', 'Tosa婴 Security', 'Corte Criativo']} />,
  },
  {
    id: 2,
    number: '02',
    icon: Sparkles,
    title: 'Spa Pet Completo',
    subtitle: 'Relaxamento e bem-estar para seu companheiro',
    description: 'Tratamentos spa que vão além do convencional. Seu pet merece se sentir renovado com hidratação profunda, massagem relaxante e aromaterapia.',
    details: [
      'Hidratação profunda com produtos naturais',
      'Massagem relaxante canina',
      'Aromaterapia calmante',
      'Tratamento capilar reconstrutor',
    ],
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80',
    interactive: (
      <div className="space-y-3">
        {['Hidratação Premium', 'Massagem Canina', 'Aromaterapia'].map((item, i) => (
          <div key={item} className="bg-white border border-dark/10 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center font-mono text-accent text-xs font-bold">{i + 1}</div>
            <span className="font-heading font-medium text-dark text-sm">{item}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 3,
    number: '03',
    icon: Heart,
    title: 'Cuidados Veterinars',
    subtitle: 'Saúde garantida com carinho de verdade',
    description: 'Consultas e procedimentos com veterinários altamente qualificados. Seu pet em boas mãos com atendimento humanizado e tecnologia avançada.',
    details: [
      'Consulta com clínico geral',
      'Vacinação completa',
      'Exames laboratoriais',
      'Acompanhamento de saúde',
    ],
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80',
    interactive: <CursorScheduler days={['S', 'T', 'Q', 'Q', 'S', 'S', 'D']} label="Agendar Consulta" />,
  },
]

function ServiceBlock({ service, index }) {
  const ref = useRef(null)
  const isEven = index % 2 === 0
  const Icon = service.icon

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'lg:direction-rtl'}`}>
      <div className={`${isEven ? '' : 'lg:order-2'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Icon className="text-accent" size={28} />
          </div>
          <span className="font-mono text-accent text-sm tracking-widest">SERVICO {service.number}</span>
        </div>

        <h2 className="font-heading font-bold text-3xl md:text-4xl text-dark mb-3 leading-tight">{service.title}</h2>
        <p className="font-drama italic text-xl text-accent mb-6">{service.subtitle}</p>
        <p className="font-heading text-dark/60 text-base leading-relaxed mb-8">{service.description}</p>

        <ul className="space-y-3 mb-8">
          {service.details.map((detail) => (
            <li key={detail} className="flex items-start gap-3">
              <Check size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <span className="font-heading text-dark/70 text-sm">{detail}</span>
            </li>
          ))}
        </ul>

        <Link to="/contato" className="btn-magnetic inline-flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-full font-heading font-semibold text-sm">
          Saiba Mais
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className={`${isEven ? '' : 'lg:order-1'} space-y-6`}>
        <div className="rounded-[2rem] overflow-hidden shadow-xl">
          <img src={service.image} alt={service.title} className="w-full h-64 md:h-80 object-cover" />
        </div>
        <div className="bg-ivory rounded-[2rem] p-6 border border-dark/5">
          {service.interactive}
        </div>
      </div>
    </div>
  )
}

export default function Servicos() {
  const headerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.serv-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 })
    }, headerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <header ref={headerRef} className="px-6 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="serv-title font-mono text-accent text-sm tracking-widest uppercase mb-4">Nossos Servicos</p>
          <h1 className="serv-title font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-dark mb-6">
            Amor em cada <span className="font-drama italic text-accent">detalhe</span>
          </h1>
          <p className="serv-title font-heading text-dark/60 text-lg max-w-2xl mx-auto">
            Tres pilares que definem nossa abordagem ao cuidado pet. Cada servico e entregue com excelencia e carinho.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-32">
        {SERVICES.map((service, index) => (
          <ServiceBlock key={service.id} service={service} index={index} />
        ))}
      </div>

      <div className="mt-24 px-6">
        <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-16 text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Pronto para cuidar do seu pet?
          </h2>
          <p className="font-heading text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Agende um servico e proporcione a melhor experiencia para seu melhor amigo.
          </p>
          <Link to="/contato" className="btn-magnetic inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-heading font-semibold text-base">
            Agendar Servico
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}