import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Filter, Grid, List, Star, Clock, Play, ChevronRight, FolderOpen, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { CATEGORIES, LEVELS, getTrainingsByCategory, getTrainingsByCategoryAndLevel } from '../data/trainings'

export default function Category() {
  const { id } = useParams()
  const [selectedLevel, setSelectedLevel] = useState('todos')
  const [viewMode, setViewMode] = useState('grid')
  
  const category = CATEGORIES.find(c => c.id === id)
  const trainings = selectedLevel === 'todos' 
    ? getTrainingsByCategory(id)
    : getTrainingsByCategoryAndLevel(id, selectedLevel)

  if (!category) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/categoria/todas" className="p-2 rounded-xl bg-dark-100 text-white/70 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-green/20 text-green text-xs rounded-full font-bold uppercase">
              {category.name}
            </span>
            <span className="text-white/50 text-sm">{category.count}+ entrenamientos</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            {category.name}
          </h1>
        </div>
        {category.driveId && (
          <a 
            href={`https://drive.google.com/drive/folders/${category.driveId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-green/20 text-green hover:bg-green/30 flex items-center gap-1"
            title="Ver carpeta en Google Drive"
          >
            <FolderOpen className="w-5 h-5" />
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Level Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        <button
          onClick={() => setSelectedLevel('todos')}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            selectedLevel === 'todos'
              ? 'bg-green text-dark'
              : 'bg-dark-100 text-white/70 hover:text-white'
          }`}
        >
          Todos los niveles
        </button>
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => setSelectedLevel(level.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              selectedLevel === level.id
                ? 'bg-green text-dark'
                : 'bg-dark-100 text-white/70 hover:text-white'
            }`}
          >
            <level.icon className={`w-3 h-3 ${level.color}`} />
            {level.name}
          </button>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-white/50 text-sm">{trainings.length} entrenamientos encontrados</p>
        <div className="flex gap-1 bg-dark-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' ? 'bg-green text-dark' : 'text-white/50 hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-green text-dark' : 'text-white/50 hover:text-white'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Trainings Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map(training => (
            <Link key={training.id} to={`/entrenamiento/${training.id}`} className="card overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center bg-dark-100">
                  <Play className="w-10 h-10 text-white/90" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-1 bg-green text-dark text-xs rounded font-bold">
                    {training.duration}
                  </span>
                  <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                    {training.levelName}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white line-clamp-2">{training.title}</h3>
                <p className="text-white/50 text-sm">{training.description}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {trainings.map(training => (
            <Link key={training.id} to={`/entrenamiento/${training.id}`} className="card p-4 flex items-center gap-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <Play className="absolute inset-0 flex items-center justify-center w-10 h-10 text-white/90 mx-auto my-auto" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate">{training.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {training.duration}</span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green/20 text-green rounded">{training.levelName}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </Link>
          ))}
        </div>
      )}

      {trainings.length === 0 && (
        <div className="text-center py-12 text-white/50">
          No hay entrenamientos para este nivel en esta categoría
        </div>
      )}
    </div>
  )
}