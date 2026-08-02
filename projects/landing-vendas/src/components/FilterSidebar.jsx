import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { TRAINING_TYPES, AGE_CATEGORIES, POSITIONS } from '../data'

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-white/5 pb-4 mb-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full text-left mb-3">
        <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  )
}

function Checkbox({ label, checked, onChange, count }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
        checked ? 'bg-neon border-neon' : 'border-gray-600 group-hover:border-gray-400'
      }`}>
        {checked && (
          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex-1">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">{count}</span>
      )}
    </label>
  )
}

export default function FilterSidebar({ filters, setFilters, videoCounts }) {
  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }))
  }

  const activeCount = filters.types.length + filters.ages.length + filters.positions.length

  return (
    <div className="bg-dark-50 border border-white/5 rounded-xl p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-white">Filtros</h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ types: [], ages: [], positions: [], search: '' })}
            className="text-[11px] text-neon hover:text-neon/80 font-medium"
          >
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Tipo de Entrenamiento">
        {TRAINING_TYPES.map(type => (
          <Checkbox key={type.id} label={type.name} checked={filters.types.includes(type.id)}
            onChange={() => toggleFilter('types', type.id)} count={videoCounts?.types?.[type.id]} />
        ))}
      </FilterSection>

      <FilterSection title="Rango de Edad">
        {AGE_CATEGORIES.map(age => (
          <Checkbox key={age.id} label={age.name} checked={filters.ages.includes(age.id)}
            onChange={() => toggleFilter('ages', age.id)} count={videoCounts?.ages?.[age.id]} />
        ))}
      </FilterSection>

      <FilterSection title="Posición">
        {POSITIONS.map(pos => (
          <Checkbox key={pos.id} label={pos.name} checked={filters.positions.includes(pos.id)}
            onChange={() => toggleFilter('positions', pos.id)} count={videoCounts?.positions?.[pos.id]} />
        ))}
      </FilterSection>
    </div>
  )
}
