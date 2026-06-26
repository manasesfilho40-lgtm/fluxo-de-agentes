import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  MapPin, Phone, Mail, ChevronRight, 
  Clock, Award, Heart, Shield, Star, Check, Menu, X,
  Sparkles, Zap, Target, Calendar, ArrowRight
} from 'lucide-react'

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

gsap.registerPlugin(ScrollTrigger)

const brand = {
  name: "PetLove",
  tagline: "Cuidado premium para seu melhor amigo",
  purpose: "Oferecer os melhores cuidados para seu pet com amor, carinho e excelência profissional.",
  cta: "Agendar Serviço",
  values: [
    {
      title: "Tosa Japonesa",
      subtitle: "Arte & Precisão",
      description: "Técnicas milenares japonesas para um visual impecável e personalizado para cada raça.",
      features: ["Corte tradicional", "Níveis personalizados", "Finalização premium"]
    },
    {
      title: "Spa Pet",
      subtitle: "Bem-estar Total", 
      description: "Tratamentos relaxantes e rejuvenecedores para seu pet se sentir renovado.",
      features: ["Hidratação profunda", "Massagem relaxante", "Aromaterapia"]
    },
    {
      title: "Clínica Veterinária",
      subtitle: "Saúde Garantida",
      description: "Consultas e procedimentos com veterinários altamente qualificados.",
      features: ["Check-up completo", "Vacinação", "Exames Laboratoriais"]
    }
  ],
  heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1920&q=80",
  stats: [
    { value: "+3.200", label: "Pets Atendidos" },
    { value: "4,9/5", label: "Avaliação Média" },
    { value: "8+", label: "Anos de Experiência" }
  ]
}

const services = [
  { name: "Banho & Tosa", price: "R$ 80", duration: "60 min", icon: "✂️" },
  { name: "Tosa Japonesa", price: "R$ 150", duration: "90 min", icon: "🎌" },
  { name: "Spa Pet", price: "R$ 180", duration: "120 min", icon: "🛁" },
  { name: "Consulta Vet", price: "R$ 120", duration: "30 min", icon: "🩺" },
  { name: "Vacinação", price: "R$ 90", duration: "20 min", icon: "💉" },
  { name: "Exames", price: "R$ 200", duration: "45 min", icon: "🔬" }
]

const team = [
  {
    name: "Ana Beatriz",
    role: "Tosadora Mestre",
    specialty: "Especialista em tosa japonesa e creativa",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Dr. Carlos",
    role: "Veterinário",
    specialty: "Clínica geral e dermatologia pet",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Fernanda",
    role: "Esteticista",
    specialty: "Spa e tratamentos capilares",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
  }
]

