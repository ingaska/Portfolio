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
        <h1 className="text-[#1a1a1a] text-xl md:text-2xl font-light leading-snug max-w-xl">
          Product Design Lead —{' '}
          <span className="text-[#1a1a1a]/40">
            from zero to scale, building products people return to
          </span>
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#1a1a1a]/45 font-light">
          Mobile · Web · AI-built products · Design systems · 0→1
        </p>
      </section>

      {/* Cases grid */}
      <section className="px-6 md:px-12 pb-16 md:pb-24">
        <WorkGrid cases={cases} imageUrls={imageUrls} />
      </section>

      <AboutSection />
    </>
  )
}
