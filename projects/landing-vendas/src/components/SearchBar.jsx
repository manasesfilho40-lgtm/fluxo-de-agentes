import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar entrenamientos..."
        className="w-full pl-11 pr-10 py-3 bg-dark-50 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-neon/30 transition-colors"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
