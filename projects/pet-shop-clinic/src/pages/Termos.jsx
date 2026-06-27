import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BRAND } from '../data'

export default function Termos() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.terms-section', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Termos de Uso</p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark">Condições de uso do site</h1>
          <p className="font-heading text-dark/60 text-lg mt-4">Última atualização: Junho de 2026</p>
        </header>

        <div className="space-y-12">
          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">1. Aceitação dos Termos</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              Ao acessar e utilizar o site da <strong>{BRAND.name}</strong>, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se não concordar com qualquer parte destes termos, não utilize nosso site.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">2. Uso do Site</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Você concorda em usar este site apenas para fins lícitos e de acordo com estes termos. É proibido:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Utilizar o site para qualquer fim ilegal ou não autorizado</li>
              <li>Interferir no funcionamento do site ou nos servidores</li>
              <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
              <li>Transmitir vírus, malware ou código malicioso</li>
              <li>Coletar dados de outros usuários sem consentimento</li>
              <li>Reproduzir, distribuir ou modificar conteúdo sem autorização</li>
            </ul>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">3. Agendamentos e Serviços</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              O formulário de contato e agendamento destina-se a solicitações legítimas de informações e marcação de serviços. Ao enviar uma solicitação:
            </p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Você garante que as informações fornecidas são verdadeiras e completas</li>
              <li>O agendamento só é confirmado após contato da nossa equipe</li>
              <li>Cancelamentos ou reagendamentos devem ser feitos com antecedência mínima de 24h</li>
              <li>Não comparecimento sem aviso prévio pode implicar em taxa de reserva</li>
              <li>Serviços e preços estão sujeitos a alteração sem aviso prévio</li>
            </ul>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">4. Propriedade Intelectual</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              Todo o conteúdo deste site (textos, imagens, logos, layouts, código) é propriedade da {BRAND.name} ou licenciado para nós. É protegido por leis de direitos autorais e propriedade industrial. É vedada a reprodução total ou parcial sem autorização prévia por escrito.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">5. Isenção de Responsabilidade</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              O conteúdo deste site tem caráter informativo e não substitui consulta veterinária presencial. A {BRAND.name} não se responsabiliza por:
            </p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Decisões tomadas com base apenas nas informações do site</li>
              <li>Interrupções, erros ou indisponibilidade temporária do site</li>
              <li>Danos decorrentes de uso indevido ou acesso não autorizado</li>
              <li>Conteúdo de sites de terceiros linkados a partir do nosso</li>
            </ul>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">6. Limitação de Responsabilidade</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Em nenhuma hipótese a {BRAND.name}, seus sócios, diretores ou funcionários serão responsáveis por danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso deste site, mesmo que advertidos da possibilidade de tais danos.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">7. Links para Terceiros</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Nosso site pode conter links para sites de terceiros (redes sociais, parceiros, mapas). Não controlamos e não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas desses sites. O acesso é por sua conta e risco.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">8. Privacidade e Dados Pessoais</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              O tratamento de seus dados pessoais é regido pela nossa <a href="/privacidade" className="text-accent hover:underline">Política de Privacidade</a>. Ao usar o site, você concorda com as práticas lá descritas.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">9. Cookies</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência. Consulte nossa <a href="/privacidade" className="text-accent hover:underline">Política de Privacidade</a> (seção 7) para detalhes sobre tipos de cookies e como gerenciá-los.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">10. Alterações nos Termos</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Podemos modificar estes termos a qualquer momento. A versão atualizada entrará em vigor imediatamente após publicação nesta página. O uso contínuo do site após alterações constitui aceitação dos novos termos.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">11. Lei Aplicável e Foro</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">12. Disposições Gerais</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              Se qualquer cláusula for considerada inválida ou inexequível, as demais permanecerão em pleno vigor. A não exigência de qualquer direito não constitui renúncia. Estes termos constituem o acordo integral entre você e a {BRAND.name}.
            </p>
          </div>

          <div className="terms-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">13. Contato</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Dúvidas sobre estes Termos de Uso? Entre em contato:<br />
              E-mail: <a href="mailto:contato@pawfectpet.com.br" className="text-accent hover:underline">contato@pawfectpet.com.br</a><br />
              Telefone: (11) 99999-9999<br />
              Endereço: Av. Paulista, 1000 - Sala 301, São Paulo/SP - 01310-100
            </p>
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-dark/10">
          <p className="font-heading text-dark/50 text-sm">
            <a href="/contato" className="text-accent hover:underline">Fale conosco</a> | <a href="/privacidade" className="text-accent hover:underline">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </section>
  )
}