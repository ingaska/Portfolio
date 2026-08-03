import { ReactNode } from 'react'

const skills: { category: string; title: string; body: ReactNode }[] = [
  { category: 'Education', title: 'Graphic design degree.', body: 'Deep understanding of all design basics: colour, typography, composition.' },
  { category: 'Full-cycle design', title: 'I do the whole design cycle.', body: 'From first idea to shipped product: research, brand, UX, design system, testing, handoff.' },
  { category: 'Product types', title: 'I work with mobile and web.', body: 'Shipped iOS, Android apps, marketing sites, B2B dashboards.' },
  { category: 'Fields', title: 'Experience across many fields.', body: 'Femtech, fitness, fintech, healthcare, streaming, education, utilities, iGaming.' },
  { category: 'Experience', title: '10+ years in the craft.', body: 'Shipped real products across brand, product, and motion design.' },
  { category: 'Team lead', title: "I've led teams.", body: '5 designers in the team. Hiring, onboarding, feedback, one-on-ones — in parallel with an IC role.' },
  { category: 'User research', title: 'I check before I design.', body: 'Interviews, usability testing, market research, A/B tests, looking at the numbers.' },
  { category: 'Design systems', title: 'I build design systems.', body: 'Built from scratch. Managed one used by 25+ UX designers, 200+ brand designers, 250+ products.' },
  { category: 'Branding & identity', title: 'I do brand work.', body: 'Built branding for products from scratch: naming, logo, style, brand guidelines.' },
  { category: 'Motion & AE', title: 'I animate.', body: 'After Effects, UI micro-interactions, onboarding, brand animation.' },
  { category: 'Frontend literacy', title: 'Background in dev.', body: 'HTML and CSS from my early career. I can talk to developers in their language.' },
  {
    category: 'AI stack',
    title: 'Learning AI by doing.',
    body: 'AI-powered workflow: Claude, Figma agents, image and video generation — across the full design process.',
  },
]

export default function SkillsSection() {
  return (
    <section className="px-4 md:px-12 pb-10 md:pb-14">
      <h2 className="text-xl md:text-2xl font-light text-[#1a1a1a] mb-6">
        What I bring
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((s) => (
          <div
            key={s.category}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 4px 0 rgba(26,26,26,0.07), 0 0 0 1px rgba(26,26,26,0.04)' }}
          >
            <span
              className="self-start text-[10px] uppercase tracking-widest font-medium rounded-full px-2.5 py-1"
              style={{ color: '#3B6EF0', backgroundColor: '#EEF3FF' }}
            >
              {s.category}
            </span>
            <div className="flex flex-col gap-1.5">
              <p className="text-base font-medium text-[#1a1a1a] leading-snug">{s.title}</p>
              <p className="text-sm text-[#1a1a1a]/55 leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
