import type { MetadataRoute } from 'next'
import { cases } from '@/data/cases'

export default function sitemap(): MetadataRoute.Sitemap {
  const casePages = cases.map((c) => ({
    url: `https://www.sumska.io/work/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://www.sumska.io',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...casePages,
  ]
}
