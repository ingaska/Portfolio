'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Case } from '@/data/cases'

interface CaseCardProps {
  case_: Case
  imageUrl: string
  index: number
}

export default function CaseCard({ case_, imageUrl, index }: CaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/work/${case_.slug}`} className="group block">
        <div className="relative overflow-hidden bg-gray-100 aspect-[16/10] rounded-2xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={case_.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: case_.accentColor }}
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#1a1a1a]/0 group-hover:bg-[#1a1a1a]/60 transition-all duration-500 ease-out flex flex-col justify-end p-8">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
<h3 className="text-white text-2xl font-light mb-3">
                {case_.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {case_.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-white/80 border border-white/30 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <div className="flex items-baseline justify-between">
            <h3 className="text-[#1a1a1a] text-base font-medium">{case_.title}</h3>
            <span className="text-[#1a1a1a]/40 text-sm">{case_.subtitle}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
