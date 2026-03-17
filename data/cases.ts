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
  figmaNodeId: string       // cover frame
  detailNodeIds: string[]   // visual screen frames for right column (desktop)
  mobileMappings?: Record<string, string[]>  // desktop nodeId → mobile frame(s) to show instead
  mobileAppendNodeIds?: string[]             // mobile-only frames appended after all desktop frames
  metrics?: string[]
  accentColor: string
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
      '321:11601':  ['2668:23143', '2668:29788'],    // Case 1.8  → mobile frames
      '2322:5732':  ['2595:40106'],                // Case 1.17 → 1.19 mob
    },
    metrics: ['Featured by App Store', '4.9 App Store', '4.6 Google Play', 'Retention M1-60%'],
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
]
