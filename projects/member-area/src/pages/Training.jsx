import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Play, Pause, Fullscreen, Volume2, VolumeX, ChevronRight, Share2, Bookmark, Download, Star, Clock, Target } from 'lucide-react'
import { ALL_TRAININGS, getTrainingsByCategoryAndLevel } from '../data/trainings'

export default function Training() {
  const { id } = useParams()
  const training = ALL_TRAININGS.find(t => t.id === parseInt(id))
  const relatedTrainings = training 
    ? getTrainingsByCategoryAndLevel(training.category, training.level).filter(t => t.id !== training.id).slice(0, 4)
    : []

  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', () => setDuration(video.duration))
      video.addEventListener('timeupdate', () => setCurrentTime(video.currentTime))
      video.addEventListener('ended', () => setIsPlaying(false))
    }
    return () => {
      if (video) {
        video.removeEventListener('loadedmetadata', () => setDuration(video.duration))
        video.removeEventListener('timeupdate', () => setCurrentTime(video.currentTime))
      }
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (video) {
      if (isPlaying) video.pause()
      else video.play()
      setIsPlaying(!isPlaying)
    }
  }

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (container) {
      if (!isFullscreen) {
        container.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }

  const formatTime = (time) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (video) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      video.currentTime = pos * video.duration
    }
  }

  const hideControlsTimer = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000)
  }

  if (!training) return null

  return (
    <div className="min-h-screen bg-dark">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => hideControlsTimer()} onMouseMove={() => { setShowControls(true); hideControlsTimer() }}>
        <video
          ref={videoRef}
          src={training.videoUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />
        
        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-none">
            {/* Progress Bar */}
            <div className="mb-4 pointer-events-auto" onClick={handleSeek} onMouseMove={hideControlsTimer}>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="h-full bg-green rounded-full transition-all duration-100"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/70 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <button onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 10 }} className="p-2 text-white/80 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="19 20 9 12 19 4 19 20" />
                    <line x1="5" y1="19" x2="5" y2="5" />
                  </svg>
                </button>
                <button onClick={togglePlay} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button onClick={() => { if (videoRef.current) videoRef.current.currentTime += 10 }} className="p-2 text-white/80 hover:text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 4 15 12 5 20 5 4" />
                    <line x1="19" y1="5" x2="19" y2="19" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)} className="p-2 text-white/80 hover:text-white">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button onClick={toggleFullscreen} className="p-2 text-white/80 hover:text-white">
                  <Fullscreen className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Training Info */}
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green/20 text-green text-xs rounded-full font-bold uppercase">
                {training.categoryName}
              </span>
              <span className="px-3 py-1 bg-green/20 text-green text-xs rounded-full font-bold">
                {training.levelName}
              </span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-2">{training.title}</h1>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {training.duration}</span>
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> {training.levelName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 rounded-xl bg-dark-100 text-white/70 hover:text-white">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-dark-100 text-white/70 hover:text-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-dark-100 text-white/70 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="font-bold text-white mb-2">Descripción</h3>
          <p className="text-white/70 leading-relaxed">{training.description}</p>
        </div>
      </div>

      {/* Related Trainings */}
      {relatedTrainings.length > 0 && (
        <section className="px-4 lg:px-6 pb-8">
          <h2 className="section-title text-xl mb-4">Más entrenamientos de {training.categoryName} - {training.levelName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTrainings.map(related => (
              <Link key={related.id} to={`/entrenamiento/${related.id}`} className="card overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-100">
                    <Play className="w-10 h-10 text-white/90" />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="px-2 py-1 bg-green text-dark text-xs rounded font-bold">{related.duration}</span>
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">{related.levelName}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-white text-sm line-clamp-2">{related.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}