import { useState, useEffect } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { BRAND, NAV_LINKS } from '../data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-dark/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className={`font-heading font-bold text-lg ${scrolled ? 'text-dark' : 'text-white'}`}>
          {BRAND.name}
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.path}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-dark/60 hover:text-dark' : 'text-white/60 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://pay.cakto.com.br/9fuib6v_992374"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            Quero Acessar
            <ArrowRight size={14} />
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden ${scrolled ? 'text-dark' : 'text-white'}`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-dark/10 px-6 py-4">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.path} className="text-dark font-medium py-2">
                {l.label}
              </a>
            ))}
            <a
              href="https://pay.cakto.com.br/9fuib6v_992374"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-white px-5 py-3 rounded-lg text-sm font-semibold text-center"
            >
              Quero Acessar
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
