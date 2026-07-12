import { cases } from '@/data/cases'
import { getFigmaImageUrls } from '@/lib/figma'
import WorkGrid from '@/components/WorkGrid'
import AboutSection from '@/components/AboutSection'

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
        <WorkGrid cases={cases} imageUrls={imageUrls} />
      </section>

      <AboutSection />
    </>
  )
}
