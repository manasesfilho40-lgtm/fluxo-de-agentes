import VideoCard from './VideoCard'

export default function VideoGrid({ videos, onVideoClick }) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Ningún entrenamiento encontrado</h3>
        <p className="text-gray-500 text-sm max-w-xs">
          Ajusta los filtros o busca por otro término.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} onClick={onVideoClick} />
      ))}
    </div>
  )
}
