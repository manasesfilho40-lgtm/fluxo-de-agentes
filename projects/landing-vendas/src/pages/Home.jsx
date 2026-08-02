import { useState, useEffect, useRef } from 'react'
import { 
  Check, Shield, ArrowRight, ChevronDown, ChevronUp, 
  Zap, Clock, Target, TrendingUp, Play, Users,
  Flame, CircleDot, RotateCcw, Crosshair, Heart, Dumbbell,
  Brain, Grid3X3, BarChart3, BookOpen, Package, Gift, Star
} from 'lucide-react'
import { BRAND, CATEGORIES, FAQS } from '../data'

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const categoryIcons = {
  'calentamiento': Flame,
  'control': CircleDot,
  'passe': Target,
  'dribling': RotateCcw,
  'finalizacion': Crosshair,
  'agilidad': Zap,
  'resistencia': Heart,
  'fuerza': Dumbbell,
  'portero': Shield,
  'conceptual': Brain,
  'colectivo': Users,
  'reducido': Grid3X3,
  'evaluacion': BarChart3,
}

const COMPLETE_PACK = {
  price: '$12',
  oldPrice: '$79',
  savings: '$67',
  discount: '-85%',
}

// ============================================
// EBOOK 3D - PERFORMANCE STRATEGY
// ============================================
function Ebook3D({ size = 'small' }) {
  const isSmall = size === 'small'
  const w = isSmall ? 'w-[70px]' : 'w-[120px]'
  const h = isSmall ? 'h-[95px]' : 'h-[160px]'

  return (
    <div className={`${w} ${h} shrink-0 relative`} style={{ perspective: '500px' }}>
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-22deg) rotateX(4deg)' }}
      >
        {/* Pages */}
        <div className="absolute top-[4%] right-0 h-[92%] w-[5px] rounded-r-sm" style={{ background: 'linear-gradient(to right, #e0dcd4, #f0ede6, #e0dcd4)', transform: 'translateZ(-2px)', boxShadow: '2px 0 4px rgba(0,0,0,0.2)' }} />
        <div className="absolute top-[5%] right-0 h-[90%] w-[3px] rounded-r-sm" style={{ background: '#d8d3ca', transform: 'translateZ(-4px)' }} />

        {/* Spine */}
        <div className="absolute top-0 left-0 h-full w-[12px] rounded-l" style={{ background: 'linear-gradient(to right, #b5ada0, #c5beb2, #b5ada0)', transform: 'rotateY(90deg) translateZ(-6px)', transformOrigin: 'left center' }} />

        {/* Front Cover */}
        <div className="absolute inset-0 rounded-md overflow-hidden" style={{ background: 'linear-gradient(155deg, #f2efe8 0%, #eae6de 35%, #e0dcd3 100%)', boxShadow: '3px 3px 12px rgba(0,0,0,0.35), 6px 6px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, rgba(0,180,100,0.4), transparent)' }} />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
            <div className="w-6 h-[2px] rounded-full mb-1.5" style={{ background: 'rgba(0,0,0,0.15)' }} />
            <div className="w-4 h-4 rounded-full border-[1.5px] mb-2 flex items-center justify-center" style={{ borderColor: 'rgba(0,0,0,0.15)' }}>
              <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }} />
            </div>
            <div className="text-center leading-none">
              <span className="block font-black uppercase tracking-wider text-dark" style={{ fontSize: isSmall ? '7px' : '11px', fontFamily: "'Inter', sans-serif" }}>Performance</span>
              <span className="block font-black uppercase tracking-wider mt-px" style={{ fontSize: isSmall ? '7px' : '11px', color: '#00b464', fontFamily: "'Inter', sans-serif" }}>Strategy</span>
            </div>
          </div>

          {/* Edge highlight */}
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-white/40" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// TOP BANNER
// ============================================
function TopBanner() {
  return (
    <section className="relative w-full bg-dark pt-16 md:pt-24">
      <img
        src="/images/WhatsApp Image 2026-07-30 at 9.12.14 PM.jpeg"
        alt="+300 entrenamientos en vídeo - Acceso inmediato"
        className="w-full h-auto object-cover"
      />
    </section>
  )
}

