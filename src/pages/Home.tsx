import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import Experience from '../components/Experience'
import Education from '../components/Education'
import ResumeSection from '../components/ResumeSection'
import FreelanceBanner from '../components/FreelanceBanner'
import Footer from '../components/Footer'
import SkillsSection from '../components/SkillSection'
import ContactModal from '../components/ContactModal'
import { usePortfolioData } from '../hooks/usePortfolioData'

export default function Home(): React.JSX.Element {
  const [contactOpen, setContactOpen] = useState<boolean>(false)
  const { projects, skills, experience, education, heroSentences } = usePortfolioData()

  return (
    <div>
      <Navbar onContactOpen={() => setContactOpen(true)} />
      <main className="pt-24">
        <Hero onContactOpen={() => setContactOpen(true)} sentences={heroSentences} />
        <SkillsSection items={skills} />
        <ProjectsSection items={projects} />
        <Experience items={experience} />
        <FreelanceBanner />
        <Education items={education} />
        <ResumeSection />
        <Footer />
      </main>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