const testimonials = [
  { name: "Mariana Costa", text: "Minha goldie ficou incrível! Atendimento top e cuidado total. Recomendo demais!", rating: 5 },
  { name: "Roberto Silva", text: "Veterinário muito atencioso. Minha gata amou o spa!", rating: 5 },
  { name: "Juliana Santos", text: "Melhor pet shop da região. Profissionais incrível!", rating: 5 },
  { name: "Paulo Oliveira", text: "Tosa japonesa perfeita. Voltarei sempre!", rating: 5 }
]

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shufflerIndex, setShufflerIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const protocolRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15
      })

      gsap.from('.hero-image', {
        scale: 1.1,
        duration: 1.5,
        ease: 'power3.out'
      })

      const sections = document.querySelectorAll('.animate-on-scroll')
      sections.forEach(section => {
        gsap.from(section.querySelectorAll('.animate-target'), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
      })

      ScrollTrigger.create({
        trigger: protocolRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: '.protocol-cards',
        scrub: 1
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const features = brand.values[shufflerIndex].features
    let currentIndex = 0
    let currentText = ''
    
    const typeInterval = setInterval(() => {
      if (currentIndex < features.length) {
        currentText = features[currentIndex]
        setTypedText('')
        let charIndex = 0
        const charInterval = setInterval(() => {
          if (charIndex < currentText.length) {
            setTypedText(prev => prev + currentText[charIndex])
            charIndex++
          } else {
            clearInterval(charInterval)
            setTimeout(() => {
              currentIndex++
              if (currentIndex >= features.length) currentIndex = 0
            }, 1000)
          }
        }, 50)
      }
    }, 4000)

    return () => clearInterval(typeInterval)
  }, [shufflerIndex])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const shufflerInterval = setInterval(() => {
      setShufflerIndex(i => (i + 1) % brand.values.length)
    }, 3000)
    return () => clearInterval(shufflerInterval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <svg className="noise-overlay">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* NAVBAR */}
      <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border border-gray-200 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-8 px-6 py-3 rounded-full">
          <a href="#" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-heading font-bold text-lg text-primary">{brand.name}</span>
          </a>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#servicos" className="text-sm text-text-light hover:text-primary transition-colors">Serviços</a>
            <a href="#equipe" className="text-sm text-text-light hover:text-primary transition-colors">Equipe</a>
            <a href="#depoimentos" className="text-sm text-text-light hover:text-primary transition-colors">Depoimentos</a>
            <a href="#contato" className="text-sm text-text-light hover:text-primary transition-colors">Contato</a>
          </div>

          <a 
            href="#agendar" 
            className="hidden md:flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold btn-magnetic btn-slide"
          >
            <span>{brand.cta}</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6">
          <div className="flex flex-col gap-4">
            <a href="#servicos" className="text-lg py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Serviços</a>
            <a href="#equipe" className="text-lg py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Equipe</a>
            <a href="#depoimentos" className="text-lg py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Depoimentos</a>
            <a href="#contato" className="text-lg py-3 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>Contato</a>
            <a href="#agendar" className="bg-accent text-white px-6 py-4 rounded-2xl text-center font-semibold mt-4" onClick={() => setMobileMenuOpen(false)}>
              {brand.cta}
            </a>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative h-dvh flex items-end overflow-hidden">
        <div className="absolute inset-0 hero-image">
          <img 
            src={brand.heroImage} 
            alt="Happy dog" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
          <div className="hero-content max-w-3xl">
            <span className="inline-flex items-center gap-2 text-accent-light text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Pet Shop Premium em São Paulo
            </span>
            
            <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-6">
              Cuidado e amor
              <br />
              <span className="font-drama italic text-accent-light">para sempre.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
              {brand.purpose}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#agendar" 
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-8 py-4 rounded-full font-semibold text-lg btn-magnetic btn-slide"
              >
                <span>{brand.cta}</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a 
                href="#servicos" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all"
              >
                Ver Serviços
              </a>
            </div>

            <div className="flex gap-8 mt-12">
              {brand.stats.map((stat, i) => (
                <div key={i} className="text-white">
                  <div className="font-heading font-bold text-3xl">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* FEATURES SECTION */}
      <section ref={featuresRef} className="py-24 px-6 animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Funcionalidades</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mt-4">
              Por que escolher a PetLove?
            </h2>
            <p className="text-text-light mt-4 max-w-2xl mx-auto">
              Combinamos técnicas tradicionais japonesas com os melhores produtos do mercado para oferecer uma experiência única ao seu pet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Shuffler */}
            <div className="relative bg-surface rounded-[2rem] p-8 border border-gray-100 shadow-lg animate-target">
              <div className="absolute top-4 right-4 text-xs font-mono text-text-light bg-gray-100 px-3 py-1 rounded-full">
                {brand.values[shufflerIndex].subtitle}
              </div>
              
              <div className="h-32 flex items-center justify-center mb-6">
                <div className="text-6xl">
                  {shufflerIndex === 0 && '🎌'}
                  {shufflerIndex === 1 && '🛁'}
                  {shufflerIndex === 2 && '🩺'}
                </div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-primary mb-3">
                {brand.values[shufflerIndex].title}
              </h3>
              
              <p className="text-text-light mb-6">
                {brand.values[shufflerIndex].description}
              </p>

              <div className="space-y-2 font-mono text-sm">
                {brand.values[shufflerIndex].features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-light">
                    <Check className="w-4 h-4 text-accent" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 - Typewriter */}
            <div className="relative bg-surface rounded-[2rem] p-8 border border-gray-100 shadow-lg animate-target">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
                <span className="text-xs font-mono text-text-light">LIVE FEED</span>
              </div>

              <div className="h-32 flex items-center justify-center mb-6">
                <div className="text-6xl">💬</div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-primary mb-3">
                Agendamento Inteligente
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-text">
                <span className="text-accent">$</span> {typedText}
                <span className={`ml-1 ${cursorVisible ? 'opacity-100' : 'opacity-0'} text-accent`}>_</span>
              </div>

              <p className="text-text-light mt-4 text-sm">
                Sistema automatizado que confirma agendamentos via WhatsApp em tempo real.
              </p>
            </div>

            {/* Card 3 - Scheduler */}
            <div className="relative bg-surface rounded-[2rem] p-8 border border-gray-100 shadow-lg animate-target">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono text-text-light">AGENDA</span>
              </div>

              <div className="h-32 flex items-center justify-center mb-6">
                <div className="text-6xl">📅</div>
              </div>

              <h3 className="font-heading font-bold text-2xl text-primary mb-3">
                Agenda Flexível
              </h3>

              <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className={`p-2 rounded-lg ${i === 2 ? 'bg-accent text-white' : 'bg-gray-100'}`}>
                    {d}
                  </div>
                ))}
              </div>

              <p className="text-text-light text-sm">
                Escolha o melhor horário. Funcionamos de segunda a sábado das 8h às 19h.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SECTION */}
      <section className="py-24 bg-primary relative overflow-hidden animate-on-scroll">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1920&q=80" 
            alt="Pet texture" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Filosofia</span>
            <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mt-4 mb-12">
              Acreditamos que cada pet merece
              <br />
              <span className="font-drama italic text-accent-light">tratamento de rei.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left animate-target">
            <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Amor Incondicional</h3>
              <p className="text-white/60 text-sm">Cada pet é tratado com o mesmo carinho que daríamos ao nosso próprio filho de 4 patas.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Excelência Técnica</h3>
              <p className="text-white/60 text-sm">Profissionais certificados e em constante atualização para as melhores técnicas.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-[2rem] p-8 border border-white/10">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">Segurança Total</h3>
              <p className="text-white/60 text-sm">Ambiente sterilizado, produtos de primeira qualidade e protocolos rigorosos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOL SECTION */}
      <section ref={protocolRef} className="py-24 px-6 bg-background animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Processo</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mt-4">
              Como Funciona
            </h2>
            <p className="text-text-light mt-4 max-w-2xl mx-auto">
              Três passos simples para oferecer o melhor ao seu pet
            </p>
          </div>

          <div className="protocol-cards relative">
            <div className="space-y-8">
              {[
                { num: '01', title: 'Escolha o Serviço', desc: 'Browse our selection of premium services and find the perfect fit for your pet\'s needs.', icon: '🎯' },
                { num: '02', title: 'Agende Online', desc: 'Use our smart scheduling system to book your appointment in just a few taps.', icon: '📅' },
                { num: '03', title: 'Aprecie o Resultado', desc: 'Watch your pet thrive with our professional care and premium products.', icon: '✨' }
              ].map((step, i) => (
                <div key={i} className="relative bg-surface rounded-[2rem] p-8 border border-gray-100 shadow-lg animate-target">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent-light rounded-[1.5rem] flex items-center justify-center text-4xl">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-accent mb-2">{step.num}</div>
                      <h3 className="font-heading font-bold text-2xl text-primary mb-2">{step.title}</h3>
                      <p className="text-text-light">{step.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute left-12 bottom-0 translate-y-6 text-accent/20">
                        <ArrowRight className="w-6 h-6 rotate-90" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING / SERVICES */}
      <section id="servicos" className="py-24 px-6 bg-gradient-to-b from-background to-white animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Serviços</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mt-4">
              Nossos Serviços
            </h2>
            <p className="text-text-light mt-4 max-w-2xl mx-auto">
              Preços transparentes e serviços de alta qualidade para seu melhor amigo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-target">
            {services.map((service, i) => (
              <div key={i} className="bg-surface rounded-[2rem] p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{service.icon}</span>
                  <span className="font-heading font-bold text-2xl text-accent">{service.price}</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-primary mb-2">{service.name}</h3>
                <div className="flex items-center gap-2 text-text-light text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="equipe" className="py-24 px-6 bg-white animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Equipe</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mt-4">
              Nossa Equipe
            </h2>
            <p className="text-text-light mt-4 max-w-2xl mx-auto">
              Profissionais apaixonados e dedicados ao cuidado do seu pet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-target">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-48 h-48 mx-auto rounded-[2rem] object-cover shadow-lg"
                  />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-4 py-2 rounded-full">
                    {member.role}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-primary">{member.name}</h3>
                <p className="text-text-light text-sm mt-2">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="depoimentos" className="py-24 px-6 bg-gradient-to-b from-white to-background animate-on-scroll">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-target">
            <span className="text-accent font-medium text-sm tracking-wider uppercase">Depoimentos</span>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mt-4">
              O que dizem sobre nós
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-target">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface rounded-[2rem] p-6 border border-gray-100 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-text mb-4">"{t.text}"</p>
                <div className="font-medium text-primary">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / BOOKING SECTION */}
      <section id="agendar" className="py-24 px-6 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1920&q=80" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-target">
          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mb-6">
            Pronto para cuidar do seu pet?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Agende agora mesmo pelo WhatsApp e garanta uma vaga para seu melhor amigo.
            Resposta em até 2 horas.
          </p>
          
          <a 
            href="https://wa.me/5511999999999?text=Olá! Gostaria de agendar um serviço para meu pet."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-light text-white px-10 py-5 rounded-full font-semibold text-xl btn-magnetic btn-slide"
          >
            <span>Agendar pelo WhatsApp</span>
            <ArrowRight className="w-6 h-6" />
          </a>

          <div className="flex items-center justify-center gap-8 mt-12 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>Confirmação imediata</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>Sem taxa adicional</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span>取消amento.grátis</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contato" className="bg-primary rounded-t-[4rem] pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🐾</span>
                <span className="font-heading font-bold text-2xl text-white">{brand.name}</span>
              </div>
              <p className="text-white/60 mb-6 max-w-md">
                {brand.purpose}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent transition-colors">
                  <InstagramIcon />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-accent transition-colors">
                  <FacebookIcon />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Links</h4>
              <ul className="space-y-3">
                <li><a href="#servicos" className="text-white/60 hover:text-white transition-colors">Serviços</a></li>
                <li><a href="#equipe" className="text-white/60 hover:text-white transition-colors">Equipe</a></li>
                <li><a href="#depoimentos" className="text-white/60 hover:text-white transition-colors">Depoimentos</a></li>
                <li><a href="#agendar" className="text-white/60 hover:text-white transition-colors">Agendar</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-4">Contato</h4>
              <ul className="space-y-3 text-white/60">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Rua example, 123 - São Paulo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>contato@petlove.com.br</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="font-mono">Sistema Operacional</span>
            </div>
            <p className="text-white/40 text-sm">
              © 2024 {brand.name}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App