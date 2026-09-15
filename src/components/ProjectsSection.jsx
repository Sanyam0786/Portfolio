import React from 'react'
import { projects } from '../../data/projects'
import ProjectCard from './ProjectCard'
import { motion } from 'framer-motion'

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2,0.9,0.2,1] } }
}

const subtitleVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } }
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2,0.9,0.2,1] } }
}

export default function ProjectsSection(){
  return (
    <section className="py-20" aria-label="projects" id="projects">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={titleVariants} className="section-title heading-gradient">Selected Projects</motion.h2>
          <motion.div className="fancy-underline mt-3" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ transformOrigin: 'left' }}/>
        </div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={containerVariants}>
          {projects.map((p) => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}