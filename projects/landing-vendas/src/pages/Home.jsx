import { useState, useEffect, useRef } from 'react'
import { 
  Check, Shield, ArrowRight, ChevronDown, ChevronUp, 
  Zap, Clock, Target, TrendingUp, Play, Users,
  BookOpen, FileText, Brain, Award, Calendar, Download
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
  'ctb': FileText,
  'ctb-2': FileText,
  'dir-admin': BookOpen,
  'dir-const': BookOpen,
  'dir-penal': FileText,
  'dir-proc-penal': FileText,
  'dir-humanos': FileText,
  'etica': Award,
  'fisica': Brain,
  'geopolitica': Target,
  'informatica': Brain,
  'leg-especial': BookOpen,
  'lingua': BookOpen,
  'raciocinio': Brain,
}

const COMPLETE_PACK = {
  price: '$12',
  oldPrice: '$79',
  savings: '$67',
  discount: '-85%',
}

// ============================================
// TOP BANNER
// ============================================
function TopBanner() {
  return (
    <section className="relative w-full bg-dark pt-16 md:pt-24">
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">PREPARATÓRIO PRF</h2>
          <p className="text-blue-200 text-sm md:text-base">Material completo para sua aprovação</p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// HERO
// ============================================
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo estadio */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#050708]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-10">
        {/* Phone Mockup + Video */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-neon/10 blur-[80px] rounded-full" />
            <div className="relative bg-dark rounded-[3rem] p-3 border-4 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] max-w-[340px] mx-auto w-full sm:max-w-[420px]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark rounded-b-2xl z-10" />
              <div className="rounded-[2.25rem] overflow-hidden bg-dark-100 aspect-[9/19] flex items-center justify-center">
                <div className="text-center p-6">
                  <Brain size={64} className="text-neon mx-auto mb-4" />
                  <p className="text-white font-bold text-lg">14 Disciplinas</p>
                  <p className="text-white/60 text-sm">Material completo em PDF</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Headline emocional */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="font-display text-hero md:text-hero-lg font-extrabold uppercase tracking-tight leading-[1.05] mb-5 text-white">
            DE PARE DE ESTUDAR SEM DIREÇÃO.
            <br />
            CONHEÇA O MATERIAL QUE APROVOU
            <br />
            <span className="text-neon">MILHARES DE CANDIDATOS</span>
          </h1>

          <p className="text-white text-body-lg max-w-xl mx-auto leading-relaxed mb-2">
            Tudo que você precisa para passar de verdade, direto no seu celular. 
            Material completo organizado, focado no edital da PRF e com plano de estudos incluso.
          </p>
        </div>

        {/* Badges de features */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <BookOpen size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">14 Disciplinas Completas</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <FileText size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">19 PDFs de Estudo</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Award size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">5 Bônus Exclusivos</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <Clock size={14} className="text-neon" />
            <span className="text-white text-xs font-semibold">Acesso 24h por Dia</span>
          </div>
        </div>

        {/* Guarantee badges only */}
        <div className="text-center">
          <p className="text-gray-light text-xs mt-3 flex items-center justify-center gap-2">
            <Shield size={12} className="text-neon" />
            7 dias de garantia · Acesso imediato · Acesso vitalício
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
      <div className="relative bg-dark-100 border-2 border-neon/30 rounded-2xl max-w-[340px] w-full shadow-[0_0_60px_rgba(0,255,135,0.2)] animate-scale-in max-h-[70vh] sm:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-neon/20 to-neon/10 px-3 py-2 sm:px-5 sm:py-3 text-center border-b border-white/[0.06] shrink-0">
          <span className="text-neon text-[10px] sm:text-2xs font-black uppercase tracking-wider">Espera! Oferta especial para você</span>
        </div>

        {/* Conteúdo scrollável */}
        <div className="px-3 py-2 sm:px-5 sm:py-4 overflow-y-auto flex-1 min-h-0">
          <div className="relative bg-dark-200 border border-neon/30 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1 bg-neon text-dark text-[9px] sm:text-2xs font-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-b-lg shadow-lg">
                ★ MAIS VENDIDO
              </span>
            </div>
            <div className="relative h-14 sm:h-32 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
                <Brain size={48} className="text-white/50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent" />
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center bg-orange text-white text-[9px] sm:text-2xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded">-85%</span>
              </div>
            </div>
            <div className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-white text-[9px] sm:text-[11px] mb-1 sm:mb-2">
                <Check size={10} className="text-emerald-300" />
                <span>+2.000 candidatos já compraram</span>
              </div>
              <p className="text-yellow-400 text-[9px] sm:text-2xs font-bold uppercase mb-1">TUDO QUE VOCÊ PRECISA + BÔNUS</p>
              <div className="w-full mb-1 sm:mb-2 rounded-lg bg-red-900/30 border border-red-500/20 px-2 py-1 text-orange-200 text-[9px] sm:text-[11px] font-semibold inline-flex items-center justify-center gap-1">
                <Clock size={11} className="text-orange-300" />
                <span>Oferta expira em {formattedCountdown}</span>
              </div>
              <div className="mb-1 sm:mb-2">
                <span className="text-gray-400 text-[11px] sm:text-sm line-through">{COMPLETE_PACK.oldPrice}</span>
                <p className="text-xl sm:text-3xl font-extrabold text-white leading-tight">{COMPLETE_PACK.price}</p>
                <span className="text-[9px] sm:text-2xs text-gray-light">pagamento único · acesso vitalício</span>
              </div>
              <ul className="space-y-0.5 text-left max-w-xs mx-auto mb-2 sm:mb-3">
                <li className="flex items-start gap-1">
                  <Check size={10} className="text-neon shrink-0 mt-0.5" />
                  <span className="text-white text-[9px] sm:text-[11px]">14 disciplinas completas</span>
                </li>
                <li className="flex items-start gap-1">
                  <Award size={10} className="text-yellow-400 shrink-0 mt-0.5" />
                  <span className="text-white text-[9px] sm:text-[11px]">+ 5 Bônus Exclusivos <span className="text-yellow-400 font-bold">(Bônus)</span></span>
                </li>
                <li className="flex items-start gap-1">
                  <Check size={10} className="text-neon shrink-0 mt-0.5" />
                  <span className="text-white text-[9px] sm:text-[11px]">Acesso vitalício + atualizações</span>
                </li>
              </ul>
              {/* Bonus Turbo */}
              <div className="rounded-lg overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                <div className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 sm:w-[50px] h-8 sm:h-[50px] bg-yellow-400/20 rounded-lg flex items-center justify-center shrink-0">
                    <Brain size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-1.5 py-0.5 mb-0.5">
                      <Award size={8} className="text-yellow-400" />
                      <span className="text-yellow-400 text-[8px] sm:text-[9px] font-black uppercase">Bônus Turbo</span>
                    </div>
                    <p className="text-white text-[10px] sm:text-xs font-bold leading-tight">Manual da Memorização</p>
                    <p className="text-gray-light text-[8px] sm:text-[9px] leading-tight">Aprenda a memorizar grandes quantidades</p>
                  </div>
                </div>
              </div>
              {/* Bonus Exclusivo */}
              <div className="mt-1.5 sm:mt-2 rounded-lg overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                <div className="p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                  <div className="w-9 sm:w-[60px] h-9 sm:h-[60px] bg-yellow-400/20 rounded-lg flex items-center justify-center shrink-0">
                    <Award size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-1.5 py-0.5 mb-0.5">
                      <Award size={8} className="text-yellow-400" />
                      <span className="text-yellow-400 text-[8px] sm:text-[9px] font-black uppercase">Bônus Exclusivo</span>
                    </div>
                    <p className="text-white text-[10px] sm:text-xs font-bold leading-tight">O Guia do Concurso Público</p>
                    <p className="text-gray-light text-[8px] sm:text-[9px] leading-tight">Estratégias completas para aprovação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="shrink-0 px-3 sm:px-5 pb-3 sm:pb-4 pt-2 sm:pt-2 border-t border-white/[0.06]">
          <a
            href="https://chk.eduzz.com/VWGNVAKV07?country=ESP"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center items-center gap-2 btn-primary py-2.5 sm:py-3.5 text-[11px] sm:text-sm mb-1.5 sm:mb-2 animate-pulse-neon"
          >
            QUERO O PACK COMPLETO
            <ArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => {
              try {
                onCheckout()
              } catch (e) {
                console.warn('checkout fallback:', e)
              }
              window.location.href = 'https://chk.eduzz.com/E05NJ5QN9X'
            }}
            className="block w-full text-center text-gray-light text-[9px] sm:text-xs py-1 sm:py-1.5 hover:text-white transition-colors"
          >
            Não obrigado, prefiro o pack básico
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
          CANSADO DE ESTUDAR SEM VER RESULTADO?
        </h2>
        <p className="text-body-lg md:text-xl text-white leading-relaxed">
          Pare de perder tempo com material desorganizado. Descubra como estudar de forma eficiente, com conteúdo focado no edital da PRF e plano de estudos comprovado. <strong className="text-neon">Abaixe agora e comece a estudar hoje mesmo.</strong>
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
              ESCOLHA O PACK PARA SUA <span className="text-neon">APROVAÇÃO</span> 👇
            </h2>
            <p className="section-desc max-w-2xl mx-auto">
              Selecione o acesso ideal e comece a estudar para a PRF hoje mesmo.
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
                <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
                  <BookOpen size={48} className="text-white/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center bg-orange text-white text-2xs font-bold px-2 py-0.5 rounded">{BRAND.discount}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4">
                  <span className="text-2xs font-bold text-neon uppercase tracking-wider">Pack Básico</span>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <h3 className="font-display text-sm sm:text-xl font-extrabold uppercase text-white mb-1">Material de Estudo</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-gray-400 text-xs sm:text-sm line-through">{BRAND.oldPrice}</span>
                  <p className="text-2xl sm:text-4xl font-extrabold text-white">{BRAND.price}</p>
                  <p className="text-neon text-xs font-bold mt-1">Menos de R$0,50 por PDF</p>
                  <span className="text-2xs text-gray-light">pagamento único</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpsell(true)}
                  className="block w-full text-center btn-primary py-3 sm:py-3.5 text-2xs sm:text-sm mb-3"
                >
                  GARANTIR AGORA
                </button>
                <p className="text-gray-light text-2xs sm:text-xs mb-4">
                  Clique para receber a oferta especial com bônus incluídos antes de comprar o pack básico.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">14 disciplinas completas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acesso imediato</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acesso vitalício</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pack Completo + Bônus */}
            <div className="relative bg-dark-100 border-2 border-neon/40 rounded-2xl overflow-hidden shadow-neon-strong min-w-0">
              <div className="absolute top-3 right-3 z-20">
                <span className="inline-flex items-center gap-1 bg-neon text-dark text-[10px] sm:text-2xs font-black px-3 py-1 rounded-full shadow-lg">
                  ★ MAIS VENDIDO
                </span>
              </div>
              <div className="absolute top-12 right-3 z-20 flex items-center gap-1 rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[10px] text-emerald-300">
                <Check size={12} className="text-emerald-300" />
                +2.000 pessoas já compraram
              </div>
              <div className="relative h-28 sm:h-48 bg-dark-200 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-center">
                  <Brain size={48} className="text-white/50" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-100 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center bg-orange text-white text-2xs font-bold px-2 py-0.5 rounded">{COMPLETE_PACK.discount}</span>
                </div>
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4">
                  <span className="text-2xs font-bold text-yellow-400 uppercase tracking-wider">Pack Completo + Bônus</span>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <h3 className="font-display text-sm sm:text-xl font-extrabold uppercase text-white mb-1">Material Completo + Bônus</h3>
                <div className="mb-3 sm:mb-4">
                  <div className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-900/30 border border-red-500/20 px-3 py-2 text-[11px] sm:text-[12px] text-orange-200 font-semibold mb-3">
                    <Clock size={14} className="text-orange-300" />
                    <span>Oferta expira em {formattedCountdown}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-400 text-xs sm:text-sm line-through">{COMPLETE_PACK.oldPrice}</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold px-2 py-1">Economize {COMPLETE_PACK.savings}</span>
                  </div>
                  <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">{COMPLETE_PACK.price}</p>
                  <p className="text-neon text-xs font-bold mt-1">Menos de R$0,85 por PDF</p>
                  <span className="text-2xs text-gray-light">pagamento único</span>
                </div>
                <a
                  href="https://chk.eduzz.com/VWGNVAKV07?country=ESP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center btn-primary py-3 sm:py-3.5 text-2xs sm:text-sm mb-2 animate-pulse-neon"
                >
                  QUERO MEU ACESSO
                </a>
                <p className="text-gray-light text-[10px] sm:text-[11px] text-center mb-4">Acesso instantâneo, sem esperas</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">14 disciplinas completas</span>
                  </li>
                  <li className="flex items-start gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3">
                    <Award size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+ Guia PRF <span className="text-yellow-400 font-bold">(Bônus)</span></span>
                  </li>
                  <li className="flex items-start gap-2 rounded-2xl border border-yellow-400/20 bg-yellow-500/10 p-3">
                    <Award size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">+ Plano de Estudos <span className="text-yellow-400 font-bold">(Bônus)</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-neon shrink-0 mt-0.5" />
                    <span className="text-white text-2xs sm:text-xs">Acesso vitalício + atualizações</span>
                  </li>
                </ul>
                <div className="mt-4 flex items-center gap-2 text-2xs text-gray-light">
                  <Shield size={14} className="text-neon shrink-0" />
                  Garantia de 7 dias ou devolvemos seu dinheiro
                </div>

                {/* Bônus Turbo */}
                <div className="mt-4 rounded-xl overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                  <div className="p-3 sm:p-4 flex items-center gap-3">
                    <div className="w-[50px] sm:w-[60px] h-[50px] sm:h-[60px] bg-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                      <Brain size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2 py-0.5 mb-1.5">
                        <Award size={10} className="text-yellow-400" />
                        <span className="text-yellow-400 text-2xs font-black uppercase">Bônus Turbo</span>
                      </div>
                      <p className="text-white text-xs sm:text-sm font-bold leading-tight">Manual da Memorização</p>
                      <p className="text-gray-light text-2xs leading-tight">Aprenda a memorizar grandes quantidades</p>
                    </div>
                  </div>
                </div>
                {/* Bônus Exclusivo */}
                <div className="mt-3 rounded-xl overflow-hidden border border-yellow-400/30 bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#0f0d00]">
                  <div className="p-3 sm:p-4 flex items-center gap-3">
                    <div className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] bg-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                      <Award size={32} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-2 py-0.5 mb-1.5">
                        <Award size={10} className="text-yellow-400" />
                        <span className="text-yellow-400 text-2xs font-black uppercase">Bônus Exclusivo</span>
                      </div>
                      <p className="text-white text-xs sm:text-sm font-bold leading-tight">O Guia do Concurso Público</p>
                      <p className="text-gray-light text-2xs leading-tight">Estratégias completas para aprovação</p>
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
// SOLUÇÃO
// ============================================
function Solution() {
  const [ref, isVisible] = useScrollAnimation()
  
  const points = [
    { num: '1', title: 'Conteúdo 100% focado no edital', desc: 'Todas as disciplinas exigidas pela PRF, organizadas e atualizadas.' },
    { num: '2', title: 'Material em PDF de alta qualidade', desc: 'Conteúdo claro, objetivo e fácil de estudar em qualquer dispositivo.' },
    { num: '3', title: 'Plano de estudos incluso', desc: 'Saiba exatamente o que estudar e quando, sem perder tempo.' },
    { num: '4', title: 'Bônus de memorização', desc: 'Técnicas comprovadas para absorver grandes quantidades de conteúdo.' },
    { num: '5', title: 'Guia do concurso público', desc: 'Estratégias para qualquer concurso, não só a PRF.' },
    { num: '6', title: 'Acesso vitalício', desc: 'Pague uma vez, estude para sempre. Inclui atualizações.' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Metodologia</span>
          <h2 className="section-title mb-3">Por que este pack funciona</h2>
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
// DISCIPLINAS
// ============================================
function Categories() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">O que inclui</span>
          <h2 className="section-title mb-3">14 disciplinas completas</h2>
          <p className="section-desc">Cada disciplina resolve uma parte do edital da PRF</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => {
            const IconComponent = categoryIcons[Object.keys(categoryIcons)[i]] || FileText
            const isFeatured = i < 3
            return (
              <div key={i} className={isFeatured ? 'card-featured p-card' : 'card-base p-card'}>
                <div className="flex items-start gap-3">
                  <div className={isFeatured ? 'icon-box-neon' : 'icon-box'}>
                    <span className="text-xl">{cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-xs mb-0.5">{cat.name}</h3>
                    <span className="badge-sm mt-1.5 inline-block">
                      Material completo
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
// PROVA SOCIAL
// ============================================
function SocialProof() {
  const [ref, isVisible] = useScrollAnimation()

  const stats = [
    { num: '14', label: 'Disciplinas completas' },
    { num: '19', label: 'PDFs de estudo' },
    { num: '+2.000', label: 'Candidatos ativos' },
    { num: '4.9', label: 'Avaliação média ⭐' },
  ]

  return (
    <section ref={ref} className={`py-section bg-dark border-y border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-white text-body font-bold">
            +2.000 candidatos já estão estudando com este material. E você, vai ficar de fora?
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
// PARA QUEM É
// ============================================
function WhoIsItFor() {
  const [ref, isVisible] = useScrollAnimation()

  const personas = [
    { emoji: '👮', title: 'Candidatos à PRF', desc: 'Que querem um material completo e organizado para estudar' },
    { emoji: '📚', title: 'Concurseiros', desc: 'Que buscam conteúdo focado e de qualidade' },
    { emoji: '⏰', title: 'Pessoas com pouco tempo', desc: 'Que precisam de um plano de estudos eficiente' },
    { emoji: '🎯', title: 'Quer foco', desc: 'Que não querem perder tempo com material desorganizado' },
    { emoji: '💡', title: 'Iniciantes', desc: 'Que não sabem por onde começar a estudar' },
    { emoji: '🏆', title: 'Quer resultados', desc: 'Que sonham em ser aprovado em concurso público' },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Para quem é?</span>
          <h2 className="section-title mb-3">Este pack foi feito para você</h2>
          <p className="section-desc max-w-xl mx-auto">
            Se você se identifica com algum desses perfis, este material é para você
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
// DEPOIMENTOS
// ============================================
function TestimonialsImproved() {
  const [ref, isVisible] = useScrollAnimation()

  const testimonials = [
    {
      name: 'Lucas Silva',
      role: 'Aprovado na PRF · Brasília',
      text: 'O material é incrivelmente completo. Consegui organizar meus estudos com o plano de estudos e passei em primeiro lugar na minha região.',
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Ana Paula Costa',
      role: 'Candidata · São Paulo',
      text: 'Estava perdida com tanta informação na internet. Esse material organizou tudo para mim. Hoje sei exatamente o que estudar todos os dias.',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Carlos Eduardo Santos',
      role: 'Aprovado PRF · Minas Gerais',
      text: 'Os bônus de memorização e aprendizado fazem toda a diferença. Consegui absorver o conteúdo muito mais rápido.',
      img: 'https://randomuser.me/api/portraits/men/75.jpg',
    },
    {
      name: 'Mariana Oliveira',
      role: 'Candidata · Paraná',
      text: 'O Guia do Concurso Público mudou minha estratégia de estudo. Recomendo para qualquer pessoa que queira passar em concurso.',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Pedro Henrique',
      role: 'Candidato · Rio de Janeiro',
      text: 'Material muito bem organizado. Conseguia estudar no ônibus, no trabalho, em qualquer lugar. Valeu cada centavo.',
      img: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
    {
      name: 'Fernanda Lima',
      role: 'Candidata · Bahia',
      text: 'Já tinha comprado vários materiais e nenhum era tão completo quanto este. O plano de estudos é incrível.',
      img: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
  ]

  return (
    <section ref={ref} className={`py-section-lg bg-dark-50 border-y border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="section-label mb-3 block">Resultados reais</span>
          <h2 className="section-title mb-3">O QUE DIZEM OS CANDIDATOS</h2>
          <p className="section-desc max-w-xl mx-auto">
            Candidatos de todo o Brasil já estão estudando com este material
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
            <span className="text-white text-xs font-semibold">+2.000 candidatos satisfeitos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// GARANTIA
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
          <h2 className="text-subtitle md:text-xl font-extrabold text-white mb-3">Garantia de 7 dias</h2>
          <p className="text-white text-small leading-relaxed max-w-xl mx-auto">
            Se dentro de 7 dias você não acreditar que o pack vale o investimento, é só mandar um email. 
            <strong className="text-white"> Devolvemos 100% do seu dinheiro.</strong> Sem perguntas.
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
          <span className="section-label mb-3 block">Dúvidas</span>
          <h2 className="section-title">Perguntas frequentes</h2>
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
function FinalCTAImproved() {
  const [ref, isVisible] = useScrollAnimation()
  
  return (
    <section ref={ref} className={`py-section-xl bg-dark border-t border-white/[0.06] transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display text-section-md md:text-3xl font-extrabold uppercase leading-tight mb-5 text-white">
          PARE DE ESTUDAR SEM DIREÇÃO. <span className="text-neon">APROVE SUA PRF</span>
        </h2>

        <p className="text-gray-light text-body-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Menos que o valor de uma aula particular, mais de <strong className="text-white">14 disciplinas completas</strong> no seu celular. Clique no botão, garanta os bônus exclusivos e comece a estudar para sua aprovação hoje mesmo.
        </p>

        <div className="bg-dark-50 border border-white/[0.06] rounded-card-lg px-6 py-5 mb-7 max-w-md mx-auto">
          <p className="text-gray-light text-sm mb-1">Garantia de satisfação</p>
          <p className="text-neon text-base font-bold">Compra 100% segura e protegida</p>
        </div>

        <p className="text-gray-light text-xs">
          Não perca esta oportunidade. Centenas de candidatos já estão estudando.
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
    { name: 'Lucas S.', city: 'Brasília', time: 'há 2 min' },
    { name: 'Ana Paula C.', city: 'São Paulo', time: 'há 5 min' },
    { name: 'Carlos E.', city: 'Belo Horizonte', time: 'há 8 min' },
    { name: 'Mariana O.', city: 'Curitiba', time: 'há 12 min' },
    { name: 'Pedro H.', city: 'Rio de Janeiro', time: 'há 3 min' },
    { name: 'Fernanda L.', city: 'Salvador', time: 'há 7 min' },
    { name: 'Marcos R.', city: 'Recife', time: 'há 10 min' },
    { name: 'Patricia L.', city: 'Porto Alegre', time: 'há 4 min' },
    { name: 'Joaquín P.', city: 'Fortaleza', time: 'há 6 min' },
    { name: 'Sofía G.', city: 'Manaus', time: 'há 9 min' },
    { name: 'Diego V.', city: 'Belém', time: 'há 2 min' },
    { name: 'Camila R.', city: 'Goiânia', time: 'há 11 min' },
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
            {current.name} <span className="text-gray-light font-normal">comprou</span>
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
          {BRAND.price} <span className="text-gray-light font-normal text-2xs">por acesso vitalício</span>
        </span>
        <span className="text-gray-light text-xs shrink-0">Deslize para ver os packs</span>
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
        content_name: 'Preparatório PRF Completo',
        content_category: 'Concurso PRF',
        value: 7,
        currency: 'USD'
      })
    }
  }, [])

  const handleCheckout = () => {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_name: 'Preparatório PRF Completo',
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
      <PricingCards onCheckout={handleCheckout} />
      <SocialProof />
      <Solution />
      <Categories />
      <WhoIsItFor />
      <TestimonialsImproved />
      <Guarantee />
      <FAQ />
      <FinalCTAImproved />
      <PurchaseNotifications />
      <StickyMobileCTA />
    </>
  )
}
