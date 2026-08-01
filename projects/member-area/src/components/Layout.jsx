import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, User, ChevronLeft, Menu, X, Search, Filter } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Inicio', icon: Home },
  { path: '/perfil', label: 'Perfil', icon: User },
]

export default function Layout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-dark-50 border-r border-green/10 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-green/10">
            <Link to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-xl bg-green/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 7.28 16.73M12 2a10 10 0 0 0-7.28 16.73" />
                  <path d="M8 12a4 4 0 0 1 8 0" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">FUTBOL PRO</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname.startsWith(item.path.replace('/todas', '')) 
                    ? 'bg-green/10 text-green border border-green/20' 
                    : 'text-white/70 hover:bg-dark-100 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-green/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green/20 flex items-center justify-center">
                <User className="w-5 h-5 text-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Carlos Medina</p>
                <p className="text-xs text-green">Entrenador Sub-15</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 lg:ml-64 min-h-screen ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-dark/95 backdrop-blur-sm border-b border-green/10">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="lg:hidden p-2 rounded-xl bg-dark-100 text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 flex items-center justify-between">
              <h1 className="font-display text-lg font-bold text-white hidden sm:block">
                {location.pathname === '/' ? 'Dashboard' : 
                 location.pathname.startsWith('/categoria') ? 'Entrenamientos' :
                 location.pathname === '/bonus' ? 'Bonus' : 'Perfil'}
              </h1>
              
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl bg-dark-100 text-white/70 hover:text-white">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-xl bg-dark-100 text-white/70 hover:text-white">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6 pb-24">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-dark border-t border-green/10 z-50">
        <div className="grid grid-cols-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-3 ${
                location.pathname.startsWith(item.path.replace('/todas', ''))
                  ? 'text-green'
                  : 'text-white/50'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}