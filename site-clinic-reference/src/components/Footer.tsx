export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-16 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <a href="#" className="group flex items-baseline gap-1">
              <span className="font-serif text-2xl font-medium tracking-tight">Clínica Vilela</span>
              <span className="h-1.5 w-1.5 rounded-full bg-terracotta-light" />
            </a>
            <p className="mt-6 max-w-sm leading-relaxed text-white/60">
              Dermatologia clínica, estética e integrativa em São Paulo. Atendimento 
              humanizado com foco na saúde da pele como reflexo do equilíbrio do corpo.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Navegação</p>
            <ul className="mt-6 space-y-3 text-white/70">
              <li>
                <a href="#about" className="transition-colors hover:text-white">A clínica</a>
              </li>
              <li>
                <a href="#services" className="transition-colors hover:text-white">Tratamentos</a>
              </li>
              <li>
                <a href="#approach" className="transition-colors hover:text-white">Nossa abordagem</a>
              </li>
              <li>
                <a href="#testimonials" className="transition-colors hover:text-white">Depoimentos</a>
              </li>
              <li>
                <a href="#location" className="transition-colors hover:text-white">Localização</a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Contato</p>
            <ul className="mt-6 space-y-3 text-white/70">
              <li>(11) 3088-1234</li>
              <li>contato@clinicavilela.com.br</li>
              <li>Rua Oscar Freire, 1234, sala 82</li>
              <li>Jardins, São Paulo — SP</li>
            </ul>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all hover:border-white hover:bg-white hover:text-ink"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-all hover:border-white hover:bg-white hover:text-ink"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 text-sm text-white/40 md:flex-row">
          <p>© 2026 Clínica Vilela. Todos os direitos reservados.</p>
          <p>
            Dra. Marina Vilela — CRM-SP 123456
          </p>
        </div>
      </div>
    </footer>
  );
}
