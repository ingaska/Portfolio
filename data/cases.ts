export interface AccordionSection {
  title: string
  content: string
}

export interface TextSectionItem {
  label: string
  description: string
}

export interface TextSection {
  title: string
  paragraphs: string[]
  bullets?: string[]       // simple bullet list rendered after paragraphs
  closing?: string         // closing paragraph rendered after bullets
  items?: TextSectionItem[] // bold-label feature list rendered last
  afterImageIndex?: number  // which image index to inject after (default 0)
}

export type CaseCategory = 'apps' | 'dashboards'

export interface Case {
  slug: string
  title: string
  subtitle: string
  description: string
  role: string
  year?: string
  users?: string
  platforms: string[]
  industry: string
  tags: string[]
  category?: CaseCategory
  figmaNodeId: string       // cover frame
  detailNodeIds: string[]   // visual screen frames for right column (desktop)
  mobileMappings?: Record<string, string[]>  // desktop nodeId → mobile frame(s) to show instead
  mobileAppendNodeIds?: string[]             // mobile-only frames appended after all desktop frames
  metrics?: string[]
  accentColor: string
  cardBorder?: string
  accordionSections: AccordionSection[]
  textSections?: TextSection[]  // optional text blocks shown before images in right panel
}

export const cases: Case[] = [
  {
    slug: 'femia',
    title: 'Femia',
    subtitle: "Women's Health & Fertility App",
    description: "Built for women navigating fertility, pregnancy and beyond — not another tracker, but something they could genuinely trust. I joined before the product existed and owned the full experience: naming, brand, UX strategy and design system across iOS, Android and Web.",
    role: 'Product Design Lead',
    year: '2022–2025',
    users: '1.2M+',
    platforms: ['iOS', 'Android', 'Web'],
    industry: 'Femtech',
    tags: ['Femtech', 'Health'],
    figmaNodeId: '2577:16633',
    detailNodeIds: [
      '318:6883',  // Case 1.2
      'local:case-images/femia-retention.png', // Retention chart
      '2563:19919', // Case 1.4 — Data-driven personalisation & health monitoring
      '321:5652',  // Case 1.5
      '2376:8118', // Case 1.6
      '321:11601', // Case 1.8 — The Femia world
      '323:21773', // Case 1.11 — A system built to scale
      '325:6402',  // Case 1.14
      '2410:9909', // Case 1.15
      '2322:5732', // Case 1.17
    ],
    mobileMappings: {
      '318:6883':   ['2585:17334', '2585:20671'],  // Case 1.2  → 1.2 mob + 1.2.1 mob
      '2563:19919': ['2594:29840', '2594:32281'],  // Case 1.4  → 1.4 mob + 1.4.1 mob
      '321:5652':   ['2595:36780', '2605:28812'],    // Case 1.5  → mobile frames
      '2376:8118':  ['2722:23412', '2722:24708'],    // Case 1.6  → mobile frames
      '321:11601':  ['2668:23143', '2668:29788'],    // Case 1.8  → mobile frames
      '2322:5732':  ['2595:40106'],                // Case 1.17 → 1.19 mob
    },
    metrics: ['Featured by App Store', '4.9 App Store', '4.6 Google Play', 'Retention M1-60%'],
    category: 'apps',
    accentColor: '#5E71CD',
    accordionSections: [
      {
        title: 'Challenge',
        content: "Women's health data is deeply personal. The app needed to earn trust from day one — covering cycle tracking, fertility planning, and pregnancy without ever feeling clinical or overwhelming. Each life phase required its own design language, content tone, and interaction model, all within a single coherent product.",
      },
      {
        title: 'Approach',
        content: "Owned the full design system and every user-facing touchpoint over 3 years. Designed the core cycle dashboard, symptom and mood logging, fertility window predictions, week-by-week pregnancy journey, AI health assistant, and personalised daily content. Ran A/B tests on onboarding to cut early drop-off, collaborated with medical reviewers on accuracy, and worked with data teams to make every personalisation feel meaningful.",
      },
      {
        title: 'Results',
        content: "1.2M+ users · 4.9 App Store · 4.6 Google Play · 60% Month-1 retention · Featured by Apple in Health & Wellbeing",
      },
    ],
    textSections: [
      {
        title: 'Retention mechanics & engagement strategy',
        paragraphs: [
          "Working closely with the product team, I shaped the core mechanics that give users a reason to come back. We validated every major decision through analytics, A/B testing, and real user feedback.",
        ],
        items: [
          {
            label: 'Cycle-based insights powered by logged behaviour',
            description: "Daily insights built on each user's cycle data — so the app feels like it knows the user.",
          },
          {
            label: 'Fertility programmes & daily plans',
            description: 'Step-by-step guidance and routines supporting healthy habits formation.',
          },
          {
            label: 'Educational content & courses',
            description: 'Structured learning that deepens trust and makes the product feel worth paying for.',
          },
          {
            label: 'AI-chat support',
            description: 'A conversational layer for sensitive questions.',
          },
          {
            label: 'Pregnancy mode',
            description: "A seamless transition into pregnancy tracking, so users don't have to leave when their journey changes.",
          },
        ],
      },
      {
        title: 'Data-driven personalisation & health monitoring',
        afterImageIndex: 1,
        paragraphs: [
          "We built a suite of health monitoring tools that turned raw cycle data into clear, personal guidance — fertility window calculations, cycle pattern analysis, ovulation test logging, and a health profile that shaped daily insights and long-term recommendations.",
          "The result was a product that felt like it genuinely understood each user's body, acting like a personalised health companion that got more useful with every cycle logged.",
        ],
      },
      {
        title: 'Pregnancy mode: supporting users through every life change',
        afterImageIndex: 2,
        paragraphs: [
          "When a user becomes pregnant, her needs change completely — but she shouldn't have to leave the app to get support. Pregnancy mode was designed to make that transition feel seamless, keeping users in a product they already trusted rather than forcing them to start over somewhere else.",
          "We built a dedicated pregnancy experience woven into the same product: week-by-week guidance, tailored health content, and a tone that acknowledged this was a different chapter — not a different app.",
          "Crucially, the experience was designed with the full arc in mind. When pregnancy ended, Femia was ready to welcome users back — reconnecting them with their cycle, their goals, and their health data, exactly where they left off.",
        ],
      },
      {
        title: 'Design system & product operations',
        afterImageIndex: 5,
        paragraphs: [
          "Building across iOS, Android, and Web required a design system that could scale without breaking. I built it from scratch to ensure consistency, speed up production, and give the team a shared language to work from.",
        ],
        items: [
          {
            label: 'Core library',
            description: 'A multi-platform foundation of components, layouts, and a character library built from zero, supporting platforms simultaneously.',
          },
          {
            label: 'Content templates',
            description: 'A dedicated design framework for content delivery, covering articles, educational highlights, and AI chat interactions, so content could be produced at scale without losing visual consistency and supporting multiple languages.',
          },
          {
            label: 'Library of visuals',
            description: "A comprehensive system of illustrations and brand visuals that unified the product's identity across both the app and content experience.",
          },
        ],
      },
      {
        title: 'Personalised content as a core retention engine',
        afterImageIndex: 3,
        paragraphs: [
          "From early on, content was treated not as an addition to the product but as a core retention driver. The goal was to build a digital companion that gives users something genuinely useful every single day, not just when they open the app to log something.",
          "We built a continuous delivery system that adapted to each user's cycle phase, fertility goals, and logged symptoms.",
          "Users received:",
        ],
        bullets: [
          "daily stories and insights tailored to their cycle",
          "fertility forecasts and phase-based guidance",
          "contextual advice triggered by their logged symptoms",
          "educational content reviewed by certified medical experts",
        ],
        closing: "The result: the app stopped feeling like a tracker and started feeling like something worth coming back to.",
      },
      {
        title: 'Marketing & user acquisition',
        afterImageIndex: 6,
        paragraphs: [
          "I was responsible for making sure the visual and UX foundation held together across every acquisition and onboarding touchpoint, from marketing creatives to App Store assets to the first screen a new user sees.",
          "To support continuous growth testing, I built a unified design system covering all acquisition surfaces. This let the team iterate fast on hypotheses without sacrificing visual consistency or brand coherence.",
          "I worked closely with growth and marketing — reviewing creatives, aligning UX solutions with the overall product direction, and maintaining quality as the team continuously tested new channels and approaches.",
        ],
      },
      {
        title: 'Femia.health: a web platform designed to attract, educate, and convert',
        afterImageIndex: 8,
        paragraphs: [
          "The mobile app wasn't the only entry point — we designed femia.health as a full acquisition, content, and brand trust channel in its own right.",
          "To drive organic traffic and support conversion, we built a suite of functional tools — pregnancy, IVF, implantation, and hCG calculators — that delivered immediate value to users before they ever downloaded the app. Each tool was designed to guide users naturally into web onboarding or app install.",
          "Combined with the health library and brand content, the website became a meaningful secondary channel — capturing organic traffic and building brand credibility.",
        ],
      },
      {
        title: 'Brand identity & emotional positioning',
        afterImageIndex: 4,
        paragraphs: [
          "I named the product — Femia — and led the development of its full brand identity, from visual language to emotional positioning.",
          "The brief was clear: stand apart from the sea of pink or clinical period trackers and build something women actually want to be seen using.",
          "The result was a warm, modern identity built around real women at every stage of life — diverse, grounded, and quietly confident rather than overly medical or aggressively feminine.",
          "The illustration style and visual tone weren't guesswork — both were validated through user feedback and performance testing, then refined until they became one of the most recognisable parts of the product experience.",
        ],
      },
    ],
  },
  {
    slug: 'femia-content-design-system',
    title: 'Content Design System',
    subtitle: 'Femia · Content Delivery at Scale',
    description: "Femia needed to produce personalised health content every day — across cycle phases, fertility goals, and life stages. I built the content design system that made that possible: a shared visual foundation, templated content formats, and a production workflow that let a distributed team create, review, and publish at scale without losing quality.",
    role: 'Product Design Lead',
    year: '2022–2025',
    platforms: ['iOS', 'Android'],
    industry: 'Femtech',
    tags: ['Femtech', 'Design System'],
    figmaNodeId: '2835:28644',
    detailNodeIds: [
      '2820:30363', // Slide 1 — Foundation: warm colour palette
      '2903:29453', // Slide 2 — Foundation: cool colour palette
      '2849:30445', // Slide 3 — Foundation: Typography
      '2912:5057',  // 3.1 — Foundation: Icon set
      '2854:31005', // Slide 4 — Content creation workflow
      '2860:26419', // Slide 5 — Story title templates
      '2863:26580', // Slide 6 — Infographics
      '2895:28710', // Slide 7 — Lists and text blocks
      '2898:42495', // Slide 8 — Daily advice (personalised stories)
      '2904:30461', // Slide 10 — Texts and arts
      '2891:27378', // Slide 9 — Art Library: Objects
      '2896:27700', // Slide 10 — Art Library: Characters
      '2896:29713', // Slide 11 — Art Library: Daily Life
    ],
    category: 'apps',
    accentColor: '#5E71CD',
    accordionSections: [
      {
        title: 'Challenge',
        content: "Producing personalised daily health content for over a million users — across fertility stages, cycle phases, and pregnancy — required more than good writing. Without a shared system, each piece of content became a one-off effort: inconsistent, slow, and hard to review. We needed a scalable foundation that a distributed team could work from without losing visual quality or medical accuracy.",
      },
      {
        title: 'Approach',
        content: "I built the content design system from scratch — starting with a visual foundation of colour, typography, and illustration libraries, then designing a library of content templates covering story titles, infographics, text blocks, daily advice cards, and text-and-art combinations. Alongside the design assets, I defined a production workflow connecting content managers, visual designers, and a review team of medical experts and editors, with publishing into Contentful.",
      },
      {
        title: 'Results',
        content: "Enabled a distributed team to produce personalised daily content at scale for 1.2M+ users — with every story reviewed by medical experts and published consistently across iOS and Android.",
      },
    ],
    textSections: [
      {
        title: 'Visual foundation',
        afterImageIndex: 0,
        paragraphs: [
          "The system started with a shared visual language that every content creator and designer could rely on. The colour system was built as hot-cold paired palettes extending the Femia brand, giving the team a broad but coherent palette to work across different health topics and emotional tones.",
        ],
        items: [
          {
            label: 'Colour system',
            description: 'Paired hot-cold palettes built on the Femia brand — giving every content format its own mood while staying visually unified.',
          },
          {
            label: 'Typography',
            description: 'A type scale designed for both iOS and Android, covering large editorial titles through body text and captions.',
          },
          {
            label: 'Icon set',
            description: 'A comprehensive health icon library covering reproductive health, body topics, wellness, and lifestyle — all in a consistent illustrative style.',
          },
        ],
      },
      {
        title: 'Content creation workflow',
        afterImageIndex: 4,
        paragraphs: [
          "The system wasn't just design assets — it was a production process. Content managers worked from templated wireframes to draft stories. Visual designers used design system components to bring them to life. Every piece then went through a structured review: medical experts checked accuracy, colleagues reviewed tone, and the design lead and content lead signed off before publishing to Contentful.",
          "This workflow meant quality didn't depend on individual effort — it was built into how the system worked.",
        ],
      },
      {
        title: 'Content templates',
        afterImageIndex: 5,
        paragraphs: [
          "The core of the system was a library of content templates — each designed for a specific format and purpose. Together they covered the full range of content Femia delivered to users every day.",
        ],
        items: [
          {
            label: 'Story title templates',
            description: "Various opening formats to hook readers at the start — from editorial headlines to question-based hooks and data-led intros.",
          },
          {
            label: 'Infographics',
            description: 'Data visualisation templates for presenting health statistics in a clear, visually engaging way without requiring custom design each time.',
          },
          {
            label: 'Lists and text blocks',
            description: "Structured tip formats — Do/Don't lists, numbered advice, and text blocks — for delivering practical health guidance in easy-to-scan layouts.",
          },
          {
            label: 'Daily advice cards',
            description: 'Personalised story formats driven by user cycle data — triggered by cycle day, symptoms, or fertility stage to feel relevant every time.',
          },
          {
            label: 'Text and art',
            description: 'Templates that combine editorial copy with illustration — for stories where visuals carry meaning alongside the words.',
          },
        ],
      },
      {
        title: 'Art library',
        afterImageIndex: 10,
        paragraphs: [
          "To support the content system, I built a dedicated art library of object illustrations covering health topics, lifestyle, food, body, and wellness. These assets gave the content team a shared visual vocabulary — so any story could be illustrated quickly without starting from scratch, while staying consistent with the Femia visual identity.",
        ],
      },
    ],
  },
  {
    slug: 'femia-wrapped',
    title: 'Femia Wrapped',
    subtitle: 'Femia · Year in Review',
    description: "Designed a Spotify Wrapped-style year-in-review experience for Femia users — turning a year of personal health data into a shareable, emotional recap. The feature surfaced cycle patterns, fertility milestones, and health habits in a way that felt personal, celebratory, and distinctly Femia.",
    role: 'Product Design Lead',
    year: '2023',
    platforms: ['iOS', 'Android'],
    industry: 'Femtech',
    tags: ['Femtech', 'Feature Design'],
    figmaNodeId: '3013:31570',
    detailNodeIds: [
      '3013:31570', // Title — Your 2023 with Femia
      '3013:28012', // Slide 1 — Screens overview
      '3035:30693', // Slide 2
      '3036:32182', // Slide 3
      '3036:32895', // Slide 4
      '3062:50527', // Slide 5
    ],
    mobileMappings: {
      '3013:28012': ['3064:26819', '3064:27498'],
      '3035:30693': ['3073:30442', '3073:30801'],
      '3036:32182': ['3073:31952', '3073:32029'],
      '3036:32895': ['3073:32822', '3073:32926'],
      '3062:50527': ['3073:33365', '3073:33446'],
    },
    category: 'apps',
    accentColor: '#5E71CD',
    accordionSections: [
      {
        title: 'Challenge',
        content: "Health data is deeply personal — a year-in-review had to feel meaningful and celebratory, not clinical. The feature needed to surface cycle patterns, fertility milestones, and health habits in a way that resonated emotionally without oversimplifying sensitive information.",
      },
      {
        title: 'Approach',
        content: "Designed a story-driven format that revealed personal insights one at a time — each screen a moment of recognition. The visual language borrowed from Femia's brand identity: warm, expressive, and distinctly not generic. Interactions were designed to feel rewarding and shareable.",
      },
      {
        title: 'Results',
        content: "Launched as a seasonal feature for 1.2M+ users · High share rates · Strong engagement across the recap flow",
      },
    ],
    textSections: [],
  },
  {
    slug: 'femia-brand',
    title: 'Femia Brand Identity',
    subtitle: 'Femia · Brand Guidelines',
    description: "I named the product and built the full brand identity from scratch — visual language, design principles, tone of voice, and a complete illustration system. The brief was to create something women would genuinely want to be seen using: warm, modern, and distinctly not another pink period tracker.",
    role: 'Brand & Product Design Lead',
    year: '2022',
    platforms: ['iOS', 'Android', 'Web'],
    industry: 'Femtech',
    tags: ['Femtech', 'Branding'],
    figmaNodeId: '2949:30834',
    detailNodeIds: [
      '2949:31875', // Mission
      '2949:31890', // Values — Life-time value
      '2949:31922', // Values — 2
      '2949:31949', // Values — 3
      '2949:31960', // Values — 4
      '2949:31974', // Values — 5
      '2949:31728', // Who is she — 1

      '2949:31170', // Design Principles — 1
      '2949:31212', // Design Principles — 2
      '2949:31380', // Design Principles — 3
      '2949:31390', // Design Principles — 4
      '2949:31199', // Tone of Voice — intro
      '2949:31281', // Tone of Voice — definition
      '2949:31316', // Tone of Voice — UX influence
      '2949:31324', // Tone of Voice — 3
      '2949:31332', // Tone of Voice — 4
      '2949:31349', // Tone of Voice — Do's
      '2949:31357', // Tone of Voice — 6
      '2949:31612', // Logo — naming & concept
      '2949:31623', // Logo — usage on backgrounds
      '2949:31136', // Colors — palette overview
      '2949:30888', // Colors — primary
      '2949:31021', // Colors — secondary
      '2949:31400', // Fonts
      '2949:31634', // Brand Elements — Graphics
      '2949:31757', // Brand Elements — Graphics composition
      '2949:30250', // Illustrations
      '2949:30243', // Photos — People
      '2949:30236', // Photos — 2
      '2949:30817', // Photos — Relationship and Pregnancy
      '2949:30652', // Infographic
      '2949:30583', // Infographic — 2
      '2949:28327', // In use — Photo guidelines
      '2949:29595', // Infographic — 3
      '2949:29608', // Infographic — 4
      '2949:29623', // Infographic — 5
      '2949:29636', // Infographic — 6
      '2949:29649', // Infographic — 7
      '2949:29662', // Infographic — 8
      '2949:29774', // Infographic — 9
      '2949:30161', // Infographic — 10
      '2949:29878', // Infographic — 11
      '2949:28485', // Infographic — 12
      '2949:28967', // Infographic — 13
      '2949:29441', // Infographic — 14
      '2949:28342', // In use — Text and Picture
      '1346:1837',
      '1342:1641',
      '1342:1941',
      '1346:1640',
      '1346:1670',
      '1346:1696',
      '1346:1751',
      '1346:1785',
      '1346:1812',
    ],
    category: 'apps',
    accentColor: '#4C61C7',
    accordionSections: [
      {
        title: 'Challenge',
        content: "Women's health apps tend to fall into two traps: overly clinical or aggressively pink. Femia needed a brand that felt warm and trustworthy without leaning on either. The identity had to work across a product built for real life — fertility, pregnancy, postpartum — and appeal to women who don't see themselves in the usual femtech aesthetic.",
      },
      {
        title: 'Approach',
        content: "Started from the name — Femia combines 'Fem' (female) and 'Mia' (mine), making it both universal and personal. Built the full brand system from scratch: mission and values framework, user persona, design principles, tone of voice, logo, colour palette, typography, graphic elements, illustration style, and photography guidelines. Every decision was made to feel approachable without being soft, and confident without being clinical.",
      },
      {
        title: 'Results',
        content: "A brand system adopted across iOS, Android, and Web — used as the foundation for the full product design system, all marketing materials, and the App Store presence. The illustration style and visual tone were validated through user feedback and became one of the most recognisable parts of the product.",
      },
    ],
    textSections: [
      {
        title: 'Brand foundation',
        afterImageIndex: 0,
        paragraphs: [
          "The brand started with a clear mission: improve women's health and wellbeing through accessible technology. Everything else — visual identity, tone, illustration style — was built to serve that intent.",
          "The target user isn't an abstract demographic. She's active, curious, health-aware, and expects a product that understands her without talking down to her. That profile shaped every design decision from colour to copy.",
        ],
      },
      {
        title: 'Values & design principles',
        afterImageIndex: 3,
        paragraphs: [
          "The brand values centre on life-time companionship — empowering women to take control of their health at every stage of life, not just at a single moment.",
          "The design principles reflect this: simple, intuitive, friendly, trustworthy, and universal. The language had to be warm and caring while remaining expert and calm — never preachy, never patronising.",
        ],
      },
      {
        title: 'Logo & colour system',
        afterImageIndex: 6,
        paragraphs: [
          "The logo is deliberately minimal — a clean wordmark that works at any size and on any background. Simple text logo for maximum recognition and communication clarity.",
          "The colour palette is built around Bottichelli (a warm periwinkle blue) as the primary brand colour, paired with Carnation for warmth, and supported by secondary palettes — Smoothie, Aqua, and Angel — that give the content system its tonal range.",
        ],
      },
      {
        title: 'Brand elements & illustration',
        afterImageIndex: 11,
        paragraphs: [
          "A set of organic graphic elements — circles, leaves, drops, rings, seeds — forms the visual texture of the brand. These shapes appear across the product, content, and marketing, giving Femia a recognisable decorative language that feels natural rather than geometric.",
          "The illustration style was designed to represent real women across life stages and ethnicities — diverse, grounded, and never idealised. Photography guidelines reinforce the same approach: authentic, natural, un-posed people in real life.",
        ],
      },
    ],
  },
  {
    slug: 'tongo',
    title: 'Tongo',
    subtitle: 'English Learning App',
    description: "Tongo is an English learning app built for daily language practice and long-term engagement — in a market where most users quit within a week. I joined at an early stage and led the product from concept to growth, designing every core learning flow, gamification system, and monetisation surface from scratch while leading a team of designers.",
    role: 'Product Design Lead',
    year: '2020–2021',
    users: '3M+',
    platforms: ['iOS', 'Android', 'Web'],
    industry: 'Edtech',
    tags: ['Edtech', 'Education'],
    figmaNodeId: '2578:21742',
    detailNodeIds: [
      '12:9861',   // Case 2.2
      '12:21256',  // Case 2.6
      '13:1485',   // Case 2.4 — Tongo World ecosystem
      '2329:10820',// Case 2.8
      '2361:11271',// Case 2.9
    ],
    mobileMappings: {
      '12:9861':  ['2605:23074', '2605:24634'],  // Case 2.2 → mobile frames
      '12:21256': ['2605:26198', '2605:26721'],  // Case 2.6 → mobile frames
    },
    category: 'apps',
    accentColor: '#9333EA',
    textSections: [
      {
        title: 'Learning experience & core mechanics',
        afterImageIndex: 0,
        paragraphs: [
          "Together, these systems created a learning environment where every session offered something different — keeping users engaged.",
        ],
        items: [
          {
            label: 'Structured courses',
            description: 'Step-by-step learning paths that combine vocabulary, grammar, and practical usage.',
          },
          {
            label: 'Dialogue-based learning',
            description: "Chat-style interactive dialogues with Tongo and the world's characters, simulating real conversations users would actually have.",
          },
          {
            label: 'Flashcards & vocabulary',
            description: 'A flexible vocabulary system — flashcards, personal dictionary, and a daily "word of the day" — designed to build habits around small, repeatable actions.',
          },
          {
            label: 'Reading & comprehension',
            description: 'A library of free books with instant in-line translation and audio pronunciation.',
          },
          {
            label: 'Gamified exercises',
            description: 'Word matching, phrase assembly, and multiple choice — mechanics designed to make repetition feel like play.',
          },
        ],
      },
      {
        title: 'Product concept, naming & Tongo World',
        afterImageIndex: 1,
        paragraphs: [
          "I named the product Tongo — a playful remix of \"Tongue,\" reflecting the idea of language as a living, everyday skill rather than something you study and forget.",
          "To make learning emotionally memorable, I created the central character: Tongo, an English-speaking corgi who became the product's guide, mascot, and tone of voice all in one.",
          "But one character wasn't enough. I developed the concept of Tongo World — a diverse cast of characters, each from a different country and profession, that Tongo interacts with across lessons.",
          "This grounded every exercise in a real-life scenario and a real conversation — making practice feel like meeting people, not drilling grammar.",
          "The world-building wasn't decorative. It was the engine that made the content system scalable, culturally inclusive, and genuinely fun.",
        ],
      },
      {
        title: 'Design system & visual ecosystem',
        afterImageIndex: 3,
        paragraphs: [
          "Together with the design team, I built and evolved a multi-platform design system that kept the experience consistent and cohesive across iOS, Android, and Web.",
        ],
        items: [
          {
            label: 'Core design system',
            description: 'A unified component library used across mobile and web, with adaptive themes to support different usage contexts and improve visual comfort.',
          },
          {
            label: 'Tongo World character library',
            description: 'A structured library of characters and visual assets that powered storytelling, lessons, and gamified interactions throughout the product.',
          },
          {
            label: 'Reading & content visuals',
            description: 'A dedicated library of illustrations and book covers that gave the reading experience its own distinct visual identity.',
          },
        ],
      },
    ],
    accordionSections: [
      {
        title: 'Challenge',
        content: "The core challenge was turning language learning into a habit users actually wanted to keep. The app had to build genuine habits through short, rewarding sessions while making vocabulary progress feel visible. With millions of users, small friction points in the UX translated into significant churn.",
      },
      {
        title: 'Approach',
        content: "From the beginning, we made a deliberate choice: learning should feel fun, interactive, and genuinely engaging — not like homework. I named the product, created Tongo — an English-speaking corgi mascot who became the product's guide and tone of voice — and developed Tongo World, a cast of characters from different countries and professions that made every lesson feel like a real conversation. I led a small design team — two product designers and a motion designer — defined the UX strategy, and worked closely with product and development to build a scalable experience. Designed the full learning architecture from zero: vocabulary modules, story-based reading flows, dialogue-based exercises, and a progression system that gave users a sense of momentum every session. Shipped a redesigned gamification layer with streaks and rewards, and shaped the subscription paywall and overall monetisation strategy.",
      },
      {
        title: 'Results',
        content: "3M+ users · iOS, Android & Web · Led a team of 2 designers",
      },
    ],
  },
  {
    slug: 'groovy-loops',
    title: 'Groovy Loops',
    subtitle: 'Beat Maker',
    description: "Took full ownership from concept to launch — naming, branding, UI system, motion design, and App Store go-to-market, all solo.",
    role: 'Product Design Lead',
    year: '2020',
    platforms: ['iOS'],
    industry: 'Music',
    tags: ['Music', 'Entertainment'],
    figmaNodeId: '2578:27098',
    detailNodeIds: [
      '10:3',      // Cases 3.2
      '12:28704',  // Cases 3.3
      '13:7439',   // Cases 3.4
      '2329:8408', // Cases 3.5
    ],
    category: 'apps',
    accentColor: '#2D0A5E',
    textSections: [
      {
        title: 'Core experience & creative mechanics',
        afterImageIndex: 0,
        paragraphs: [
          "Every design decision was built around one idea: make music creation feel like play, not production. The interface had to remove every barrier between a first tap and a finished beat.",
        ],
        items: [
          {
            label: 'Beat grid',
            description: 'A visual, tap-based sequencer that lets users build rhythms intuitively — no musical knowledge required.',
          },
          {
            label: 'Curated soundpacks',
            description: 'Original instrument kits across genres, giving users creative variety while keeping choices focused and non-overwhelming.',
          },
          {
            label: 'Real-time effects',
            description: 'Instant audio manipulation — filters, reverb, tempo — so every session feels like experimentation, not configuration.',
          },
          {
            label: 'Loop layering',
            description: 'A simple stacking system that turns individual sounds into full compositions, building complexity without adding friction.',
          },
          {
            label: 'Share & export',
            description: 'One-tap sharing that turned personal creations into social content — the mechanic that made the product go viral on YouTube.',
          },
        ],
      },
      {
        title: 'Original soundpacks & visual identity',
        afterImageIndex: 1,
        paragraphs: [
          "Every soundpack in Groovy Loops was original — crafted from scratch by a professional sound producer specifically for the app. No stock samples, no recycled kits. Each pack had its own genre, mood, and personality, giving users a curated palette that felt premium from the first beat.",
          "To match the quality of the audio, the design team created original cover artwork for every soundpack — each with a distinct visual style that reflected the genre and energy of the sounds inside. The covers became part of the browsing experience, making discovery feel like flipping through a record collection rather than scrolling a list.",
          "The result was a product where sound and visuals were inseparable — every pack felt like a complete creative world to explore.",
        ],
      },
    ],
    accordionSections: [
      {
        title: 'Challenge',
        content: "Music creation tools are intimidating — and most people quit before they make anything. Groovy Loops needed to feel like immersive play from the first tap, not a DAW. The challenge was designing an experience that pulled users in through engagement and gamification, gave them original soundpacks to build with, and made creating feel so effortless they'd keep coming back just to see what they could make next.",
      },
      {
        title: 'Approach',
        content: "Built everything from scratch: name, brand identity, logo, colour system, and the full UI. Designed each core screen — beat grid, instrument selector, effects panel — around instant gratification. Created motion design for transitions and sound feedback, and produced all App Store marketing assets and go-to-market materials.",
      },
      {
        title: 'Results',
        content: "iOS · App Store launch · Users shared their tracks on YouTube, making the product go viral organically.",
      },
    ],
  },
  {
    slug: 'amazing-piano',
    title: 'Amazing Piano',
    subtitle: 'Piano Learning App',
    description: "Owned the complete product experience — from brand identity and lesson architecture to motion design and monetisation — for a piano learning app built for iPad.",
    role: 'Product Design Lead',
    year: '2020',
    platforms: ['iPad'],
    industry: 'Music Education',
    tags: ['Music', 'Education'],
    figmaNodeId: '2578:27064',
    detailNodeIds: [
      '18:1099', // Cases 3.7
      '204:43',  // Cases 3.8
    ],
    category: 'apps',
    accentColor: '#111827',
    textSections: [
      {
        title: 'Learning system & core mechanics',
        afterImageIndex: 0,
        paragraphs: [
          "The product was designed to take someone who had never touched a piano and guide them to playing real songs — with every mechanic built around making progress feel immediate and visible.",
        ],
        items: [
          {
            label: 'Guided note system',
            description: 'Animated falling notes with real-time finger placement feedback, turning sheet music into an intuitive visual language.',
          },
          {
            label: 'Progressive song library',
            description: 'Songs structured by difficulty — from single-hand melodies to full arrangements — so users always have the right challenge.',
          },
          {
            label: 'Lesson architecture',
            description: 'Bite-sized lessons that teach technique through playing, not theory — keeping sessions short enough to repeat and rewarding enough to finish.',
          },
          {
            label: 'Practice streaks & rewards',
            description: 'A gamification layer that turned daily practice into a habit loop, rewarding consistency over perfection.',
          },
        ],
      },
    ],
    accordionSections: [
      {
        title: 'Challenge',
        content: "Most piano apps assume some prior knowledge. Amazing Piano needed to meet complete beginners at first touch and carry them to playing real songs — without overwhelming them or losing them after the opening session.",
      },
      {
        title: 'Approach',
        content: "Designed the full lesson and progression system: animated note guides, finger placement feedback, a song library structured by difficulty, and a gamification layer that rewarded consistency. Owned the visual identity and motion design end-to-end, and shaped the monetisation flow to convert engaged beginners into subscribers.",
      },
    ],
  },
  {
    slug: 'better-sleep',
    title: 'Better Sleep',
    subtitle: 'Sleep & Wellness App',
    description: "Designed a multi-tool sleep companion end-to-end — snore tracking, sleep sounds, smart alarm, and guided wind-down animations — wrapped in a visual identity calm enough to open every night.",
    role: 'Product Design Lead',
    year: '2019',
    platforms: ['iOS', 'Android'],
    industry: 'Health',
    tags: ['Health', 'Wellness'],
    figmaNodeId: '2583:17345',
    detailNodeIds: [
      '7:199', // Cases 3.10
    ],
    mobileMappings: {
      '7:199': ['2615:29906', '2617:29943'],  // Cases 3.10 → mobile frames
    },
    category: 'apps',
    accentColor: '#3B4FCD',
    textSections: [
      {
        title: 'Core tools & sleep mechanics',
        afterImageIndex: 0,
        paragraphs: [
          "Five distinct tools had to feel like one calm, unified experience. Each feature was designed to serve a different moment in the sleep cycle — from winding down to waking up — without ever breaking the nighttime atmosphere.",
        ],
        items: [
          {
            label: 'Snore tracking',
            description: 'Overnight audio recording with morning reports — giving users insight into sleep quality they can actually act on.',
          },
          {
            label: 'Sleep sounds',
            description: 'A curated library of ambient soundscapes with mixing controls, designed to help users build a personal wind-down ritual.',
          },
          {
            label: 'Smart alarm',
            description: 'A wake-up system that detects light sleep phases and triggers gently — so mornings feel less abrupt.',
          },
          {
            label: 'Guided wind-down animations',
            description: 'Breathing exercises and visual meditations that ease the transition from screen time to sleep.',
          },
          {
            label: 'Weekly sleep insights',
            description: 'Aggregated reports that surface patterns over time, turning nightly data into long-term awareness.',
          },
        ],
      },
    ],
    accordionSections: [
      {
        title: 'Challenge',
        content: "The challenge was designing a multi-tool sleep companion that felt cohesive, not cluttered. Better Sleep needed to bring together snore tracking, sleep sounds, a smart alarm, and guided animations into a single experience users would trust to open every night — without overwhelming them or feeling like five apps duct-taped together.",
      },
      {
        title: 'Approach',
        content: "Owned every design surface: snore tracker, sleep sounds player, smart alarm, guided wind-down animations, and weekly sleep insight reports. Built a cohesive visual identity with a calm, premium tone. Designed motion for transitions and ambient animations, and created all App Store marketing materials.",
      },
    ],
  },
  {
    slug: 'plamfy',
    title: 'Plamfy',
    subtitle: 'Live Streaming Platform',
    description: 'Consumer live streaming platform — built 0 to 1. Owned brand identity, visual language, design system, and all product screens for the first launch. Covers live streaming with real-time chat and virtual gifts, creator profiles, a coin economy, and leaderboards.',
    role: 'Design Lead',
    year: '2021',
    platforms: ['Web', 'Mobile Web'],
    industry: 'Entertainment',
    tags: ['Consumer', 'Streaming', 'Design System'],
    category: 'apps',
    figmaNodeId: '3154:23871',
    detailNodeIds: [
      '3159:55377', // Core product experience
      '3161:60929', // Stream watchers view
      '3161:67294', // Main page web + mobile
      '3161:73338', // Navigation
      '3161:76201', // Chat web + mobile
      '3165:19710', // Design system components
      '3195:24312',
      '3165:26262', // Design system components 2
      '3196:21807',
    ],
    accentColor: '#1B8FFF',
    accordionSections: [],
    textSections: [],
  },
  {
    slug: 'lily-plant',
    title: 'Lily Plant',
    subtitle: 'Plant Identifier',
    description: "Named, branded, and designed entirely from scratch — including the mascot character that became the heart of the product's identity.",
    role: 'Brand & Product Designer',
    year: '2021',
    platforms: ['iOS'],
    industry: 'Lifestyle',
    tags: ['AI', 'Lifestyle'],
    figmaNodeId: '2578:27136',
    detailNodeIds: [
      '2356:7298', // Cases 3.11 detail
    ],
    category: 'apps',
    accentColor: '#7C3AED',
    textSections: [
      {
        title: 'Brand identity & core experience',
        afterImageIndex: 0,
        paragraphs: [
          "The product needed to go beyond scan-and-identify. Every touchpoint was designed to feel personal and warm — turning a utility into a companion users would reach for out of curiosity, not just necessity.",
        ],
        items: [
          {
            label: 'Instant plant scan',
            description: 'A camera-first flow that delivers identification in seconds — no menus, no setup, just point and discover.',
          },
          {
            label: 'Plant profiles & care guides',
            description: 'Rich detail pages with watering schedules, sunlight needs, and care tips — giving every scan lasting practical value.',
          },
          {
            label: 'Lily mascot',
            description: 'A character that guides, reacts, and adds personality to every interaction — turning a technical tool into something that feels alive.',
          },
          {
            label: 'Personal collection',
            description: 'A garden-like library of scanned plants that grows with the user, creating a sense of progress and ownership.',
          },
        ],
      },
    ],
    accordionSections: [
      {
        title: 'Challenge',
        content: "Plant identification is a solved technical problem — but building an app people love requires personality. Lily needed a brand that felt warm and trustworthy, turning a utility into something delightful. The mascot had to carry the app's voice and make every scan feel like a discovery.",
      },
      {
        title: 'Approach',
        content: "Created the name, visual identity, mascot character, and complete UI system. Designed every screen around the core flow — instant scan, plant profile, care guide — with the mascot providing guidance and personality throughout. Built all marketing assets and App Store materials from the same creative direction.",
      },
    ],
  },
  {
    slug: 'navigator',
    title: 'Navigator',
    subtitle: 'Risk Monitoring Dashboard · European Bank',
    description: "B2B risk monitoring dashboard for trading desks at a major European bank. Designed to make dense regulatory data legible and actionable — combining a radial risk visualisation with detailed drill-down views across desks, regions, and compliance metrics.",
    role: 'Product Designer',
    year: '2015',
    platforms: ['Web', 'iPad'],
    industry: 'Financial Services',
    tags: ['B2B', 'Enterprise', 'Data Visualisation'],
    category: 'dashboards',
    figmaNodeId: '3078:27423',
    detailNodeIds: [
      '3079:29231', // Navigator 6
      '3078:28329', // Navigator 1
      '3078:28334', // Navigator 2
      '3078:28322', // Navigator 3
      '3078:28315', // Navigator 4
      '3078:28298', // Navigator 5
    ],
    accentColor: '#1B6FBF',
    accordionSections: [],
    textSections: [],
  },
  {
    slug: 'immotrack',
    title: 'Immo Track',
    subtitle: 'Facility Management Dashboard',
    description: 'Joined an outsourcing engagement to design the core dashboard and several features for a B2B SaaS platform that helps facility service companies digitise their operations — coordinating field workers, tracking task delays, monitoring locations, and documenting job completion across multiple properties.',
    role: 'UX Designer',
    year: '2021',
    platforms: ['Web'],
    industry: 'Facility Management',
    tags: ['B2B', 'SaaS', 'Facility Management'],
    category: 'dashboards',
    figmaNodeId: '3080:29457',
    detailNodeIds: [
      '3090:32640', // Dashboard – Timeline view
      '3090:33646', // Dashboard – Board view
      '3090:34906', // Forecast Settings modal
      '3080:29457', // Map view
      '3090:36677', // Tasks table
    ],
    accentColor: '#2080FF',
    cardBorder: '1px solid #E5E5E5',
    accordionSections: [],
    textSections: [],
  },
  {
    slug: 'immotrack-route-planner',
    title: 'Route Planner',
    subtitle: 'Facility Management · Immo Track',
    description: 'Joined the Immo Track product family to design a route planning tool for facility service companies — 0 to 1, from approved proof of concept to shipped MVP. The feature lets managers build optimised weekly routes across workers, locations, and tasks — then visualise assignments on a map or calendar view.',
    role: 'UX Designer',
    year: '2021',
    platforms: ['Web'],
    industry: 'Facility Management',
    tags: ['B2B', 'SaaS', 'Route Planning'],
    category: 'dashboards',
    figmaNodeId: '3091:37620',
    detailNodeIds: [
      '3095:41450', // Step 1 – Choose Workers
      '3095:42317', // Step 2 – Choose Locations
      '3095:42601', // Step 3 – Choose Tasks
      '3095:42852', // Step 4 – Create Route Plan
      '3094:39076', // Step 4.1 – Processing
      '3091:37620', // Map view
      '3094:39698', // Calendar view
      '3094:40502', // Timeline / Gantt
      '3094:39878', // Map + calendar
      '3094:40056', // Calendar (week)
      '3105:29625', // Sign-up
    ],
    accentColor: '#2080FF',
    cardBorder: '1px solid #E5E5E5',
    accordionSections: [],
    textSections: [],
  },
]
