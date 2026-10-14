// Step-by-step Supabase database seeder
// Run with: npx tsx --env-file=.env supabase/step_seed.ts <profile|skills|projects|experience|education>

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const step = process.argv[2]?.toLowerCase()

// 1. Static Profile Data
const staticProfile = {
  name: "Sanyam Mujavadia",
  role: "React & React Native Developer",
  email: "sanyammj786@gmail.com",
  linkedin: "https://www.linkedin.com/in/sanyam-mujavadia-88819328a/",
  whatsapp: "https://wa.me/917861961399",
  github: "https://github.com/Sanyam0786",
  formspree: "https://formspree.io/f/mrbkozgw",
  hero_sentences: [
    "I build delightful mobile experiences.",
    "React Native & performance obsessed.",
    "Crafting polished interactions that users love.",
    "Available for selective remote freelance work."
  ]
}

// 2. Static Skills Data
const staticSkills = [
  { name: "React Native", level: "Expert" },
  { name: "TypeScript", level: "Expert" },
  { name: "JavaScript", level: "Expert" },
  { name: "React.js", level: "Expert" },
  { name: "Tailwind CSS", level: "Expert" },
  { name: "Redux", level: "Expert" },
  { name: "TanStack Query", level: "Expert" },
  { name: "Reanimated", level: "Expert" },
  { name: "Firebase", level: "Expert" },
  { name: "REST APIs", level: "Expert" },
  { name: "Axios", level: "Expert" },
  { name: "Redux Toolkit", level: "Expert" },
  { name: "Supabase", level: "Expert" },
  { name: "RevenueCat", level: "Expert" },
  { name: "Stripe", level: "Expert" },
  { name: "PayPal", level: "Expert" },
  { name: "Git", level: "Expert" },
  { name: "Xcode", level: "Expert" },
  { name: "Android Studio", level: "Expert" }
]