// ============================================
// HERO
// ============================================
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo estádio */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1920&q=80")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#050708]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-10">
        {/* Phone Mockup + Video */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-neon/10 blur-[80px] rounded-full" />
            <div className="relative bg-dark rounded-[3rem] p-3 border-4 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-[340px] mx-auto w-full sm:max-w-[420px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark rounded-b-2xl z-10" />
              <div className="rounded-[2.25rem] overflow-hidden bg-dark-100 aspect-[9/19]">
                <video 
                  src="/videos/videoemespanhol.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Headline emocional */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="font-display text-hero md:text-hero-lg font-extrabold uppercase tracking-tight leading-[1.05] mb-5 text-white">
            DEJA DE GASTAR EN ESCUELAS CARAS.
            <br />
            CONOCE EL PACK QUE TRANSFORMÓ
            <br />
            <span className="text-neon">MILES DE ENTRENAMIENTOS</span>
          </h1>

          <p className="text-white text-body-lg max-w-xl mx-auto leading-relaxed mb-2">
            Todo lo que necesitas para evolucionar de verdad, directo en tu celular. 
            Entrenamientos profesionales en vídeo, fáciles de repetir y con resultados desde las primeras semanas.
          </p>
        </div>

        {/* Badges de features */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Play size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">+300 Entrenamientos en Vídeo</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <TrendingUp size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">Evolução Constante</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Shield size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">Conteúdo Profissional</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Clock size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">Acceso 24h por Día</span>
          </div>
        </div>

        {/* Guarantee badges only */}
        <div className="text-center">
          <p className="text-gray-light text-xs mt-3 flex items-center justify-center gap-2">
            <Shield size={12} className="text-neon" />
            7 días de garantía · Acceso inmediato · Acceso de por vida
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// MODAL DE UPSELL
// ============================================
function UpsellModal({ isOpen, onClose, onCheckout }) {
  const [countdown, setCountdown] = useState(600)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedCountdown = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-dark-100 border-2 border-neon/30 rounded-2xl overflow-hidden max-w-md w-full shadow-[0_0_60px_rgba(0,255,135,0.2)] animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-neon/20 to-neon/10 px-5 py-4 text-center border-b border-white/[0.06]">
          <span className="text-neon text-2xs font-black uppercase tracking-wider">¡Espera! Tenemos una oferta especial para ti</span>
        </div>

        <div className="p-5">
          {/* Card Pack Completo */}
          <div className="relative bg-dark-200 border border-neon/30 rounded-xl overflow-hidden mb-4">
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1 bg-neon text-dark text-2xs font-black px-3 py-1 rounded-b-lg shadow-lg">
                ★ MÁS VENDIDO
              </span>
            </div>
            <div className="relative h-32 overflow-hidden">
              <img 
                src="/images/WhatsApp Image 2026-07-30 at 9.12.14 PM.jpeg" 
                alt="Pack Completo"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center bg-orange text-white text-2xs font-bold px-2 py-0.5 rounded">-85%</span>
              </div>
            </div>
              <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-white text-[11px] sm:text-[12px] mb-3">
                <Check size={12} className="text-emerald-300" />
                <span>+1.200 entrenadores ya lo compraron</span>
              </div>
              <p className="text-yellow-400 text-2xs font-bold uppercase mb-1">TODO LO QUE NECESITAS + BONUS EXCLUSIVO</p>
              <div className="w-full mb-3 rounded-2xl bg-red-900/30 border border-red-500/20 px-3 py-2 text-orange-200 text-[11px] sm:text-[12px] font-semibold inline-flex items-center justify-center gap-2">
                <Clock size={16} className="text-orange-300" />
                <span>Oferta expira en {formattedCountdown}</span>
              </div>
              <div className="mb-3">
                <span className="text-gray-400 text-sm line-through">{COMPLETE_PACK.oldPrice}</span>
                <p className="text-3xl font-extrabold text-white">{COMPLETE_PACK.price}</p>
                <span className="text-2xs text-gray-light">pago único · acceso de por vida</span>
              </div>
                <ul className="space-y-2 text-left max-w-xs mx-auto mb-4">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-neon shrink-0 mt-0.5" />
                  <span className="text-white text-2xs">Organizados en 13 categorías por nivel</span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white text-2xs">+ Guía de Entrenamientos en Casa <span className="text-yellow-400 font-bold">(Bonus)</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Gift size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white text-2xs">+ Lista de Materiales Alternativos <span className="text-yellow-400 font-bold">(Bonus)</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-neon shrink-0 mt-0.5" />
                  <span className="text-white text-2xs">Acceso de por vida + actualizaciones</span>
                </li>
              </ul>
              <div className="mt-4 rounded-xl overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                <div className="p-3 sm:p-4 flex items-center gap-3">
                  <Ebook3D size="small" />
                  <div>
                    <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2 py-0.5 mb-1.5">
                      <Gift size={10} className="text-yellow-400" />
                      <span className="text-yellow-400 text-2xs font-black uppercase">Bonus Turbo</span>
                    </div>
                    <p className="text-white text-xs sm:text-sm font-bold leading-tight">Guía de Entrenamientos en Casa</p>
                    <p className="text-gray-light text-2xs leading-tight">Arma entrenamientos profesionales sin cancha ni material extra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <a
            href="https://pay.cakto.com.br/9fuib6v_992374"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onCheckout()}
            className="inline-flex w-full justify-center items-center gap-2 btn-primary py-3.5 text-sm mb-3 animate-pulse-neon"
          >
            QUIERO EL PACK COMPLETO
            <ArrowRight size={16} />
          </a>

          <button
            type="button"
            onClick={() => {
              try {
                onCheckout()
              } catch (e) {
                console.warn('checkout fallback:', e)
              }
              window.location.href = 'https://pay.cakto.com.br/f48jaku_1013948'
            }}
            className="block w-full text-center text-gray-light text-xs py-2 hover:text-white transition-colors"
          >
            No gracias, prefiero el pack básico
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// DOLOR
// ============================================
function PainBlock() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-10 md:py-14 bg-dark-50 border-y border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-white mb-4">
          ¿CANSADO DE PASAR LOS MISMOS ENTRENAMIENTOS...?
        </h2>
        <p className="text-body-lg md:text-xl text-white leading-relaxed">
          Deja de perder tiempo inventando rutinas desde cero. Descubre cómo mantener a tus jugadores motivados, mejorar su nivel técnico y táctico con ejercicios probados en el campo. <strong className="text-neon">Solo dale play y aplícalo hoy mismo.</strong>
        </p>
      </div>
    </section>
  )
}

