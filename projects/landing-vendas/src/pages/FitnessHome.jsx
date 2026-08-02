import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Dumbbell,
  Flame,
  Gift,
  RefreshCw,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Users,
  UtensilsCrossed,
} from 'lucide-react'

const painPoints = [
  'Você cansou de comer sempre a mesma coisa e achar que dieta é um castigo.',
  'O tempo é curto, então a solução precisa ser prática e sem enrolação.',
  'Falta ingrediente no meio do caminho? Você não quer travar a semana.',
  'Montar lista de compras sem desperdiçar dinheiro virou uma dor de cabeça.',
]

const categories = [
  'Rápidas e fáceis',
  'Hipercalóricas',
  'Low carb',
  'Vegetarianas',
  'Hipertrofia',
  'Pasta de amendoim',
  'Saladas',
  'Frango',
  'Ovo',
  'Whey doce e salgado',
]

const recipes = [
  {
    title: 'Frango com arroz e legumes',
    subtitle: 'Refeição completa em 20 minutos',
    kcal: '540 kcal',
    macros: '40g proteína • 45g carbs • 18g gordura',
    ingredients: 'Frango, arroz, legumes, alho e shoyu',
  },
  {
    title: 'Torrada de ovos e whey doce',
    subtitle: 'Café da manhã que sustenta e não enjoa',
    kcal: '430 kcal',
    macros: '32g proteína • 30g carbs • 14g gordura',
    ingredients: 'Ovo, whey, banana, aveia e canela',
  },
  {
    title: 'Bowl de proteína com batata doce',
    subtitle: 'Ideal para dias de treino e rotina corrida',
    kcal: '610 kcal',
    macros: '45g proteína • 55g carbs • 20g gordura',
    ingredients: 'Proteína, batata doce, arroz, salada e molho',
  },
]

const bonuses = [
  {
    title: 'Tabela de Troca de Alimentos',
    text: 'Não tem whey? Troca por outra opção. Sem batata doce? Vai outra alternativa. Nunca mais você trava uma receita por falta de ingrediente.',
  },
  {
    title: 'Lista de Compras por Categoria',
    text: 'Proteínas, carboidratos, temperos, laticínios e muito mais. Tudo pronto para imprimir ou usar no celular na hora do mercado.',
  },
]

const audience = [
  'Quem treina musculação, funcional ou fitness e quer comer melhor sem perder praticidade.',
  'Quem quer emagrecer sem viver de comida sem graça.',
  'Quem quer ganhar massa e precisa de refeições que sustentem a rotina.',
  'Quem cozinha para a família e não quer complicar a vida.',
]

const faqs = [
  {
    q: 'Funciona pra vegetariano?',
    a: 'Sim. O e-book tem receitas vegetarianas e também adaptações simples para quem quer variar sem complicar.',
  },
  {
    q: 'Preciso saber cozinhar bastante?',
    a: 'Não. As receitas são pensadas para serem claras, rápidas e fáceis de repetir.',
  },
  {
    q: 'Recebo na hora?',
    a: 'Sim. Após a confirmação do pagamento, você recebe o acesso imediatamente.',
  },
  {
    q: 'Funciona bem no celular?',
    a: 'Sim. O material é bem legível e prático para abrir no celular, tablet ou computador.',
  },
]