// 3. Static Projects Data
const staticProjects = [
  {
    id: "kyora-iq",
    title: "Kyora IQ",
    role: "React Native Developer",
    description: "A service marketplace app connecting users with cybersecurity and cloud experts, featuring real-time chat, booking workflows, and role-based experiences.",
    tags: ["React Native", "TypeScript", "Firebase", "Realtime", "Dark Mode"],
    cover_image: "/src/assets/projects_image/img_cyberboss.jpg",
    screenshots: [
      "/src/assets/projects_image/img_cyberboss1.jpg",
      "/src/assets/projects_image/img_cyberboss2.jpg",
      "/src/assets/projects_image/img_cyberboss3.jpg",
      "/src/assets/projects_image/img_cyberboss4.jpg",
      "/src/assets/projects_image/img_cyberboss5.jpg"
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/kyora-iq/id6749854798",
        android: "https://play.google.com/store/apps/details?id=com.cyberboss"
      }
    },
    highlights: [
      "Dual-role system (User & Consultant) with separate workflows",
      "Real-time chat using Firebase between users and experts",
      "Service booking flow for cybersecurity and cloud consulting",
      "Full dark mode & light mode theming across the app"
    ],
    features: [
      "Expert discovery and service listing",
      "Booking and scheduling with consultants",
      "Real-time messaging with push updates",
      "Role-based navigation and dashboards",
      "Dark mode / Light mode toggle with persistent theme",
      "User profile and consultant service management"
    ],
    challenges: [
      {
        problem: "Maintaining seamless real-time chat experience with consistent message sync",
        solution: "Integrated Firebase real-time database with optimized listeners and state handling"
      },
      {
        problem: "Designing a flexible UI that supports both dark and light themes across all screens",
        solution: "Implemented centralized theming system with dynamic styles and global state"
      },
      {
        problem: "Handling two distinct user roles with different journeys in a single app",
        solution: "Built role-based navigation stacks and conditional rendering for clean separation"
      }
    ],
    impact: [
      { value: "2 Roles", label: "User & Consultant" },
      { value: "Realtime", label: "Chat System" },
      { value: "End-to-End", label: "Booking Flow" },
      { value: "Dynamic", label: "Theming System" }
    ],
    github: "",
    display_order: 0,
    is_published: true
  },
  {
    id: "gridsun-monitor",
    title: "GridSun Monitor (React Native)",
    role: "React Native Developer",
    description: "A solar installation and maintenance management app enabling real-time lead tracking, installation workflows, and AMC lifecycle management for both employees and customers.",
    tags: ["React Native", "TypeScript", "Barcode Scanner"],
    cover_image: "/src/assets/projects_image/img_gs.webp",
    screenshots: [
      "/src/assets/projects_image/img_gs1.webp",
      "/src/assets/projects_image/img_gs2.webp",
      "/src/assets/projects_image/img_gs3.webp",
      "/src/assets/projects_image/img_gs4.webp",
      "/src/assets/projects_image/img_gs5.webp"
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/in/app/gridsun-monitor/id6760114324",
        android: "https://play.google.com/store/apps/details?id=com.gridsun.monitor"
      }
    },
    highlights: [
      "Pin-code based lead discovery for field employees",
      "Step-based installation workflow with photo uploads",
      "Barcode scanning for solar panels and inverters",
      "AMC tracking with automated reminders & notifications"
    ],
    features: [
      "Lead import and centralized admin management",
      "Real-time photo sync to admin dashboard",
      "Role-based access (User & Employee)",
      "Installation tracking with stage validation"
    ],
    challenges: [
      {
        problem: "Ensuring real-time sync of images and installation data from field locations with poor connectivity",
        solution: "Implemented optimized upload queues with retry mechanisms and background syncing"
      }
    ],
    impact: [
      { value: "2 Roles", label: "User & Employee System" },
      { value: "Real-time", label: "Field Data Sync" },
      { value: "End-to-End", label: "Installation Lifecycle" },
      { value: "Automated", label: "AMC Reminders" }
    ],
    github: "",
    display_order: 1,
    is_published: true
  },
  {
    id: "soulsync",
    title: "SoulSync (React Native)",
    role: "React Native Developer",
    description: "An offline-first personal analytics engine that transforms daily journaling into meaningful behavioral insights using on-device data processing and pattern detection.",
    tags: ["React Native", "TypeScript", "SQLite", "Offline-First", "Analytics"],
    cover_image: "/src/assets/projects_image/img_soulsync.png",
    screenshots: [
      "/src/assets/projects_image/img_soulsync1.png",
      "/src/assets/projects_image/img_soulsync2.png",
      "/src/assets/projects_image/img_soulsync3.png",
      "/src/assets/projects_image/img_soulsync4.png",
      "/src/assets/projects_image/img_soulsync5.png",
      "/src/assets/projects_image/img_soulsync6.png"
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/soulsync-private-journal/id6780445597",
        android: "https://play.google.com/store/apps/details?id=com.soulsyncapp"
      }
    },
    highlights: [
      "Offline-first journaling with complete on-device data privacy",
      "Mood tracking with time-based analytics and trend visualization",
      "Insight engine generating behavioral patterns from user entries"
    ],
    features: [
      "Daily journaling with mood tagging and custom categories",
      "Local database storage using optimized schema design",
      "Streak tracking and consistency monitoring",
      "Fully offline functionality with zero backend dependency"
    ],
    challenges: [
      {
        problem: "Generating meaningful insights without relying on external APIs or AI services",
        solution: "Designed a rule-based analytics engine using statistical patterns and correlation logic computed entirely on-device"
      }
    ],
    impact: [
      { value: "100%", label: "Offline & Private" },
      { value: "Real Insights", label: "Behavior Analysis" },
      { value: "Zero API", label: "Fully Local Processing" }
    ],
    github: "",
    display_order: 2,
    is_published: true
  },
  {
    id: "catchndealz",
    title: "Catchndealz (React Native)",
    role: "React Native Developer",
    description: "A social-first e-commerce platform combining shopping with gamified experiences like live auctions, raffles, and real-time deal interactions.",
    tags: ["React Native", "TypeScript", "Realtime", "Firebase"],
    cover_image: "/src/assets/projects_image/img_catchndealz.jpg",
    screenshots: [
      "/src/assets/projects_image/img_catchndealz1.jpg",
      "/src/assets/projects_image/img_catchndealz2.jpg",
      "/src/assets/projects_image/img_catchndealz3.jpg",
      "/src/assets/projects_image/img_catchndealz4.jpg",
      "/src/assets/projects_image/img_catchndealz5.jpg"
    ],
    demo: {
      store: {
        ios: "https://apps.apple.com/us/app/catchndealz-market/id6471849927",
        android: "https://play.google.com/store/apps/details?id=com.catchndealz"
      }
    },
    highlights: [
      "Live auctions with real-time chat and bidding system",
      "Make-an-offer feature with instant accept/reject updates",
      "Raffle-based (Waffle) system with winner tracking"
    ],
    features: [
      "Real-time deals, auctions, and raffles",
      "Category-based browsing with filters",
      "Add-to-cart and instant buy flow"
    ],
    challenges: [
      {
        problem: "Managing real-time interactions across auctions, chat, and bidding without lag",
        solution: "Optimized state handling and integrated real-time updates using efficient event-driven architecture"
      }
    ],
    impact: [
      { value: "Real-time", label: "User Engagement Boost" },
      { value: "Multi-flow", label: "Commerce System" },
      { value: "High", label: "User Interaction" }
    ],
    github: "",
    display_order: 3,
    is_published: true
  }
]

