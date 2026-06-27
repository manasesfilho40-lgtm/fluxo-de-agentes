import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NoiseOverlay from './components/NoiseOverlay'
import CookieConsent from './components/CookieConsent'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Protocolo from './pages/Protocolo'

import Contato from './pages/Contato'
import NotFound from './pages/NotFound'
import Privacidade from './pages/Privacidade'
import Termos from './pages/Termos'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <NoiseOverlay />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/protocolo" element={<Protocolo />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </ErrorBoundary>
  )
}