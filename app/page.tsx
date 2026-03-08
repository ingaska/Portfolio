import { cases } from '@/data/cases'
import { getFigmaImageUrls } from '@/lib/figma'
import CaseCard from '@/components/CaseCard'
import AboutSection from '@/components/AboutSection'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const nodeIds = cases.map((c) => c.figmaNodeId)
  const imageUrls = await getFigmaImageUrls(nodeIds)

  return (
    <>
      {/* Hero */}
      <section className="px-6 md:px-12 pt-28 pb-12 md:pt-44 md:pb-20">
        <h1 className="text-[#1a1a1a] text-3xl md:text-3xl font-light leading-snug max-w-xl">
          Product Design Lead —{' '}
          <span className="text-[#1a1a1a]/40">
            from zero to scale, building products people return to
          </span>
        </h1>
      </section>

      {/* Cases grid */}
      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-y-14">
          {cases.map((c, i) => (
            <CaseCard
              key={c.slug}
              case_={c}
              imageUrl={imageUrls[c.figmaNodeId] ?? ''}
              index={i}
            />
          ))}
        </div>
      </section>

      <AboutSection />
    </>
  )
}