// 4. Static Experience Data
const staticExperience = [
  {
    company: "Silversky Technology",
    role: "React Native Developer",
    period: "Jul. 2025 — Present",
    impact: "Delivered 5+ production-ready applications on App Store and Play Store, with strong focus on problem-solving and scalable architecture.",
    display_order: 0
  }
]

// 5. Static Education Data
const staticEducation = [
  {
    school: "Silver Oak University",
    degree: "B.Tech Computer Science Engineering",
    period: "2023 — 2027",
    notes: "Focused on coding, software development, and building practical technical skills.",
    display_order: 0
  },
  {
    school: "Sankalp International School",
    degree: "Higher Secondary & Secondary Education",
    period: "2021 — 2023",
    notes: "Completed Secondary School (10th) in 2021 and Higher Secondary School (12th) in 2023.",
    display_order: 1
  }
]

async function runProfile() {
  console.log('Seeding Profile data...')
  const { data: existing } = await supabase.from('profile').select('id').limit(1)

  let error
  if (existing && existing.length > 0) {
    const res = await supabase.from('profile').update(staticProfile).eq('id', existing[0].id)
    error = res.error
  } else {
    const res = await supabase.from('profile').insert(staticProfile)
    error = res.error
  }

  if (error) {
    console.error('Failed to seed profile:', error.message)
    process.exit(1)
  }
  console.log(`✓ Profile successfully populated for "${staticProfile.name}"`)
}

async function runSkills() {
  console.log('Seeding Skills data...')
  await supabase.from('skills').delete().neq('name', '___never_match___')

  const formattedSkills = staticSkills.map((s, index) => ({
    name: s.name,
    icon: '',
    level: s.level,
    display_order: index,
  }))

  const { error } = await supabase.from('skills').insert(formattedSkills)
  if (error) {
    console.error('Failed to seed skills:', error.message)
    process.exit(1)
  }
  console.log(`✓ Skills successfully populated (${formattedSkills.length} skills added)`)
}

async function runProjects() {
  console.log('Seeding Projects data...')
  const { error } = await supabase.from('projects').upsert(staticProjects, { onConflict: 'id' })
  if (error) {
    console.error('Failed to seed projects:', error.message)
    process.exit(1)
  }
  console.log(`✓ Projects successfully populated (${staticProjects.length} projects added)`)
}

async function runExperience() {
  console.log('Seeding Work Experience data...')
  await supabase.from('experience').delete().neq('company', '___never_match___')

  const { error } = await supabase.from('experience').insert(staticExperience)
  if (error) {
    console.error('Failed to seed experience:', error.message)
    process.exit(1)
  }
  console.log(`✓ Work Experience successfully populated (${staticExperience.length} positions added)`)
}

async function runEducation() {
  console.log('Seeding Education data...')
  await supabase.from('education').delete().neq('school', '___never_match___')

  const { error } = await supabase.from('education').insert(staticEducation)
  if (error) {
    console.error('Failed to seed education:', error.message)
    process.exit(1)
  }
  console.log(`✓ Education successfully populated (${staticEducation.length} degrees added)`)
}

async function main() {
  switch (step) {
    case 'profile':
      await runProfile()
      break
    case 'skills':
      await runSkills()
      break
    case 'projects':
      await runProjects()
      break
    case 'experience':
      await runExperience()
      break
    case 'education':
      await runEducation()
      break
    default:
      console.log('Usage: npx tsx --env-file=.env supabase/step_seed.ts <profile|skills|projects|experience|education>')
      process.exit(1)
  }
}

main().catch((err) => {
  console.error('Unhandled seed error:', err)
  process.exit(1)
})
