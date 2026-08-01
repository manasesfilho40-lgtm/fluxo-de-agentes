import { Link } from 'react-router-dom'
import { BookOpen, Gift, Target, Flame, TrendingUp, Clock, ChevronRight, Play, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { CATEGORIES, LEVELS, AGE_RANGES, BONUS_CONTENT } from '../data/trainings'

// Imagem da bola no gramado para todos os cards
const CARD_IMAGE = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'

export default function Home() {
  const [viewMode, setViewMode] = useState('grid')

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in-up">
        <p className="text-green text-sm font-bold uppercase tracking-wider mb-1">Bienvenido de vuelta</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
          Continuemos tu <span className="text-green">entrenamiento</span>
        </h1>
        <p className="text-white/60 mt-2">Elige una categoría para ver todos los entrenamientos</p>
      </div>

      {/* Categories Grid - All Categories */}
      <section className="animate-fade-in-up-delay-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-xl">Categorías</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.id} 
              to={cat.driveId ? `https://drive.google.com/drive/folders/${cat.driveId}` : `/categoria/${cat.id}`}
              target={cat.driveId ? '_blank' : undefined}
              rel={cat.driveId ? 'noopener noreferrer' : undefined}
              className="card p-4 flex flex-col"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                {cat.driveId && (
                  <div className="absolute bottom-2 right-2">
                    <span className="px-2 py-1 bg-green text-dark text-xs rounded-full font-medium flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Drive
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{cat.name}</h3>
                  <p className="text-white/50 text-sm">{cat.count} entrenamientos</p>
                </div>
                <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
                  {cat.count}+
                  {cat.driveId && <ExternalLink className="w-3 h-3 ml-1" />}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bonus Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-xl">Tus Bonus</h2>
          <Link to="/bonus" className="text-green text-sm font-medium flex items-center gap-1">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BONUS_CONTENT.map(bonus => (
            <a 
              key={bonus.id} 
              href={bonus.driveId ? `https://drive.google.com/drive/folders/${bonus.driveId}` : '/bonus'}
              target={bonus.driveId ? '_blank' : undefined}
              rel={bonus.driveId ? 'noopener noreferrer' : undefined}
              className="card p-4 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-green/20 flex items-center justify-center mb-3">
                <bonus.icon className="w-6 h-6 text-green" />
              </div>
              <h3 className="font-bold text-white">{bonus.title}</h3>
              <p className="text-white/50 text-sm mt-1 flex-1">{bonus.desc}</p>
              <span className="text-green text-sm font-medium mt-2 flex items-center gap-1">
                Ver <ChevronRight className="w-4 h-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">300+</div>
            <div className="text-white/50 text-sm">Entrenamientos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">15</div>
            <div className="text-white/50 text-sm">Categorías</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">3</div>
            <div className="text-white/50 text-sm">Niveles</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">7</div>
            <div className="text-white/50 text-sm">Rangos Edad</div>
          </div>
        </div>
      </section>
    </div>
  )
}