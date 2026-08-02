import { Play, Clock } from 'lucide-react'

export default function VideoCard({ video, onClick }) {
  return (
    <div
      onClick={() => onClick?.(video)}
      className="group bg-dark border border-white/5 rounded-xl overflow-hidden hover:border-neon/30 transition-colors cursor-pointer"
    >
      <div className="relative aspect-video bg-dark-100 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon/10 group-hover:border-neon/30 transition-colors">
          <Play size={18} className="text-gray-400 ml-0.5 group-hover:text-neon transition-colors" fill="currentColor" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {video.duration}
          </span>
        </div>
      </div>
    </div>
  )
}
