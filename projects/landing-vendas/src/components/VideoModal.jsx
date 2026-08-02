import { X, Play, Clock, ArrowRight } from 'lucide-react'

export default function VideoModal({ video, onClose }) {
  if (!video) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-50 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="relative aspect-video bg-dark flex items-center justify-center rounded-t-2xl">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-neon/10 hover:border-neon/30 transition-colors cursor-pointer">
            <Play size={24} className="text-gray-400 ml-1" fill="currentColor" />
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-white mb-2">{video.title}</h2>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {video.duration}
            </span>
            <span>·</span>
            <span className="capitalize">{video.position}</span>
          </div>

          <a
            href="https://pay.cakto.com.br/9fuib6v_992374"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-neon text-dark py-3.5 rounded-xl font-bold hover:bg-neon/90 transition-colors"
          >
            SUSCRIBIR PARA ACCEDER
            <ArrowRight size={16} />
          </a>

          <p className="text-center text-[11px] text-gray-500 mt-3">
            Acceso ilimitado a todos los 300+ entrenamientos
          </p>
        </div>
      </div>
    </div>
  )
}