// ============================================
// PRICING CARDS
// ============================================
function PricingCards({ onCheckout }) {
  const [ref, isVisible] = useScrollAnimation()
  const [showUpsell, setShowUpsell] = useState(false)
  const [countdown, setCountdown] = useState(600)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedCountdown = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

  return (
    <>
      <UpsellModal 
        isOpen={showUpsell} 
        onClose={() => setShowUpsell(false)} 
        onCheckout={onCheckout} 
      />
      <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">
              ESCOJE EL PACK PARA LA <span className="text-neon">EVOLUCIÓN</span> DE TU EQUIPO 👇
            </h2>
            <p className="section-desc max-w-2xl mx-auto">
              Selecciona el acceso ideal y mira los entrenamientos subir de nivel esta misma semana.
            </p>
          </div>

          {/* Cards de Preço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full max-w-full lg:max-w-5xl mx-auto">
            {/* Pack Básico */}
            <div
              className="bg-dark-50 border border-white/[0.08] rounded-2xl overflow-hidden min-w-0 cursor-pointer"
              onClick={() => setShowUpsell(true)}
            >
              <div className="relative h-28 sm:h-48 bg-dark-100 overflow-hidden">
                <img 
                  src="/images/WhatsApp Image 2026-07-30 at 9.12.14 PM.jpeg" 
                  alt="Pack Básico - +300 entrenamientos"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center bg-orange text-white text-2xs font-bold px-2 py-0.5 rounded">{BRAND.discount}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4">
                  <span className="text-2xs font-bold text-neon uppercase tracking-wider">Pack Básico</span>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <h3 className="font-display text-sm sm:text-xl font-extrabold uppercase text-white mb-1">Entrenamientos en video</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-gray-400 text-xs sm:text-sm line-through">{BRAND.oldPrice}</span>
                  <p className="text-2xl sm:text-4xl font-extrabold text-white">{BRAND.price}</p>
                  <p className="text-neon text-xs font-bold mt-1">Menos de 3¢ por vídeo</p>
                  <span className="text-2xs text-gray-light">pago único</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpsell(true)}
                  className="block w-full text-center btn-primary py-3 sm:py-3.5 text-2xs sm:text-sm mb-3"
                >
                  GARANTIR AGORA
                </button>
                <p className="text-gray-light text-2xs sm:text-xs mb-4">
                  Haz clic para recibir la oferta especial con bonus incluidos antes de comprar el pack básico.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+300 entrenamientos en video</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acceso inmediato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acceso de por vida</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pack Completo + Bonus */}
            <div className="relative bg-dark-100 border-2 border-neon/40 rounded-2xl overflow-hidden shadow-neon-strong min-w-0">
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1 bg-neon text-dark text-[10px] sm:text-2xs font-black px-3 py-1 rounded-full shadow-lg">
                  ★ MÁS VENDIDO
                </span>
              </div>
              <div className="absolute top-12 right-3 z-20 flex items-center gap-1 rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[10px] text-emerald-300">
                <Check size={12} className="text-emerald-300" />
                +1.200 personas ya lo compraron
              </div>
              <div className="relative h-28 sm:h-48 bg-dark-200 overflow-hidden">
                <img 
                  src="/images/WhatsApp Image 2026-07-30 at 9.12.14 PM.jpeg" 
                  alt="Pack Completo - +300 entrenamientos + Bonus"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center bg-orange text-white text-2xs font-bold px-2 py-0.5 rounded">{COMPLETE_PACK.discount}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4">
                  <span className="text-2xs font-bold text-yellow-400 uppercase tracking-wider">Pack Completo + Bonus</span>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <h3 className="font-display text-sm sm:text-xl font-extrabold uppercase text-white mb-1">Entrenamientos en video + Bonus</h3>
                <div className="mb-3 sm:mb-4">
                  <div className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-900/30 border border-red-500/20 px-3 py-2 text-[11px] sm:text-[12px] text-orange-200 font-semibold mb-3">
                    <Clock size={14} className="text-orange-300" />
                    <span>Oferta expira en {formattedCountdown}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm line-through">{COMPLETE_PACK.oldPrice}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold px-2 py-1">Ahorras {COMPLETE_PACK.savings}</span>
                  </div>
                  <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">{COMPLETE_PACK.price}</p>
                  <p className="text-neon text-xs font-bold mt-1">Menos de 4¢ por vídeo</p>
                  <span className="text-2xs text-gray-light">pago único</span>
                </div>
                <a
                  href="https://pay.cakto.com.br/9fuib6v_992374"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onCheckout}
                  className="block w-full text-center btn-primary py-3 sm:py-3.5 text-2xs sm:text-sm mb-2 animate-pulse-neon"
                >
                  QUIERO MI ACCESO
                </a>
                <p className="text-gray-light text-[10px] sm:text-[11px] text-center mb-4">Acceso instantáneo, sin esperas</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+300 entrenamientos en video</span>
                  </li>
                  <li className="flex items-start gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3">
                    <Gift size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+ Guía de Entrenamientos en Casa <span className="text-yellow-400 font-bold">(Bonus)</span></span>
                  </li>
                  <li className="flex items-start gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3">
                    <Gift size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+ Lista de Materiales Alternativos <span className="text-yellow-400 font-bold">(Bonus)</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acceso de por vida + actualizaciones</span>
                  </li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-2xs text-gray-light">
                  <Shield size={14} className="text-neon shrink-0" />
                  Garantía de 7 días o te devolvemos tu dinero
                </div>

                {/* Bônus Turbo */}
                <div className="mt-4 rounded-xl overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                  <div className="p-3 sm:p-4 flex items-center gap-3">
                    <Ebook3D size="small" />
                    <div>
                      <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2 py-0.5 mb-1.5">
                        <Gift size={10} className="text-yellow-400" />
                        <span className="text-yellow-400 text-2xs font-black uppercase">Bonus Turbo</span>
                      </div>
                      <p className="text-white text-xs sm:text-sm font-bold leading-tight">Cartilha Entrenamientos en Casa</p>
                      <p className="text-gray-light text-2xs leading-tight">Transforma cualquier lugar en tu CT</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ============================================
