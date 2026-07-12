'use client'

import { useState } from 'react'
import { Case, CaseCategory } from '@/data/cases'
import CaseCard from './CaseCard'

interface WorkGridProps {
  cases: Case[]
  imageUrls: Record<string, string>
}

const FILTERS: { label: string; value: CaseCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Apps', value: 'apps' },
  { label: 'Dashboards', value: 'dashboards' },
]

export default function WorkGrid({ cases, imageUrls }: WorkGridProps) {
  const [active, setActive] = useState<CaseCategory | 'all'>('all')

  const visible = active === 'all' ? cases : cases.filter((c) => c.category === active)

  return (
    <>
      {/* Filter chips */}
      <div className="flex gap-2 mb-10">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={[
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
              active === value
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-[#1a1a1a]/6 text-[#1a1a1a]/60 hover:bg-[#1a1a1a]/10 hover:text-[#1a1a1a]',
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-14">
        {visible.map((c, i) => (
          <CaseCard
            key={c.slug}
            case_={c}
            imageUrl={imageUrls[c.figmaNodeId] ?? ''}
            index={i}
          />
        ))}
      </div>
    </>
  )
}