function BookMockup() {
  return (
    <div className="relative mx-auto flex max-w-[360px] justify-center">
      <div className="absolute inset-0 rounded-[30px] bg-yellow-400/20 blur-[70px]" />
      <div className="relative w-full rounded-[28px] border border-yellow-400/30 bg-gradient-to-br from-[#171717] via-[#0f0f0f] to-[#1b1b1b] p-3 shadow-[0_0_50px_rgba(250,204,21,0.15)]">
        <div className="absolute inset-x-4 top-3 h-4 rounded-full bg-yellow-400/20" />
        <div className="rounded-[22px] border border-white/10 bg-[#111111] p-4">
          <div className="mb-4 rounded-[14px] bg-yellow-400 px-3 py-3 text-center text-[11px] font-black uppercase tracking-[0.28em] text-black">
            77 Receitas Fitness
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-white/20" />
            <div className="h-3 w-4/5 rounded-full bg-white/20" />
            <div className="h-3 w-3/4 rounded-full bg-white/20" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-3">
                <div className="mb-2 h-2 w-10 rounded-full bg-yellow-400/70" />
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-white/10" />
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 h-2 w-10 rounded-full bg-yellow-400/70" />
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-12 rounded-full bg-yellow-400/70" />
                <div className="h-2 flex-1 rounded-full bg-white/10" />
              </div>
              <div className="h-2 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FitnessHome() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-yellow-400">77 Receitas Fitness</p>
            <p className="text-sm text-white/70">E-book PDF com receitas práticas e resultados reais</p>
          </div>
          <a href="#oferta" className="rounded-full border border-yellow-400/40 bg-yellow-400 px-4 py-2 text-sm font-black text-black transition hover:scale-[1.03]">
            Garantir agora
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),_transparent_55%)] px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm font-semibold text-yellow-300">
                <Sparkles size={16} />
                Novo e-book digital com mais de 100 páginas
              </div>
              <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                Chega de comer sempre igual.
                <span className="mt-3 block text-yellow-400">77 receitas fitness que mudam sua rotina.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
                Se você treina, quer comer melhor e não tem tempo pra inventar refeição toda hora, este e-book é o seu atalho. Prático, direto e feito para te dar opções reais de almoço, jantar e pré/pos treino.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#oferta" className="btn-primary rounded-full px-6 py-3 text-base font-black">
                  Quero o e-book agora
                  <ArrowRight size={18} />
                </a>
                <a href="#bonus" className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white/90 transition hover:bg-white/10">
                  Ver bônus gratuitos
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <CheckCircle2 size={16} className="text-yellow-400" />
                  Receitas com macros
                </span>
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Clock3 size={16} className="text-yellow-400" />
                  Praticidade no dia a dia
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[420px]">
              <BookMockup />
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0c0c0c] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">A dor</p>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                Sem desculpa pra fugir da dieta
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {painPoints.map((point, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-400">
                    <Flame size={18} />
                  </div>
                  <p className="text-base leading-7 text-white/80">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#090909] px-4 py-14 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">A solução</p>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                O e-book que organiza sua alimentação sem te deixar entediado
              </h2>
              <p className="mt-4 text-lg leading-8 text-white/75">
                Com 77 receitas fitness divididas por objetivo, você acha opções prontas para qualquer situação: rápidas, hipercalóricas, low carb, vegetarianas, para hipertrofia e muito mais.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#111111] p-6">
              <div className="flex flex-wrap gap-3">
                {categories.map((category, index) => (
                  <span key={index} className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0b0b0b] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Exemplos</p>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                Receitas que você abre e já sabe o que fazer
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {recipes.map((recipe, index) => (
                <article key={index} className="rounded-3xl border border-white/10 bg-[#121212] p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm font-semibold text-yellow-300">
                    <UtensilsCrossed size={16} />
                    Receita {index + 1}
                  </div>
                  <h3 className="text-xl font-black text-white">{recipe.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/70">{recipe.subtitle}</p>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-yellow-300">{recipe.kcal}</p>
                    <p className="mt-1 text-sm text-white/70">{recipe.macros}</p>
                    <p className="mt-3 text-sm text-white/60">{recipe.ingredients}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="bonus" className="border-b border-white/10 bg-[#111111] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Bônus</p>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                Valor agregado que faz a diferença na sua rotina
              </h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {bonuses.map((bonus, index) => (
                <div key={index} className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-400">
                    {index === 0 ? <RefreshCw size={20} /> : <ShoppingBasket size={20} />}
                  </div>
                  <h3 className="text-xl font-black text-white">{bonus.title}</h3>
                  <p className="mt-3 text-base leading-7 text-white/75">{bonus.text}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-black/20 px-3 py-2 text-sm font-semibold text-yellow-300">
                    <Gift size={16} />
                    Valor de R$ 97 grátis
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-[#0a0a0a] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Pra quem é</p>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                Feito para quem quer resultado sem complicação
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {audience.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-400">
                    <Users size={18} />
                  </div>
                  <p className="text-base leading-7 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="oferta" className="bg-[#080808] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[32px] border border-yellow-400/30 bg-[#111111] p-8 shadow-[0_0_60px_rgba(250,204,21,0.12)] sm:p-10">
              <div className="text-center">
                <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Oferta</p>
                <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                  Garanta agora seu acesso
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/70">
                  Mais de 77 receitas, tabelas de troca e lista de compras prontas para você usar hoje mesmo.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-[#0f0f0f] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300">E-book completo</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">R$ 47</span>
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-sm font-semibold text-yellow-300">ou 12x de R$ 4,90</span>
                  </div>
                  <ul className="mt-5 space-y-3 text-left text-sm text-white/75">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />77 receitas organizadas por objetivo</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />Macros e ingredientes em cada receita</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />Bônus de troca de alimentos</li>
                  </ul>
                  <a href="#" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-base font-black">
                    Comprar agora
                    <ArrowRight size={18} />
                  </a>
                </div>

                <div className="rounded-[24px] border border-yellow-400/30 bg-yellow-400/10 p-6">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-yellow-300">
                    <Gift size={14} />
                    Mais vendido
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-300">E-book + bônus completos</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">R$ 97</span>
                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/15 px-3 py-1 text-sm font-semibold text-yellow-300">de R$ 197</span>
                  </div>
                  <ul className="mt-5 space-y-3 text-left text-sm text-white/80">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />77 receitas + tabela de troca</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />Lista de compras pronta para imprimir</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-yellow-400" />Acesso imediato no celular</li>
                  </ul>
                  <a href="#" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-base font-black">
                    Garantir meu acesso
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#060606] px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400/15 text-yellow-400">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
                Garantia de 7 dias
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                Se em até 7 dias você achar que não é o material certo pra você, a gente devolve seu dinheiro. Sem enrolação.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-white">{faq.q}</span>
                    <span className="text-xl text-yellow-400">{openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                  </button>
                  {openFaq === index && <p className="px-5 pb-5 text-sm leading-7 text-white/70">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#080808] px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-sm font-semibold text-yellow-300">
              <Dumbbell size={16} />
              Sem desculpa, sem repetição
            </div>
            <h2 className="text-3xl font-black uppercase tracking-[-0.02em] text-white sm:text-4xl">
              Pare de viver em loop de frango, batata doce e ovo.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/70">
              O e-book 77 Receitas Fitness é o seu novo aliado pra comer bem, variar, economizar e manter a dieta viva.
            </p>
            <a href="#oferta" className="btn-primary mt-8 rounded-full px-6 py-3 text-base font-black">
              Garantir meu acesso
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <div className="sticky bottom-0 border-t border-yellow-400/20 bg-[#080808]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400">Oferta</p>
            <p className="text-sm font-semibold text-white">R$ 47 • acesso imediato</p>
          </div>
          <a href="#oferta" className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-black text-black">
            Comprar
          </a>
        </div>
      </div>
    </div>
  )
}