// SOLUCIÓN (simplificada - só headline)
// ============================================
function Solution() {
  const [ref, isVisible] = useScrollAnimation()
  
  const points = [
    { num: '1', title: 'Progresión pedagógica real', desc: 'Cada entrenamiento sigue una lógica de evolución. No son ejercicios aleatorios.' },
    { num: '2', title: 'Clasificación por nivel', desc: 'Principiante, intermedio y avanzado. Sabes exactamente qué entrenamiento aplicar.' },
    { num: '3', title: 'Adaptable a cualquier realidad', desc: 'Cancha, cancha techada, patio. Con o sin equipamiento.' },
    { num: '4', title: 'Videos cortos y directos', desc: 'Entrenamientos de 5 a 15 minutos, fáciles de explicar.' },
    { num: '5', title: 'Enfoque en ejecución', desc: 'Cada ejercicio demostrado con técnica correcta.' },
    { num: '6', title: 'Acceso de por vida', desc: 'Pagas una vez, usas para siempre. Incluye actualizaciones.' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Metodología</span>
          <h2 className="section-title mb-3">Por qué este pack funciona</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="icon-box-sm">
                <span className="text-white font-bold text-xs">{point.num}</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-small">{point.title}</h3>
                <p className="text-white text-xs">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CATEGORÍAS
// ============================================
function Categories() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Lo que incluye</span>
          <h2 className="section-title mb-3">13 categorías de entrenamiento</h2>
          <p className="section-desc">Cada categoría resuelve un problema específico de tu planificación</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => {
            const IconComponent = categoryIcons[cat.id] || Target
            const isFeatured = i < 3
            return (
              <div key={i} className={isFeatured ? 'card-featured p-card' : 'card-base p-card'}>
                <div className="flex items-start gap-3">
                  <div className={isFeatured ? 'icon-box-neon' : 'icon-box'}>
                    <IconComponent size={18} className={isFeatured ? 'text-neon' : 'text-white'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-xs mb-0.5">{cat.name}</h3>
                    <p className="text-white text-2xs leading-relaxed">{cat.desc}</p>
                    <span className="badge-sm mt-1.5 inline-block">
                      {cat.count} entrenamientos
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ============================================
// GALERÍA DE VIDEOS
// ============================================
function VideoCard({ src, startDelay = 0 }) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return
    const timer = setTimeout(() => {
      videoRef.current?.play().catch(() => {})
    }, startDelay)
    return () => clearTimeout(timer)
  }, [shouldLoad, startDelay])

  return (
    <div 
      ref={containerRef}
      className="shrink-0 w-[110px] md:w-[130px] aspect-[9/16] bg-dark-100 rounded-card overflow-hidden relative border border-white/[0.06]"
    >
      {shouldLoad && (
        <video 
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover"
          muted 
          loop 
          playsInline
          preload="metadata"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}

function VideoGallery() {
  const [ref, isVisible] = useScrollAnimation()
  
  // Reduzido para 8 vídeos para carregamento mais rápido
  const videos = [
    '/videos/video-01.mp4',
    '/videos/video-02.mp4',
    '/videos/video-03.mp4',
    '/videos/video-04.mp4',
    '/videos/video-05.mp4',
    '/videos/video-06.mp4',
    '/videos/video-06.mp4',
    '/videos/video-07.mp4',
  ]

  return (
    <section ref={ref} className={`pt-0 pb-section-lg bg-dark overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6 mt-2">
        <div className="text-center">
          <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white mb-3">
            ¡Ve lo que vas a recibir!
          </h2>
          <p className="section-desc">+300 entrenamientos organizados por categoría y nivel</p>
        </div>
      </div>

      <div className="relative mb-3">
        <div className="flex gap-2.5 animate-marquee-left">
          {[...videos, ...videos].map((src, i) => (
            <VideoCard key={`r1-${i}`} src={src} startDelay={i * 80} />
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-2.5 animate-marquee-right">
          {[...videos, ...videos].map((src, i) => (
            <VideoCard key={`r2-${i}`} src={src} startDelay={i * 80 + 40} />
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-2xs text-white italic">Ejemplos de ejercicios inclusos en el pack</p>
      </div>
    </section>
  )
}

// ============================================
// METODOLOGÍA
// ============================================
function Authority() {
  const [ref, isVisible] = useScrollAnimation()
  
  const points = [
    { num: '1', title: 'Progresión pedagógica real', desc: 'Cada entrenamiento sigue una lógica de evolución. No son ejercicios aleatorios.' },
    { num: '2', title: 'Clasificación por nivel', desc: 'Principiante, intermedio y avanzado. Sabes exactamente qué entrenamiento aplicar.' },
    { num: '3', title: 'Adaptable a cualquier realidad', desc: 'Cancha, cancha techada, patio. Con o sin equipamiento.' },
    { num: '4', title: 'Videos cortos y directos', desc: 'Entrenamientos de 5 a 15 minutos, fáciles de explicar.' },
    { num: '5', title: 'Enfoque en ejecución', desc: 'Cada ejercicio demostrado con técnica correcta.' },
    { num: '6', title: 'Acceso de por vida', desc: 'Pagas una vez, usas para siempre. Incluye actualizaciones.' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Metodología</span>
          <h2 className="section-title mb-3">Por qué este pack funciona</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="icon-box-sm">
                <span className="text-white font-bold text-xs">{point.num}</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1 text-small">{point.title}</h3>
                <p className="text-white text-xs">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// DEPOIMENTOS
// ============================================
function Testimonials() {
  const [ref, isVisible] = useScrollAnimation()

  const testimonials = [
    {
      name: 'Carlos Medina',
      role: 'Entrenador Sub-15',
      text: 'Antes pasaba 3 horas por semana armando entrenamientos. Ahora abro el pack, elijo la categoría y aplico. Mis jugadores están evolucionando mucho más rápido.',
    },
    {
      name: 'Fernanda López',
      role: 'Profesora de Ed. Física',
      text: 'Lo uso con toda la clase en la escuela. Los alumnos adoran porque parece entrenamiento de jugador profesional. Y yo ahorro un tiempo absurdo de planificación.',
    },
    {
      name: 'Rafael Sánchez',
      role: 'Dueño de escuelita',
      text: 'Ya probé varios materiales y este es el más completo. La progresión por nivel hace la diferencia. Lo recomiendo para cualquier entrenador.',
    },
    {
      name: 'Pedro Herrera',
      role: 'Entrenador de Base',
      text: 'Los entrenamientos son cortos, directos y fáciles de explicar. Perfecto para quien trabaja con grupos grandes y poco tiempo.',
    },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Resultados reales</span>
          <h2 className="section-title mb-3">LO QUE DICEN LOS ENTRENADORES</h2>
          <p className="section-desc max-w-xl mx-auto">
            Profesionales de toda Latinoamérica ya están transformando sus entrenamientos
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="card-base p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center shrink-0">
                  <span className="text-dark font-bold text-xs">{t.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs truncate">{t.name}</p>
                  <p className="text-gray-light text-2xs truncate">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={12} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white text-2xs leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// BONUS
// ============================================
function BonusSection({ onCheckout }) {
  const [ref, isVisible] = useScrollAnimation()

  const cartilhaImages = [
    '/images/cartilha/page_1.jpeg',
    '/images/cartilha/page_2.jpeg',
    '/images/cartilha/page_3.jpeg',
    '/images/cartilha/page_4.jpeg',
    '/images/cartilha/page_5.jpeg',
    '/images/cartilha/page_6.jpeg',
    '/images/cartilha/page_7.jpeg',
    '/images/cartilha/page_8.jpeg',
    '/images/cartilha/page_9.jpeg',
    '/images/cartilha/page_10.jpeg',
    '/images/cartilha/page_11.jpeg',
    '/images/cartilha/page_12.jpeg',
    '/images/cartilha/page_13.jpeg',
    '/images/cartilha/page_14.jpeg',
    '/images/cartilha/page_15.jpeg',
  ]

  return (
    <section ref={ref} className={`relative py-section-lg overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-[#0a0f0a]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[120px]" />
      
      <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(250,204,21,0.6)]" />
      <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(253,224,71,0.5)]" style={{animationDelay: '0.5s'}} />
      <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(250,204,21,0.5)]" style={{animationDelay: '1s'}} />
      <div className="absolute top-[70%] right-[12%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(253,224,71,0.6)]" style={{animationDelay: '1.5s'}} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white mb-3">
          ¡Obtén tu Regalo!
        </h2>
        <p className="text-white text-sm mb-8 max-w-xl mx-auto">
          Garantizando tu acceso hoy, llevas de gracia la <span className="text-yellow-400 font-bold">Guía de Entrenamientos en Casa</span> para transformar cualquier lugar en tu campo de entrenamiento.
        </p>

        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-neon/20 blur-[60px] rounded-full" />
          <Ebook3D size="normal" />
        </div>

        <div className="mb-8">
          <p className="text-2xs text-gray-light mb-4 uppercase tracking-wider font-semibold">Vista previa de algunas páginas</p>
          <div className="overflow-hidden rounded-xl">
            <div className="flex gap-3 animate-marquee-left">
              {[...cartilhaImages, ...cartilhaImages].map((src, i) => (
                <div key={i} className="shrink-0 w-[140px] md:w-[180px] aspect-[3/4] rounded-lg overflow-hidden border border-white/[0.08] bg-dark-100">
                  <img src={src} alt={`Página ${(i % 15) + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href="https://pay.cakto.com.br/9fuib6v_992374"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCheckout}
          className="btn-primary px-10 py-4 text-base"
        >
          OBTENER MI REGALO
          <Gift size={18} />
        </a>
      </div>
    </section>
  )
}

// ============================================
// OFERTA
// ============================================
function Offer() {
  const [ref, isVisible] = useScrollAnimation()
  
  const benefits = [
    '+300 entrenamientos en video',
    '13 categorías organizadas',
    'Progresión del principiante al avanzado',
    '4 rangos de edad',
    'Acceso de por vida + actualizaciones',
    'Guía de entrenamientos en casa (Bonus)',
    'Lista de materiales alternativos (Bonus)',
  ]

  return (
    <section id="offer-section" ref={ref} className={`relative py-section-lg overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Fundo verde escuro com glow sutil */}
      <div className="absolute inset-0 bg-[#0a1f15]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon/8 rounded-full blur-[100px]" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white leading-tight mb-4">
          ¿Cuánto vale todo esto?
        </h2>

        {/* Card com glow neon e badge de urgência */}
        <div className="relative bg-white rounded-[20px] p-7 md:p-card-lg mb-7 max-w-lg mx-auto shadow-[0_0_30px_rgba(0,255,135,0.25),0_0_60px_rgba(0,255,135,0.1),0_8px_40px_rgba(0,0,0,0.4)] border-2 border-neon/40 scale-[1.03]">
          {/* Badge de urgência */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange to-red-500 text-white text-2xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
              <Flame size={12} />
              Oferta por tiempo limitado
            </span>
          </div>
          {/* Badge MÁS VENDIDO */}
          <div className="absolute -top-3.5 left-5 z-10">
            <span className="inline-flex items-center gap-1 bg-neon text-dark text-2xs font-black px-3 py-1 rounded-full shadow-lg">
              ★ MÁS VENDIDO
            </span>
          </div>

          <div className="space-y-2.5 mb-5 text-left mt-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check size={15} className="text-neon-500 shrink-0" />
                <span className="text-xs font-medium text-gray-800">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-5">
            <p className="text-gray-500 text-xs mb-1">Valor percibido:</p>
            <p className="text-gray-400 text-lg line-through mb-1">{BRAND.oldPrice}</p>
            <p className="text-gray-600 text-xs mb-1">Tu inversión hoy:</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-5xl md:text-6xl font-extrabold text-gray-900">{BRAND.price}</p>
              <span className="inline-flex items-center bg-orange text-white text-xs font-bold px-2.5 py-1 rounded">-85%</span>
            </div>
            <p className="text-gray-400 text-2xs mt-1">pago único · acceso de por vida</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-white text-xs">
          <Shield size={14} />
          <span>7 días de garantía o te devolvemos tu dinero</span>
        </div>
      </div>
    </section>
  )
}

// ============================================
// GARANTÍA
// ============================================
function Guarantee() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-dark-50 border border-white/[0.06] rounded-card-lg p-8 md:p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-subtitle md:text-xl font-extrabold text-white mb-3">Garantía de 7 días</h2>
          <p className="text-white text-small leading-relaxed max-w-xl mx-auto">
            Si dentro de 7 días no crees que el pack vale la inversión, solo manda un email. 
            <strong className="text-white"> Te devolvemos el 100% de tu dinero.</strong> Sin preguntas.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FAQ
// ============================================
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Dudas</span>
          <h2 className="section-title">Preguntas frecuentes</h2>
        </div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <div key={i} className={`card-faq ${openIndex === i ? 'active' : ''}`}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  {openIndex === i ? (
                    <ChevronUp size={14} className="text-white" />
                  ) : (
                    <ChevronDown size={14} className="text-white" />
                  )}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-white text-xs leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA FINAL
// ============================================
function FinalCTA() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-xl bg-dark border-t border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-section-md md:text-3xl font-extrabold text-white leading-tight mb-4">
          DEJA DE REINVENTAR LA RUEDA CADA SEMANA
        </h2>
        <p className="text-white text-body-lg mb-7 max-w-xl mx-auto">
          Ten un banco de entrenamientos listo, organizado y probado. 
          <strong className="text-white"> Ahorra tiempo</strong> y <strong className="text-white">eleva la calidad</strong> de tus entrenamientos.
        </p>

        <div className="inline-flex items-baseline gap-3 bg-dark-50 border border-white/[0.06] rounded-card-lg px-8 py-5 mb-7">
          <span className="price-old">{BRAND.oldPrice}</span>
          <span className="price-current">{BRAND.price}</span>
          <span className="inline-flex items-center bg-orange text-white text-xs font-bold px-2 py-0.5 rounded">-85%</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white">
          <span className="flex items-center gap-1.5">
            <Shield size={13} className="text-neon" />
            7 días de garantía
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-neon" />
            Acceso inmediato
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-neon" />
            Acceso de por vida
          </span>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA FIJO MOBILE
// ============================================
function StickyMobileCTA() {
  const [show, setShow] = useState(false)
  const [atOffer, setAtOffer] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const offerEl = document.getElementById('offer-section')
    if (!offerEl) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAtOffer(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )
    observer.observe(offerEl)
    return () => observer.disconnect()
  }, [])

  const isVisible = show && !atOffer

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-dark border-t border-white/[0.06] px-4 py-3 lg:hidden transition-transform duration-300"
      style={{ transform: isVisible ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-white font-bold text-sm shrink-0">
          {BRAND.price} <span className="text-gray-light font-normal text-2xs">por acceso de por vida</span>
        </span>
        <span className="text-gray-light text-xs shrink-0">Desliza para ver los packs</span>
      </div>
    </div>
  )
}

// ============================================
// PARA QUEM É
// ============================================
function WhoIsItFor() {
  const [ref, isVisible] = useScrollAnimation()

  const personas = [
    { emoji: '⚽', title: 'Entrenadores', desc: 'Que buscan metodologías modernas y ejercicios probados' },
    { emoji: '🏫', title: 'Escuelitas y Academias', desc: 'Que quieren diferenciar su enseñanza' },
    { emoji: '👨‍🏫', title: 'Profesores de Ed. Física', desc: 'Que quieren innovar en sus clases' },
    { emoji: '💪', title: 'Jugadores en desarrollo', desc: 'Que quieren llegar al profesional' },
    { emoji: '🏟️', title: 'Preparadores físicos', desc: 'Que buscan ejercicios de alto rendimiento' },
    { emoji: '❤️', title: 'Amantes del fútbol', desc: 'Que sueñan con evolucionar de verdad' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">¿Para quién es?</span>
          <h2 className="section-title mb-3">Este pack fue hecho para ti</h2>
          <p className="section-desc max-w-xl mx-auto">
            Si te identificas con alguno de estos perfiles, este material es para ti
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((p, i) => (
            <div key={i} className="card-base p-5 flex items-start gap-3">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">{p.title}</h3>
                <p className="text-white text-xs leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// PRUEBA SOCIAL (CONTADOR)
// ============================================
function SocialProof() {
  const [ref, isVisible] = useScrollAnimation()

  const stats = [
    { num: '+300', label: 'Entrenamientos en video' },
    { num: '13', label: 'Categorías organizadas' },
    { num: '+5.000', label: 'Entrenadores activos' },
    { num: '4.9', label: 'Valoración media ⭐' },
  ]

  return (
    <section ref={ref} className={`py-section bg-dark border-y border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-white text-body font-bold">
            +5.000 entrenadores ya transformaron sus sesiones. ¿Y tú, vas a quedarte fuera?
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-neon mb-1">{s.num}</p>
              <p className="text-white text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CÓMO FUNCIONA (VÍDEO DEMO)
// ============================================
// ============================================
// DEPOIMENTOS MELHORADOS
// ============================================
function TestimonialsImproved() {
  const [ref, isVisible] = useScrollAnimation()

  const testimonials = [
    {
      name: 'Carlos Medina',
      role: 'Entrenador Sub-15',
      text: 'Antes pasaba 3 horas por semana armando entrenamientos. Ahora abro el pack, elijo la categoría y aplico. Mis jugadores están evolucionando mucho más rápido.',
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Fernanda López',
      role: 'Profesora de Ed. Física',
      text: 'Lo uso con toda la clase en la escuela. Los alumnos adoran porque parece entrenamiento de jugador profesional. Y yo ahorro un tiempo absurdo de planificación.',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Rafael Sánchez',
      role: 'Dueño de escuelita',
      text: 'Ya probé varios materiales y este es el más completo. La progresión por nivel hace la diferencia. Lo recomiendo para cualquier entrenador.',
      img: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Pedro Herrera',
      role: 'Entrenador de Base',
      text: 'Los entrenamientos son cortos, directos y fáciles de explicar. Perfecto para quien trabaja con grupos grandes y poco tiempo.',
      img: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      name: 'Andrés Torres',
      role: 'Preparador físico',
      text: 'Uso como base para armar los entrenos de mis atletas y ahorro un tiempo absurdo. La parte de preparación física está muy bien pensada, da para adaptar a cualquier edad.',
      img: 'https://randomuser.me/api/portraits/men/56.jpg',
    },
    {
      name: 'Lucas Martínez',
      role: 'Jugador amateur',
      text: 'Empecé en lo básico solo para probar y en dos semanas ya había pasado al completo. En serio, es otro nivel. Sentí diferencia hasta en el partido del domingo.',
      img: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 border-y border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Resultados reales</span>
          <h2 className="section-title mb-3">LO QUE DICEN LOS ENTRENADORES</h2>
          <p className="section-desc max-w-xl mx-auto">
            Profesionales de toda Latinoamérica ya están transformando sus entrenamientos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="card-base p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={t.img} 
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-neon/30"
                />
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{t.name}</p>
                  <p className="text-gray-light text-2xs truncate">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-white text-xs leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/[0.06] rounded-full px-5 py-2.5">
            <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
            <span className="text-white text-xs font-semibold">+5.000 entrenadores satisfechos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// CTA FINAL MELHORADO
// ============================================
function FinalCTAImproved() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-xl bg-dark border-t border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section-md md:text-3xl font-extrabold uppercase leading-tight mb-5 text-white">
          Transforma el futuro de tu equipo por el precio de un <span className="text-neon">cafecito</span>
        </h2>

        <p className="text-gray-light text-body-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Menos que el valor de una sola clase particular, más de <strong className="text-white">300 entrenamientos profesionales</strong> en la pantalla de tu celular. Haz clic en el botón, garantiza los bonus exclusivos y mira, de camarote, la evolución y la satisfacción de tu equipo dominando el campo semana tras semana.
        </p>

        <div className="bg-dark-50 border border-white/[0.06] rounded-card-lg px-6 py-5 mb-7 max-w-md mx-auto">
          <p className="text-gray-light text-sm mb-1">Garantía de satisfacción</p>
          <p className="text-neon text-base font-bold">Compra 100% segura y protegida</p>
        </div>

        <p className="text-gray-light text-xs">
          No pierdas esta oportunidad. Cientos de entrenadores ya están evolucionando.
        </p>
      </div>
    </section>
  )
}

// ============================================
// NOTIFICAÇÕES DE COMPRA
// ============================================
function PurchaseNotifications() {
  const [current, setCurrent] = useState(null)
  const [visible, setVisible] = useState(false)

  const notifications = [
    { name: 'Carlos M.', city: 'Bogotá', time: 'hace 2 min' },
    { name: 'Fernanda L.', city: 'México', time: 'hace 5 min' },
    { name: 'Rafael S.', city: 'Lima', time: 'hace 8 min' },
    { name: 'Pedro H.', city: 'Santiago', time: 'hace 12 min' },
    { name: 'Andrés T.', city: 'Buenos Aires', time: 'hace 3 min' },
    { name: 'Lucas M.', city: 'Medellín', time: 'hace 7 min' },
    { name: 'Marcos R.', city: 'Quito', time: 'hace 10 min' },
    { name: 'Patricia L.', city: 'Caracas', time: 'hace 4 min' },
    { name: 'Joaquín P.', city: 'Montevideo', time: 'hace 6 min' },
    { name: 'Sofía G.', city: 'La Paz', time: 'hace 9 min' },
    { name: 'Diego V.', city: 'Guayaquil', time: 'hace 2 min' },
    { name: 'Camila R.', city: 'San José', time: 'hace 11 min' },
  ]

  useEffect(() => {
    const showRandom = () => {
      const rand = notifications[Math.floor(Math.random() * notifications.length)]
      setCurrent(rand)
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }

    const firstTimeout = setTimeout(showRandom, 5000)
    const interval = setInterval(showRandom, 20000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [])

  if (!current) return null

  return (
    <div 
      className="fixed bottom-20 left-4 z-50 transition-all duration-500"
      style={{ 
        transform: visible ? 'translateX(0)' : 'translateX(-120%)',
        opacity: visible ? 1 : 0
      }}
    >
      <div className="flex items-center gap-3 bg-dark-50 border border-white/[0.08] rounded-xl px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm max-w-[280px]">
        <div className="w-9 h-9 rounded-full bg-neon/20 flex items-center justify-center shrink-0 border border-neon/30">
          <Check size={16} className="text-neon" />
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">
            {current.name} <span className="text-gray-light font-normal">compró</span>
          </p>
          <p className="text-gray-light text-2xs">
            Pack Completo · {current.city} · {current.time}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// EXPORT
// ============================================
export default function Home() {
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_name: '300+ Entrenamientos de Fútbol',
        content_category: ' Curso de Fútbol',
        value: 7,
        currency: 'USD'
      })
    }
  }, [])

  const handleCheckout = () => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: '300+ Entrenamientos de Fútbol',
          value: 7,
          currency: 'USD'
        })
      }
    } catch (e) {
      console.warn('fbq track error:', e)
    }
  }

  return (
    <>
      <Hero />
      <VideoGallery />
      <PricingCards onCheckout={handleCheckout} />
      <BonusSection onCheckout={handleCheckout} />
      <SocialProof />
      <Solution />
      <TestimonialsImproved />
      <Guarantee />
      <FAQ />
      <FinalCTAImproved />
      <PurchaseNotifications />
    </>
  )
}
