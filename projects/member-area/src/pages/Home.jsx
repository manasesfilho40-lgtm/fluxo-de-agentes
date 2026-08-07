import { Link } from 'react-router-dom'
import { BookOpen, Gift, Target, Flame, TrendingUp, Clock, ChevronRight, Play, ExternalLink, FileText, Download } from 'lucide-react'
import { useState } from 'react'
import { CATEGORIES, BONUS_CONTENT } from '../data/trainings'

export default function Home() {
  const [viewMode, setViewMode] = useState('grid')

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in-up">
        <p className="text-green text-sm font-bold uppercase tracking-wider mb-1">Bem-vindo de volta</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
          Continuemos seus <span className="text-green">estudos</span>
        </h1>
        <p className="text-white/60 mt-2">Escolha uma disciplina para acessar o material completo</p>
      </div>

      {/* Categories Grid */}
      <section className="animate-fade-in-up-delay-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-xl">Disciplinas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map(cat => (
            <a 
              key={cat.id} 
              href={cat.file}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex flex-col hover:border-green/30 transition-all"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-dark-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText size={40} className="text-white/30" />
                </div>
                <div className="absolute bottom-2 right-2 z-20">
                  <span className="px-2 py-1 bg-green text-dark text-xs rounded-full font-medium flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white">{cat.name}</h3>
                  <p className="text-white/50 text-sm">Material completo</p>
                </div>
                <span className="px-2 py-1 bg-green/20 text-green text-xs rounded-full font-medium">
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Bonus Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-xl">Seus Bônus</h2>
          <Link to="/bonus" className="text-green text-sm font-medium flex items-center gap-1">
            Ver todos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BONUS_CONTENT.map(bonus => (
            <a 
              key={bonus.id} 
              href={bonus.file}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-4 flex flex-col hover:border-yellow-400/30 transition-all"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-dark-100">
                <img 
                  src={bonus.image} 
                  alt={bonus.title}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="w-full h-full flex items-center justify-center">
                  <FileText size={48} className="text-yellow-400/50" />
                </div>
              </div>
              <h3 className="font-bold text-white">{bonus.title}</h3>
              <p className="text-white/50 text-sm mt-1 flex-1">{bonus.desc}</p>
              <span className="text-green text-sm font-medium mt-2 flex items-center gap-1">
                Acessar <ChevronRight className="w-4 h-4" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">14</div>
            <div className="text-white/50 text-sm">Disciplinas</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">5</div>
            <div className="text-white/50 text-sm">Bônus Exclusivos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">19</div>
            <div className="text-white/50 text-sm">PDFs Completos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-extrabold text-green">24h</div>
            <div className="text-white/50 text-sm">Acesso Imediato</div>
          </div>
        </div>
      </section>
    </div>
  )
}
