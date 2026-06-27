import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('lgpd-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('lgpd-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('lgpd-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto bg-primary rounded-[1.5rem] p-6 md:p-8 shadow-2xl border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="text-accent" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading font-bold text-lg text-white">Preferências de Privacidade</h3>
              <button onClick={reject} className="text-white/30 hover:text-white transition-colors flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            <p className="font-heading text-white/60 text-sm mt-2 max-w-2xl">
              Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar sua experiência.
              Ao clicar em "Aceitar todos", você concorda com o uso de todos os cookies.
              Leia nossa{' '}
              <Link to="/privacidade" className="text-accent underline">Política de Privacidade</Link>.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={accept} className="bg-accent text-primary px-6 py-2.5 rounded-full font-heading font-semibold text-sm hover:brightness-110 transition-all">
                Aceitar todos
              </button>
              <button onClick={reject} className="border border-white/20 text-white/70 px-6 py-2.5 rounded-full font-heading text-sm hover:bg-white/5 transition-all">
                Recusar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}