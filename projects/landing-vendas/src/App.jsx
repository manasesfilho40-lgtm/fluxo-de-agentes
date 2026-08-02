import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import FitnessHome from './pages/FitnessHome'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/treinamentos" element={<Home />} />
          <Route path="/fitness" element={<FitnessHome />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}
