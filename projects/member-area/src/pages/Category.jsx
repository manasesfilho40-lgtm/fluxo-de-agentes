import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, FileText, Download, ExternalLink } from 'lucide-react'
import { CATEGORIES } from '../data/trainings'

export default function Category() {
  const { id } = useParams()
  const category = CATEGORIES.find(c => c.id === id)

  if (!category) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/" className="p-2 rounded-xl bg-dark-100 text-white/70 hover:text-white">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-green/20 text-green text-xs rounded-full font-bold uppercase">
              {category.name}
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Material Card */}
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-xl bg-dark-100 flex items-center justify-center shrink-0">
            <FileText size={32} className="text-green" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-lg mb-2">{category.name}</h2>
            <p className="text-white/60 text-sm mb-4">Material completo para estudo da disciplina.</p>
            <a
              href={category.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 text-sm"
            >
              <Download className="w-4 h-4" />
              Acessar PDF
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Back button */}
      <Link to="/" className="block text-center text-green text-sm font-medium hover:underline">
        ← Voltar para todas as disciplinas
      </Link>
    </div>
  )
}
