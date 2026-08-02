import { useState, useMemo } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { ALL_VIDEOS } from '../data'
import FilterSidebar from '../components/FilterSidebar'
import VideoGrid from '../components/VideoGrid'
import SearchBar from '../components/SearchBar'
import VideoModal from '../components/VideoModal'

export default function Catalog() {
  const [filters, setFilters] = useState({ types: [], ages: [], positions: [], search: '' })
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const videoCounts = useMemo(() => {
    const counts = { types: {}, ages: {}, positions: {} }
    ALL_VIDEOS.forEach(v => {
      counts.types[v.type] = (counts.types[v.type] || 0) + 1
      counts.ages[v.age] = (counts.ages[v.age] || 0) + 1
      counts.positions[v.position] = (counts.positions[v.position] || 0) + 1
    })
    return counts
  }, [])

  const filteredVideos = useMemo(() => {
    return ALL_VIDEOS.filter(video => {
      if (filters.types.length > 0 && !filters.types.includes(video.type)) return false
      if (filters.ages.length > 0 && !filters.ages.includes(video.age)) return false
      if (filters.positions.length > 0 && !filters.positions.includes(video.position)) return false
      if (filters.search) {
        const s = filters.search.toLowerCase()
        return video.title.toLowerCase().includes(s) || video.position.toLowerCase().includes(s)
      }
      return true
    })
  }, [filters])

  const activeCount = filters.types.length + filters.ages.length + filters.positions.length

  return (
    <div className="min-h-screen bg-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Catálogo</h1>
          <p className="text-gray-500 text-sm">
            {filteredVideos.length} entrenamientos de {ALL_VIDEOS.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={filters.search} onChange={(search) => setFilters(prev => ({ ...prev, search }))} />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden inline-flex items-center justify-center gap-2 bg-dark-50 border border-white/5 px-4 py-3 rounded-xl text-sm font-medium text-white hover:border-white/10 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeCount > 0 && (
              <span className="bg-neon text-dark text-[10px] font-bold px-1.5 py-0.5 rounded">{activeCount}</span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} videoCounts={videoCounts} />
          </div>

          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="absolute inset-0 bg-dark/80" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-dark p-4 overflow-y-auto border-l border-white/5">
                <FilterSidebar filters={filters} setFilters={setFilters} videoCounts={videoCounts} />
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <VideoGrid videos={filteredVideos} onVideoClick={setSelectedVideo} />
          </div>
        </div>
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
