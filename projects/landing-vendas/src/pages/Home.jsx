import { useState } from 'react'
import { ChevronRight, Check, Shield, Star, ArrowRight } from 'lucide-react'
import { BRAND, CATEGORIES, PAINS, BENEFITS, TESTIMONIALS, FAQS } from '../data'

function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-6">
            Acesso Imediato · Pagamento Único
          </p>
          <h1 className="font-heading font-bold text-5xl md:text-7xl leading-tight mb-6">
            +300 Exercícios de Futebol
            <span className="block text-accent mt-2">Prontos para Usar.</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            {BRAND.purpose}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://pay.cakto.com.br/9fuib6v_992374"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-accent/90 transition-colors"
            >
              Quero Acessar Agora
              <ArrowRight size={18} />
            </a>
            <a
              href="#categorias"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-lg font-medium text-base hover:bg-white/5 transition-colors"
            >
              Ver Categorias
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <span className="text-white/40 text-sm">4.9/5 — +230 treinadores já usam</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function PainPoints() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
            Isso acontece com você?
          </p>
          <h2 className="font-heading text-dark text-3xl md:text-4xl font-bold">
            Se você é treinador, isso é familiar
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {PAINS.map((p, i) => (
            <div key={i} className="p-8 rounded-2xl border border-dark/10 bg-white">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="mt-5 font-heading font-bold text-dark text-lg">{p.title}</h3>
              <p className="mt-3 text-dark/60 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  return (
    <section id="categorias" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
            O que está incluído
          </p>
          <h2 className="font-heading text-dark text-3xl md:text-4xl font-bold">
            Tudo que você precisa em um catálogo
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-dark/10 hover:border-accent/30 hover:-translate-y-1 transition-all cursor-default"
            >
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="mt-3 font-heading text-sm font-bold text-dark">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
            Benefícios
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Mais que um catálogo, sua ferramenta de venda
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10">
              <span className="text-3xl">{b.icon}</span>
              <h3 className="mt-4 font-heading font-bold text-lg">{b.title}</h3>
              <p className="mt-2 text-white/50 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
            Depoimentos
          </p>
          <h2 className="font-heading text-dark text-3xl md:text-4xl font-bold">
            O que dizem quem já usa
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl border border-dark/10 bg-white">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-dark/80 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-dark">{t.name}</p>
                  <p className="text-xs text-dark/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">
          Oferta por tempo limitado
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight mb-6">
          Pare de perder tempo criando treinos.
          <br />
          <span className="text-accent">Comece a fechar trabalhos hoje.</span>
        </h2>
        <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
          Acesse +300 exercícios de futebol organizados por categoria com medições, equipamentos e planos incluídos. Pagamento único, acesso vitalício.
        </p>
        <div className="inline-flex items-center gap-4 rounded-xl bg-white/5 px-8 py-4 border border-white/10 mb-8">
          <span className="text-2xl text-white/40 line-through">{BRAND.oldPrice} USD</span>
          <span className="text-5xl font-bold text-accent">{BRAND.price}</span>
          <span className="text-sm text-white/40">USD</span>
          <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">-74%</span>
        </div>
        <div className="mb-6">
          <a
            href="https://pay.cakto.com.br/9fuib6v_992374"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white px-10 py-5 rounded-lg text-lg font-bold hover:bg-accent/90 transition-colors"
          >
            Quero Acessar Agora
            <ArrowRight size={20} />
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          <span className="flex items-center gap-1.5">
            <Shield size={16} className="text-emerald-400" /> Garantia 7 dias
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={16} className="text-emerald-400" /> Acesso imediato
          </span>
          <span className="flex items-center gap-1.5">
            <Check size={16} className="text-emerald-400" /> Pagamento único
          </span>
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="font-heading text-dark text-3xl md:text-4xl font-bold">
            Perguntas frequentes
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-dark/10 bg-background overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-heading font-bold text-dark">{faq.q}</span>
                <span
                  className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dark/5 text-dark/40 text-xs transition-transform font-mono ${
                    openIndex === i ? 'rotate-45' : ''
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-dark/60 leading-relaxed">{faq.a}</p>
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
      <FAQ />
    </>
  )
}
