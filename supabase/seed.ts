// Quick database seeder script to populate Supabase with current local data
// Run with: npx tsx --env-file=.env supabase/seed.ts

// Mock asset imports for Node environment
const mockExtension = (module: any, filename: string) => {
  const rel = filename.replace(/.*\/src\/assets\//, '/src/assets/')
  module.exports = rel
}
require.extensions['.png'] = mockExtension
require.extensions['.jpg'] = mockExtension
require.extensions['.webp'] = mockExtension
require.extensions['.svg'] = mockExtension

import { createClient } from '@supabase/supabase-js'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { experience } from '../data/experience'
import { education } from '../data/education'
import { contact } from '../data/contact'
import { featuresSentences } from '../data/home'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY in your environment or .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding portfolio data to Supabase...')

  // 1. Seed Profile
  const { error: profileErr } = await supabase.from('profile').upsert({
    name: contact.name,
    role: contact.role,
    email: contact.email,
    linkedin: contact.linkedin,
    whatsapp: contact.whatsapp,
    github: contact.github,
    formspree: contact.formspree,
    hero_sentences: featuresSentences,
  })
  if (profileErr) console.error('Error seeding profile:', profileErr.message)
  else console.log('✓ Profile seeded')

  // 2. Seed Skills
  const formattedSkills = skills.map((s, index) => ({
    name: s.name,
    icon: typeof s.icon === 'string' ? s.icon : '',
    level: s.level,
    display_order: index,
  }))
  const { error: skillsErr } = await supabase.from('skills').upsert(formattedSkills, { onConflict: 'name' })
  if (skillsErr) console.error('Error seeding skills:', skillsErr.message)
  else console.log('✓ Skills seeded')

  // 3. Seed Projects
  const formattedProjects = projects.map((p, index) => ({
    id: p.id,
    title: p.title,
    role: p.role,
    description: p.description,
    tags: p.tags,
    cover_image: p.coverImage,
    screenshots: p.screenshots,
    demo: p.demo,
    highlights: p.highlights,
    features: p.features,
    challenges: p.challenges,
    impact: p.impact,
    github: p.github,
    display_order: index,
    is_published: true,
  }))
  const { error: projectsErr } = await supabase.from('projects').upsert(formattedProjects, { onConflict: 'id' })
  if (projectsErr) console.error('Error seeding projects:', projectsErr.message)
  else console.log('✓ Projects seeded')

  // 4. Seed Experience
  const formattedExperience = experience.map((e, index) => ({
    company: e.company,
    role: e.role,
    period: e.period,
    impact: e.impact,
    display_order: index,
  }))
  const { error: expErr } = await supabase.from('experience').insert(formattedExperience)
  if (expErr) console.error('Error seeding experience:', expErr.message)
  else console.log('✓ Experience seeded')

  // 5. Seed Education
  const formattedEducation = education.map((ed, index) => ({
    school: ed.school,
    degree: ed.degree,
    period: ed.period,
    notes: ed.notes,
    display_order: index,
  }))
  const { error: eduErr } = await supabase.from('education').insert(formattedEducation)
  if (eduErr) console.error('Error seeding education:', eduErr.message)
  else console.log('✓ Education seeded')

  console.log('Done seeding!')
}

seed()
