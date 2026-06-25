import { Link } from 'react-router-dom'
import { BRAND, NAV_LINKS } from '../data'

export default function Footer() {
  return (
    <footer className="bg-primary rounded-t-[4rem] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">{BRAND.name}</h3>
            <p className="font-heading text-white/50 max-w-sm mb-6">{BRAND.purpose}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              <span className="font-mono text-green-400 text-xs uppercase tracking-wider">Sistema Operacional</span>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Navegação</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}><Link to={l.path} className="font-heading text-white/50 text-sm link-hover hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="font-heading text-white/50 text-sm">(11) 99999-9999</li>
              <li className="font-heading text-white/50 text-sm">contato@lineadental.com.br</li>
              <li className="font-heading text-white/50 text-sm">São Paulo, SP</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-heading text-white/30 text-sm">© 2026 {BRAND.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-heading text-white/30 text-sm link-hover hover:text-white">Política de Privacidade</a>
            <a href="#" className="font-heading text-white/30 text-sm link-hover hover:text-white">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
