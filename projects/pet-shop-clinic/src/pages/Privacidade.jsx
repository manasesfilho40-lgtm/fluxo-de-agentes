import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BRAND } from '../data'

export default function Privacidade() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.policy-section', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="pt-32 pb-24 md:pt-40 md:pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-4">Política de Privacidade</p>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-dark">Proteção dos seus dados</h1>
          <p className="font-heading text-dark/60 text-lg mt-4">Última atualização: Junho de 2026</p>
        </header>

        <div className="space-y-12">
          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">1. Introdução</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">
              A <strong>{BRAND.name}</strong> valoriza a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações pessoais quando você acessa nosso site ou utiliza nossos serviços, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">2. Dados Coletados</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Coletamos as seguintes categorias de dados pessoais:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li><strong>Dados de identificação:</strong> nome completo, e-mail, telefone</li>
              <li><strong>Dados de agendamento:</strong> serviço desejado, data/horário preferencial, histórico de serviços</li>
              <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas, tempo de permanência (via cookies)</li>
              <li><strong>Dados do pet (quando aplicável):</strong> nome, raça, idade, histórico de vacinação fornecidos voluntariamente</li>
            </ul>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">3. Finalidade do Tratamento</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Utilizamos seus dados para:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Agendar e confirmar serviços (tosa, banho, spa, veterinária)</li>
              <li>Enviar lembretes de agendamentos e comunicações relevantes</li>
              <li>Melhorar a experiência do usuário em nosso site</li>
              <li>Cumprir obrigações legais e regulatórias (CRMV, LGPD, vigilância sanitária)</li>
              <li>Exercer nossos direitos em processos judiciais ou administrativos</li>
            </ul>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">4. Base Legal</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">O tratamento de seus dados baseia-se nas seguintes hipóteses legais da LGPD:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li><strong>Consentimento (Art. 7º, I):</strong> para envio de comunicações de marketing e cookies não essenciais</li>
              <li><strong>Execução de contrato (Art. 7º, V):</strong> para agendamento e prestação de serviços pet</li>
              <li><strong>Obrigação legal (Art. 7º, II):</strong> para cumprimento de normas do CRMV e vigilância sanitária</li>
              <li><strong>Legítimo interesse (Art. 7º, IX):</strong> para melhoria contínua dos serviços e segurança do site</li>
            </ul>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">5. Compartilhamento de Dados</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Não vendemos seus dados. Podemos compartilhar com:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Operadores de tecnologia (hospedagem, CRM, e-mail) sob contratos de confidencialidade</li>
              <li>Órgãos reguladores quando exigido por lei</li>
              <li>Laboratórios e clínicas veterinárias parceiras para exames/procedimentos (com seu consentimento)</li>
            </ul>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">6. Seus Direitos (Art. 18 da LGPD)</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Você pode solicitar a qualquer momento:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li>Confirmação da existência de tratamento</li>
              <li>Acesso aos dados</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados a outro fornecedor</li>
              <li>Eliminação dos dados tratados com consentimento</li>
              <li>Informação sobre compartilhamento</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p className="font-heading text-dark/70 leading-relaxed mt-4">Para exercer seus direitos, entre em contato: <a href="mailto:contato@pawfectpet.com.br" className="text-accent hover:underline">contato@pawfectpet.com.br</a></p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">7. Cookies e Tecnologias Similares</h2>
            <p className="font-heading text-dark/70 leading-relaxed mb-4">Utilizamos cookies para:</p>
            <ul className="font-heading text-dark/70 leading-relaxed space-y-3 list-disc list-inside">
              <li><strong>Essenciais:</strong> funcionamento do site, segurança, acessibilidade</li>
              <li><strong>Analíticos:</strong> Google Analytics (anonimizado) para entender uso do site</li>
              <li><strong>Marketing:</strong> Meta Pixel para anúncios personalizados (com consentimento)</li>
            </ul>
            <p className="font-heading text-dark/70 leading-relaxed mt-4">Você pode gerenciar preferências no nosso <a href="#" id="cookie-settings-link" className="text-accent hover:underline">Banner de Cookies</a> ou nas configurações do navegador.</p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">8. Retenção de Dados</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas ou enquanto houver obrigação legal. Dados de prontuário veterinário seguem prazos do CRMV (mínimo 5 anos). Dados de marketing são mantidos até revogação do consentimento.
            </p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">9. Segurança</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Adotamos medidas técnicas e organizacionais adequadas: criptografia TLS 1.3, acesso restrito por necessidade, logs de acesso, backups criptografados e treinamento contínuo da equipe em LGPD.
            </p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">10. Alterações nesta Política</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Podemos atualizar esta política periodicamente. A versão mais recente estará sempre disponível neste endereço. Alterações significativas serão comunicadas via e-mail ou aviso no site.
            </p>
          </div>

          <div className="policy-section bg-background border border-dark/10 rounded-[2rem] p-8 md:p-12">
            <h2 className="font-heading font-bold text-2xl text-dark mb-6">11. Encarregado de Dados (DPO)</h2>
            <p className="font-heading text-dark/70 leading-relaxed">
              Nome: Responsável pela Proteção de Dados<br />
              E-mail: <a href="mailto:dpo@pawfectpet.com.br" className="text-accent hover:underline">dpo@pawfectpet.com.br</a><br />
              Telefone: (11) 99999-9999
            </p>
          </div>
        </div>

        <div className="text-center mt-16 pt-8 border-t border-dark/10">
          <p className="font-heading text-dark/50 text-sm">
            Dúvidas? Entre em <a href="/contato" className="text-accent hover:underline">contato conosco</a>.
          </p>
        </div>
      </div>
    </section>
  )
}