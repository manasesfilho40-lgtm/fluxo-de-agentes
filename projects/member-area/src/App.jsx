import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Category from './pages/Category'
import Training from './pages/Training'
import Bonus from './pages/Bonus'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:id" element={<Category />} />
        <Route path="/entrenamiento/:id" element={<Training />} />
        <Route path="/bonus" element={<Bonus />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App