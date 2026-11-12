import React, { useState } from 'react'
import MonochromeNavbar from '../components/Navbar'
import MonochromeHero from '../components/Hero'
import MonochromeSkillsSection from '../components/SkillSection'
import MonochromeProjectsSection from '../components/ProjectsSection'
import MonochromeExperience from '../components/Experience'
import MonochromeEducation from '../components/Education'
import MonochromeResumeSection from '../components/ResumeSection'
import MonochromeFooter from '../components/Footer'
import ContactModal from '../components/ContactModal'

export default function MonochromeHome(): React.JSX.Element {
  const [contactOpen, setContactOpen] = useState<boolean>(false)

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-zinc-100 selection:text-zinc-950">
      <MonochromeNavbar onContactOpen={() => setContactOpen(true)} />
      <main>
        <MonochromeHero onContactOpen={() => setContactOpen(true)} />
        <MonochromeSkillsSection />
        <MonochromeProjectsSection />
        <MonochromeExperience />
        <MonochromeEducation />
        <MonochromeResumeSection />
      </main>
      <MonochromeFooter />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
