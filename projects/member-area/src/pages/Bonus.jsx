import { Link } from 'react-router-dom'
import { Gift, Download, FileText, Calendar, ChevronRight, Check, Star, Clock, Home, Package, ExternalLink } from 'lucide-react'
import { BONUS_CONTENT } from '../data/trainings'

export default function Bonus() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-green text-sm font-bold uppercase tracking-wider mb-1">Contenido Extra</p>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white">
          Tus <span className="text-green">Bonus</span> Exclusivos
        </h1>
        <p className="text-white/60 mt-2">Materiales complementarios para potenciar tus entrenamientos</p>
      </div>

      {/* Bonus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BONUS_CONTENT.map((bonus, index) => (
          <div key={bonus.id} className="card p-5 relative overflow-hidden group">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-green/10 rounded-full blur-xl -translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-green/20 flex items-center justify-center mb-4">
                <bonus.icon className="w-7 h-7 text-green" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-bold text-xl text-white mb-2">{bonus.title}</h3>
                <p className="text-white/60 text-sm mb-4 flex-1">{bonus.desc}</p>
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-white/50 text-xs mb-4">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {bonus.type === 'pdf' ? 'PDF' : 'Template'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {bonus.pages} páginas
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green flex-shrink-0" />
                    Acceso inmediato
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green flex-shrink-0" />
                    Descarga ilimitada
                  </li>
                  <li className="flex items-center gap-2 text-white/70 text-sm">
                    <Check className="w-4 h-4 text-green flex-shrink-0" />
                    Actualizaciones incluidas
                  </li>
                </ul>
              </div>

              {/* Action */}
              <a 
                href={bonus.isFile 
                  ? `https://drive.google.com/file/d/${bonus.driveId}/view`
                  : `https://drive.google.com/drive/folders/${bonus.driveId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center py-3 mt-auto flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {bonus.isFile ? 'Ver Archivo' : 'Descargar'}
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Badge */}
              <div className="absolute top-4 left-4 px-2 py-1 bg-green text-dark text-xs font-bold rounded-full">
                BONUS
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <section>
        <h2 className="section-title text-xl mb-4">Tu Progreso</h2>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/50 text-sm">Bonus completados</p>
              <p className="font-display text-3xl font-extrabold text-white">0 / {BONUS_CONTENT.length}</p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-green/20 flex items-center justify-center relative">
              <span className="font-display text-xl font-extrabold text-green">0%</span>
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="120" cy="120" r="110" stroke="currentColor" strokeWidth="8" fill="none" className="text-green/20" />
                <circle cx="120" cy="120" r="110" stroke="currentColor" strokeWidth="8" fill="none" className="text-green" strokeDasharray="691" strokeDashoffset="691" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {BONUS_CONTENT.map((bonus, i) => (
              <div key={bonus.id} className="text-center p-3 rounded-xl bg-dark-100">
                <bonus.icon className="w-8 h-8 text-white/50 mx-auto mb-2" />
                <p className="text-white/50 text-xs">{bonus.title}</p>
                <span className="text-white/30 text-xs">Pendiente</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}