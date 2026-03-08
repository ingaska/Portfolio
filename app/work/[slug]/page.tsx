import { notFound } from 'next/navigation'
import Image from 'next/image'
import { cases } from '@/data/cases'
import { getCaseDetailImages } from '@/lib/figma'
import CaseAccordion from '@/components/CaseAccordion'

export const dynamic = 'force-dynamic'

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

  const mobileMappings = c.mobileMappings ?? {}
  const mobileAppendIds = c.mobileAppendNodeIds ?? []
  const allMobileIds = [...Object.values(mobileMappings).flat(), ...mobileAppendIds]
  const allUrls = await getCaseDetailImages([...c.detailNodeIds, ...allMobileIds])

  return (
    <div className="flex flex-col md:flex-row min-h-screen pt-16">

      {/* ── LEFT: sticky info panel ── */}
      <aside className="
        md:w-[40%] lg:w-[38%] shrink-0
        md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto
        bg-[#f7f7f5]
        px-5 md:px-10 py-7 md:py-12
        flex flex-col gap-5 md:gap-8
        border-b md:border-b-0 md:border-r border-[#1a1a1a]/8
      ">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-2 leading-tight">
            {c.title}
          </h1>
          <p className="text-sm text-[#1a1a1a]/45">{c.subtitle}</p>
        </div>

        <p className="text-sm text-[#1a1a1a]/60 leading-relaxed">
          {c.description}
        </p>

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

        <CaseAccordion sections={c.accordionSections} />
      </aside>

      {/* ── RIGHT: unified image + text stream ── */}
      <main className="flex-1 bg-white p-3 md:p-6 flex flex-col gap-3 md:gap-4">

        {c.detailNodeIds.map((nodeId, i) => {
          const desktopUrl = allUrls[nodeId]
          const mobileIds = mobileMappings[nodeId] ?? []
          const hasMobile = mobileIds.length > 0
          const sectionsAfterThis = c.textSections?.filter(
            (s) => (s.afterImageIndex ?? 0) === i
          )

          return (
            <div key={nodeId} className="flex flex-col gap-3 md:gap-4">

              {/* Desktop image — hidden on mobile when a mobile replacement exists */}
              {desktopUrl && (
                <Image
                  src={desktopUrl}
                  alt={`${c.title} — screen ${i + 1}`}
                  width={1200}
                  height={675}
                  className={`w-full h-auto rounded-2xl${hasMobile ? ' hidden md:block' : ''}`}
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              )}

              {/* Mobile replacement frames — shown only on mobile */}
              {hasMobile && (
                <div className="md:hidden flex flex-col gap-3">
                  {mobileIds.map((mId, j) => {
                    const url = allUrls[mId]
                    if (!url) return null
                    return (
                      <Image
                        key={mId}
                        src={url}
                        alt={`${c.title} — screen ${i + 1}.${j + 1}`}
                        width={800}
                        height={1000}
                        className="w-full h-auto rounded-2xl"
                        priority={i === 0}
                        sizes="100vw"
                      />
                    )
                  })}
                </div>
              )}

              {/* Text sections — same position on mobile and desktop */}
              {sectionsAfterThis?.map((section, j) => (
                <div
                  key={`text-${i}-${j}`}
                  className="w-full rounded-2xl bg-[#f7f7f5] px-5 md:px-12 py-7 md:py-12 flex flex-col gap-5 md:gap-6"
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

        {/* Mobile-only frames appended after all main content */}
        {mobileAppendIds.length > 0 && (
          <div className="md:hidden flex flex-col gap-3">
            {mobileAppendIds.map((nodeId, i) => {
              const url = allUrls[nodeId]
              if (!url) return null
              return (
                <Image
                  key={nodeId}
                  src={url}
                  alt={`${c.title} — additional screen ${i + 1}`}
                  width={800}
                  height={1000}
                  className="w-full h-auto rounded-2xl"
                  sizes="100vw"
                />
              )
            })}
          </div>
        )}

      </main>
    </div>
  )
}
