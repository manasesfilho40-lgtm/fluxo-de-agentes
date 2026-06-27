import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { Menu, X, ArrowRight } from 'lucide-react'
import { BRAND, NAV_LINKS } from '../data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' })
    }
  }, [])

  const isHome = location.pathname === '/'
  const navBg = scrolled || !isHome ? 'bg-background/80 backdrop-blur-xl border border-dark/10 shadow-lg' : 'bg-transparent'
  const text = scrolled || !isHome ? 'text-dark' : 'text-white'
  const muted = scrolled || !isHome ? 'text-dark/70 hover:text-dark' : 'text-white/70 hover:text-white'

  return (
    <nav ref={navRef} className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${navBg} rounded-full px-6 py-3 flex items-center gap-8`}>
      <Link to="/" className={`font-heading font-bold text-lg tracking-tight ${text}`}>{BRAND.name}</Link>
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((l) => (
          <Link key={l.label} to={l.path} className={`text-sm font-medium link-hover ${muted}`}>{l.label}</Link>
        ))}
      </div>
      <Link to="/contato" className="hidden md:flex btn-magnetic bg-accent text-primary px-5 py-2 rounded-full text-sm font-semibold items-center gap-2">
        <span className="relative z-10">Agendar Serviço</span>
        <ArrowRight size={14} className="relative z-10" />
      </Link>
      <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden ${text}`}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-dark/10 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.path} className="text-dark font-medium py-2">{l.label}</Link>
            ))}
            <Link to="/contato" className="btn-magnetic bg-accent text-primary px-5 py-3 rounded-full text-sm font-semibold text-center">Agendar Serviço</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
