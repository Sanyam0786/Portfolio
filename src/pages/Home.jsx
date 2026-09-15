import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import Experience from '../components/Experience'
import Education from '../components/Education'
import FreelanceBanner from '../components/FreelanceBanner'
import Footer from '../components/Footer'
import ScrollIndicator from '../components/ScrollIndicator'
import SkillsSection from '../components/SkillSection'
import ContactModal from '../components/ContactModal'

export default function Home(){
  const [contactOpen, setContactOpen] = useState(false)
  return (
    <div>
      <Navbar onContactOpen={() => setContactOpen(true)} />
      <main className="pt-24">
        <Hero onContactOpen={() => setContactOpen(true)} />
        <SkillsSection/>
        <ProjectsSection />
        <Experience />
        <FreelanceBanner />
        <Education />
        <Footer />
      </main>
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  )
}
