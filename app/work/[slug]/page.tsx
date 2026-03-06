import { notFound } from 'next/navigation'
import Image from 'next/image'
import { cases } from '@/data/cases'
import { getCaseDetailImages } from '@/lib/figma'
import CaseAccordion from '@/components/CaseAccordion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const c = cases.find((c) => c.slug === slug)
  if (!c) return {}
  return {
    title: `${c.title} — Inga Sumska`,
    description: c.description,
  }
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params
  const c = cases.find((c) => c.slug === slug)
  if (!c) notFound()

  const allUrls = await getCaseDetailImages(c.detailNodeIds)

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-16">

      {/* ── LEFT: sticky info panel ── */}
      <aside className="
        md:w-[40%] lg:w-[38%] shrink-0
        md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto
        bg-[#f7f7f5]
        px-8 md:px-10 py-10 md:py-12
        flex flex-col gap-8
        border-b md:border-b-0 md:border-r border-[#1a1a1a]/8
      ">

        {/* Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-2 leading-tight">
            {c.title}
          </h1>
          <p className="text-sm text-[#1a1a1a]/45">{c.subtitle}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
          {c.description}
        </p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Role</p>
            <p className="text-sm text-[#1a1a1a]">{c.role}</p>
          </div>
          {c.year && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Year</p>
              <p className="text-sm text-[#1a1a1a]">{c.year}</p>
            </div>
          )}
          {c.users && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Users</p>
              <p className="text-sm text-[#1a1a1a]">{c.users}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Platforms</p>
            <p className="text-sm text-[#1a1a1a]">{c.platforms.join(', ')}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/35 mb-1">Industry</p>
            <p className="text-sm text-[#1a1a1a]">{c.industry}</p>
          </div>
        </div>

        {/* Metrics */}
        {c.metrics && (
          <div className="flex flex-wrap gap-2">
            {c.metrics.map((m) => (
              <span
                key={m}
                className="text-[11px] border border-[#1a1a1a]/12 text-[#1a1a1a]/55 px-2.5 py-1 rounded-full"
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Accordion */}
        <CaseAccordion sections={c.accordionSections} />
      </aside>

      {/* ── RIGHT: scrolling images ── */}
      <main className="flex-1 bg-white p-4 md:p-6 flex flex-col gap-4">

        {/* Detail screens — text sections injected after each image by afterImageIndex */}
        {c.detailNodeIds.map((nodeId, i) => {
          const url = allUrls[nodeId]
          if (!url) return null
          const sectionsAfterThis = c.textSections?.filter(
            (s) => (s.afterImageIndex ?? 0) === i
          )
          return (
            <div key={nodeId} className="contents">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={url}
                  alt={`${c.title} — screen ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
              {sectionsAfterThis?.map((section, j) => (
                <div
                  key={`text-${i}-${j}`}
                  className="w-full rounded-2xl bg-[#f7f7f5] px-8 md:px-12 py-10 md:py-12 flex flex-col gap-6"
                >
                  <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] leading-tight">
                    {section.title}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {section.paragraphs.map((p, k) => (
                      <p key={k} className="text-sm md:text-base text-[#1a1a1a]/65 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="flex flex-col gap-2 pl-4">
                      {section.bullets.map((b, k) => (
                        <li key={k} className="text-sm md:text-base text-[#1a1a1a]/65 leading-relaxed list-disc">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.closing && (
                    <p className="text-sm md:text-base text-[#1a1a1a]/65 leading-relaxed">
                      {section.closing}
                    </p>
                  )}
                  {section.items && (
                    <div className="flex flex-col gap-5">
                      {section.items.map((item, k) => (
                        <div key={k}>
                          <p className="text-sm md:text-base font-medium text-[#1a1a1a] mb-1">{item.label}</p>
                          <p className="text-sm md:text-base text-[#1a1a1a]/65 leading-relaxed">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </main>

    </div>
  )
}
