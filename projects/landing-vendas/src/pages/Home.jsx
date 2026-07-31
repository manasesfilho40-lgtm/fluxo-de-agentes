import { useState, useEffect, useRef } from 'react'
import { 
  Check, Shield, ArrowRight, ChevronDown, ChevronUp, 
  Zap, Clock, Target, TrendingUp, Play, Users,
  Flame, CircleDot, RotateCcw, Crosshair, Heart, Dumbbell,
  Brain, Grid3X3, BarChart3, BookOpen, Package, Gift
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
function Hero({ onCheckout }) {
  return (
    <section className="min-h-[80vh] flex items-center relative overflow-hidden bg-dark">
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff87' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-dark/80" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20 w-full">
        <div className="max-w-4xl">
          <div className="badge mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            300+ entrenamientos en video
          </div>

          <h1 className="font-display text-hero md:text-hero-lg font-extrabold uppercase tracking-tight leading-[1.02] mb-5 animate-fade-in-up-delay-1">
            ¿CANSADO DE PASAR
            <br />
            LOS <span className="text-neon">MISMOS ENTRENAMIENTOS</span>
            <br />
            TODA LA SEMANA?
          </h1>

          <p className="text-gray-100 text-body-lg max-w-2xl mb-7 leading-relaxed animate-fade-in-up-delay-2">
            Ten un banco de <strong className="text-white">300+ entrenamientos listos en video</strong>, organizados en 13 categorías, del principiante al avanzado. Sin planificación, sin repetición.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up-delay-3">
            <a
              href="https://pay.cakto.com.br/9fuib6v_992374"
              target="_blank"
              rel="noopener noreferrer"
              onClick={onCheckout}
              className="btn-primary px-8 py-4 text-base animate-pulse-neon"
            >
              QUIERO MI ACCESO
              <ArrowRight size={18} />
            </a>
            <span className="text-gray-200 text-sm flex items-center gap-2">
              <Shield size={14} className="text-neon" />
              7 días de garantía
            </span>
          </div>
        </div>
      </div>
    </section>
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
        <p className="text-body-lg md:text-xl text-gray-100 leading-relaxed">
          Abres Google, buscas "entrenamiento de fútbol" y encuentras lo mismo de siempre.
          <br className="hidden md:block" />
          <strong className="text-white"> Balones, conos y botas.</strong> Sin progresión. Sin estructura.
          <br className="hidden md:block" />
          Tus jugadores hacen el mismo ejercicio desde hace meses y <strong className="text-white">tú no sabes cómo hacerlos evolucionar.</strong>
        </p>
      </div>
    </section>
  )
}

// ============================================
// SOLUCIÓN
// ============================================
function Solution() {
  const [ref, isVisible] = useScrollAnimation()
  
  const features = [
    { icon: Play, title: '300+ Videos', desc: 'Entrenamientos completos en video, fáciles de seguir' },
    { icon: Target, title: '13 Categorías', desc: 'Organizado para que encuentres rápido lo que necesitas' },
    { icon: TrendingUp, title: 'Progresión Clara', desc: 'Del principiante al avanzado, con metodología real' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">La solución</span>
          <h2 className="section-title mb-3">El Pack de Entrenamientos Profesionales</h2>
          <p className="section-desc max-w-2xl mx-auto">
            Un banco completo con <strong className="text-white">300+ entrenamientos en video</strong>, organizados por categoría, nivel y rango de edad. Listo para aplicar.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <div key={i} className="card-base p-card-lg text-center">
              <div className="icon-box mx-auto mb-4">
                <feat.icon size={20} className="text-white" />
              </div>
              <h3 className="font-bold text-white mb-2 text-small">{feat.title}</h3>
              <p className="text-gray-200 text-xs">{feat.desc}</p>
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
                    <IconComponent size={18} className={isFeatured ? 'text-neon' : 'text-gray-200'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-xs mb-0.5">{cat.name}</h3>
                    <p className="text-gray-200 text-2xs leading-relaxed">{cat.desc}</p>
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
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!videoRef.current || !shouldLoad) return
    const timer = setTimeout(() => {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {})
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
          preload="none"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}

function VideoGallery() {
  const [ref, isVisible] = useScrollAnimation()
  
  const row1 = [
    '/videos/video-03.mp4', '/videos/video-04.mp4', '/videos/video-05.mp4',
    '/videos/video-06.mp4', '/videos/video-07.mp4', '/videos/video-08.mp4',
    '/videos/video-09.mp4', '/videos/video-10.mp4', '/videos/video-01.mp4',
    '/videos/video-02.mp4',
  ]

  const row2 = [
    '/videos/video-11.mp4', '/videos/video-12.mp4', '/videos/video-13.mp4',
    '/videos/video-14.mp4', '/videos/video-15.mp4', '/videos/video-16.mp4',
    '/videos/video-17.mp4', '/videos/video-18.mp4', '/videos/video-19.mp4',
    '/videos/video-20.mp4', '/videos/video-21.mp4',
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="text-center">
          <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white mb-3">
            ¡Ve lo que vas a recibir!
          </h2>
          <p className="section-desc">Más de 300 entrenamientos organizados por categoría y nivel</p>
        </div>
      </div>

      <div className="relative mb-3">
        <div className="flex gap-2.5 animate-marquee-left">
          {[...row1, ...row1].map((src, i) => (
            <VideoCard key={`r1-${i}`} src={src} startDelay={i * 100} />
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-2.5 animate-marquee-right">
          {[...row2, ...row2].map((src, i) => (
            <VideoCard key={`r2-${i}`} src={src} startDelay={i * 100 + 50} />
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-2xs text-gray-300">+300 entrenamientos organizados por categoría y nivel</p>
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
                <p className="text-gray-200 text-xs">{point.desc}</p>
              </div>
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
  
  return (
    <section ref={ref} className={`relative py-section-lg overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Fundo escuro com glow */}
      <div className="absolute inset-0 bg-[#0a0f0a]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[120px]" />
      
      {/* Partículas douradas */}
      <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(250,204,21,0.6)]" />
      <div className="absolute top-[30%] right-[20%] w-1 h-1 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(253,224,71,0.5)]" style={{animationDelay: '0.5s'}} />
      <div className="absolute top-[60%] left-[10%] w-1 h-1 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(250,204,21,0.5)]" style={{animationDelay: '1s'}} />
      <div className="absolute top-[70%] right-[12%] w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(253,224,71,0.6)]" style={{animationDelay: '1.5s'}} />
      <div className="absolute top-[15%] left-[40%] w-1 h-1 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(250,204,21,0.4)]" style={{animationDelay: '0.3s'}} />
      <div className="absolute top-[80%] right-[35%] w-1 h-1 bg-yellow-300 rounded-full animate-pulse shadow-[0_0_8px_2px_rgba(253,224,71,0.4)]" style={{animationDelay: '0.8s'}} />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white mb-3">
          ¡Obtén tu Regalo!
        </h2>
        <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto">
          Garantizando tu acceso hoy, llevas de gracia la <span className="text-neon font-bold">Guía de Entrenamientos en Casa</span> para transformar cualquier lugar en tu campo de entrenamiento.
        </p>

        {/* Mockup do ebook */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-neon/20 blur-[60px] rounded-full" />
          <img 
            src="/images/guia-mockup.png" 
            alt="Guía de Entrenamientos en Casa"
            className="relative w-full max-w-[300px] drop-shadow-[0_20px_60px_rgba(0,255,135,0.3)]"
          />
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
function Offer({ onCheckout }) {
  const [ref, isVisible] = useScrollAnimation()
  
  const benefits = [
    '300+ entrenamientos en video',
    '13 categorías organizadas',
    'Progresión del principiante al avanzado',
    '4 rangos de edad',
    'Acceso de por vida + actualizaciones',
    'Guía de entrenamientos en casa (Bonus)',
    'Lista de materiales alternativos (Bonus)',
  ]

  return (
    <section ref={ref} className={`relative py-section-lg overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Fundo verde escuro com glow sutil */}
      <div className="absolute inset-0 bg-[#0a1f15]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-neon/8 rounded-full blur-[100px]" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section md:text-section-md font-extrabold uppercase tracking-tight text-white leading-tight mb-4">
          ¿Cuánto vale todo esto?
        </h2>

        {/* Card com sombra suave e cantos arredondados */}
        <div className="bg-white rounded-[20px] p-card-lg mb-7 max-w-lg mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <div className="space-y-2.5 mb-5 text-left">
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

        <a
          href="https://pay.cakto.com.br/9fuib6v_992374"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onCheckout}
          className="btn-primary px-10 py-5 text-lg mb-4"
        >
          GARANTIZAR MI ACCESO
          <ArrowRight size={18} />
        </a>

        <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
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
        <div className="bg-dark-50 border border-white/[0.06] rounded-card-lg p-card-lg text-center">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
            <Shield size={24} className="text-white" />
          </div>
          <h2 className="text-subtitle md:text-xl font-extrabold text-white mb-3">Garantía de 7 días</h2>
          <p className="text-gray-200 text-small leading-relaxed max-w-xl mx-auto">
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
                    <ChevronUp size={14} className="text-gray-200" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-200" />
                  )}
                </div>
              </button>
              {openIndex === i && (
                <div className="px-5 pb-4">
                  <p className="text-gray-200 text-xs leading-relaxed">{faq.a}</p>
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
function FinalCTA({ onCheckout }) {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-xl bg-dark border-t border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-section-md md:text-3xl font-extrabold text-white leading-tight mb-4">
          DEJA DE REINVENTAR LA RUEDA CADA SEMANA
        </h2>
        <p className="text-gray-200 text-body-lg mb-7 max-w-xl mx-auto">
          Ten un banco de entrenamientos listo, organizado y probado. 
          <strong className="text-white"> Ahorra tiempo</strong> y <strong className="text-white">eleva la calidad</strong> de tus entrenamientos.
        </p>

        <div className="inline-flex items-baseline gap-3 bg-dark-50 border border-white/[0.06] rounded-card-lg px-8 py-5 mb-7">
          <span className="price-old">{BRAND.oldPrice}</span>
          <span className="price-current">{BRAND.price}</span>
          <span className="inline-flex items-center bg-orange text-white text-xs font-bold px-2 py-0.5 rounded">-85%</span>
        </div>

        <div className="mb-5">
          <a
            href="https://pay.cakto.com.br/9fuib6v_992374"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCheckout}
            className="btn-primary px-10 py-5 text-lg animate-pulse-neon"
          >
            QUIERO MI ACCESO AHORA
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-200">
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
function StickyMobileCTA({ onCheckout }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-dark border-t border-white/[0.06] p-3 lg:hidden transition-transform duration-300"
      style={{ transform: show ? 'translateY(0)' : 'translateY(100%)' }}
    >
      <a
        href="https://pay.cakto.com.br/9fuib6v_992374"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onCheckout}
        className="btn-primary w-full py-3 text-sm"
      >
        QUIERO MI ACCESO — {BRAND.price}
        <ArrowRight size={16} />
      </a>
      <p className="text-center text-2xs text-gray-300 mt-1.5">
        7 días de garantía · Acceso inmediato
      </p>
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
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'InitiateCheckout', {
        content_name: '300+ Entrenamientos de Fútbol',
        value: 7,
        currency: 'USD'
      })
    }
  }

  return (
    <>
      <TopBanner />
      <Hero onCheckout={handleCheckout} />
      <VideoGallery />
      <BonusSection onCheckout={handleCheckout} />
      <Solution />
      <Categories />
      <Authority />
      <Offer onCheckout={handleCheckout} />
      <Guarantee />
      <FAQ />
      <FinalCTA onCheckout={handleCheckout} />
      <StickyMobileCTA onCheckout={handleCheckout} />
    </>
  )
}
