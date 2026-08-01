import { useState } from 'react'
import { User, Settings, Shield, Trophy, Flame, Clock, BookOpen, LogOut, ChevronRight, Edit, Star, Target } from 'lucide-react'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('perfil')

  const user = {
    name: 'Carlos Medina',
    role: 'Entrenador Sub-15',
    email: 'carlos.medina@email.com',
    joined: 'Enero 2024',
    avatar: null,
  }

  const stats = [
    { label: 'Entrenamientos vistos', value: '47', icon: BookOpen, color: 'text-blue-400' },
    { label: 'Horas de video', value: '23h', icon: Clock, color: 'text-green-400' },
    { label: 'Categorías completadas', value: '3/13', icon: Target, color: 'text-orange-400' },
    { label: 'Racha actual', value: '12 días', icon: Flame, color: 'text-red-400' },
  ]

  const achievements = [
    { title: 'Primer entrenamiento', desc: 'Completaste tu primer video', icon: Star, earned: true },
    { title: 'Semana completa', desc: '7 días seguidos entrenando', icon: Flame, earned: true },
    { title: 'Especialista en Pase', desc: '10 entrenamientos de pase', icon: Target, earned: false },
    { title: 'Maestro del Dribling', desc: '20 entrenamientos de dribling', icon: Target, earned: false },
    { title: 'Entrenador dedicado', desc: '30 días de racha', icon: Flame, earned: false },
    { title: 'Maestro completo', desc: 'Todas las categorías', icon: Trophy, earned: false },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-green/20 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-green" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green text-dark flex items-center justify-center">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-extrabold text-white">{user.name}</h1>
            <p className="text-green text-sm font-medium">{user.role}</p>
            <p className="text-white/50 text-sm mt-1">{user.email}</p>
            <p className="text-white/40 text-xs mt-1">Miembro desde {user.joined}</p>
          </div>
          <button className="p-3 rounded-xl bg-dark-100 text-white/70 hover:text-white">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-100 rounded-xl p-1">
        {['perfil', 'progreso', 'logros', 'config'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-green text-dark'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card p-5">
        {activeTab === 'perfil' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Nombre</label>
                <input type="text" defaultValue={user.name} className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none" />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Rol</label>
                <input type="text" defaultValue={user.role} className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none" />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Email</label>
                <input type="email" defaultValue={user.email} className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none" />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Club/Equipo</label>
                <input type="text" placeholder="Ej: Club Deportivo..." className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none" />
              </div>
            </div>
            <button className="btn-primary w-full py-3">Guardar Cambios</button>
          </div>
        )}

        {activeTab === 'progreso' && (
          <div className="space-y-6">
            <h3 className="font-bold text-white">Tu Progreso</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map(stat => (
                <div key={stat.label} className="card p-4 text-center">
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="font-display text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="card p-4">
              <h4 className="font-bold text-white mb-3">Actividad Reciente</h4>
              <div className="space-y-3">
                {[
                  { title: 'Control Orientado Básico', category: 'Control', time: 'Hace 2 horas', duration: '12 min' },
                  { title: 'Pase Corto Preciso', category: 'Pase', time: 'Ayer', duration: '15 min' },
                  { title: 'Calentamiento Dinámico', category: 'Calentamiento', time: 'Hace 2 días', duration: '10 min' },
                  { title: 'Finalización en Área', category: 'Finalización', time: 'Hace 3 días', duration: '18 min' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-dark/50">
                    <div className="w-12 h-12 rounded-xl bg-green/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{activity.title}</p>
                      <p className="text-white/50 text-sm">{activity.category} · {activity.duration}</p>
                    </div>
                    <span className="text-white/40 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logros' && (
          <div className="space-y-4">
            <h3 className="font-bold text-white">Tus Logros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, i) => (
                <div key={i} className={`card p-4 flex items-center gap-4 ${achievement.earned ? '' : 'opacity-50'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${achievement.earned ? 'bg-green/20' : 'bg-dark-100'}`}>
                    <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-green' : 'text-white/30'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{achievement.title}</h4>
                    <p className="text-white/50 text-sm">{achievement.desc}</p>
                  </div>
                  {achievement.earned && (
                    <span className="px-3 py-1 bg-green text-dark text-xs rounded-full font-bold">Desbloqueado</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-6">
            <h3 className="font-bold text-white">Configuración</h3>
            
            <div className="card p-4 space-y-4">
              <h4 className="font-bold text-white">Notificaciones</h4>
              <div className="space-y-3">
                {[
                  { label: 'Nuevos entrenamientos', desc: 'Recibir aviso cuando se publique contenido nuevo' },
                  { label: 'Recordatorio diario', desc: 'Recordatorio para entrenar cada día' },
                  { label: 'Progreso semanal', desc: 'Resumen de tu actividad cada semana' },
                  { label: 'Nuevos bonus', desc: 'Aviso cuando haya material extra disponible' },
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-green/30 bg-dark text-green focus:ring-green" />
                  </label>
                ))}
              </div>
            </div>

            <div className="card p-4 space-y-4">
              <h4 className="font-bold text-white">Preferencias de Entrenamiento</h4>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Nivel preferido</label>
                <select className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none">
                  <option>Principiante</option>
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1 block">Rango de edad</label>
                <select className="w-full px-4 py-3 rounded-xl bg-dark text-white border border-green/10 focus:border-green focus:outline-none">
                  <option>U6 - U8</option>
                  <option>U9 - U10</option>
                  <option>U11 - U12</option>
                  <option>U13 - U14</option>
                  <option>U15 - U16</option>
                  <option>U17 - U18</option>
                  <option>Adulto</option>
                </select>
              </div>
            </div>

            <div className="card p-4 border border-red/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-red-400">Cerrar Sesión</p>
                  <p className="text-white/50 text-sm">Salir de tu cuenta en este dispositivo</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}