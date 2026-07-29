import { BRAND, NAV_LINKS } from '../data'

export default function Footer() {
  return (
    <footer className="bg-primary pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">{BRAND.name}</h3>
            <p className="text-white/50 max-w-sm mb-6">{BRAND.purpose}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 text-xs uppercase tracking-wider">Acesso imediato</span>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Navegação</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.path} className="text-white/50 text-sm hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="text-white/50 text-sm">WhatsApp: +54 9 11 5555-0000</li>
              <li className="text-white/50 text-sm">contato@exerciciosdefutbol.com</li>
              <li className="text-white/50 text-sm">LATAM — Envio digital</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">&copy; 2025 {BRAND.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-white/30 text-sm hover:text-white transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
