'use client'

import { useState } from 'react'
import { AccordionSection } from '@/data/cases'

interface Props {
  sections: AccordionSection[]
}

export default function CaseAccordion({ sections }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="w-full">
      {sections.map((section, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="border-t border-[#1a1a1a]/10">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left group"
              aria-expanded={isOpen}
            >
              <span className="text-sm text-[#1a1a1a] font-medium tracking-wide">
                {section.title}
              </span>
              <span
                className="text-[#1a1a1a]/40 text-xl leading-none transition-transform duration-300 ease-out select-none"
                style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>

            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                maxHeight: isOpen ? '400px' : '0px',
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="text-sm text-[#1a1a1a]/55 leading-relaxed pb-5 pr-2">
                {section.content}
              </p>
            </div>
          </div>
        )
      })}
      <div className="border-t border-[#1a1a1a]/10" />
    </div>
  )
}
