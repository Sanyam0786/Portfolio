import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { projects } from '../../data/projects'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Zap, Calendar, ExternalLink } from 'lucide-react'
import { FiGithub } from 'react-icons/fi'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] } }
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project not found</h2>
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>
      </div>
    </div>
  )

  // Separate cover image from screenshots
  // Convention: images[0] = cover (portrait/landscape), images[1..] = mobile screenshots
  const coverImage = project.coverImage || (project.images && project.images[0])
  const screenshots = project.screenshots || (project.images && project.images.length > 1 ? project.images.slice(1) : [])
  const hasAnyLinks = Boolean(
    project.demo?.web ||
    project.demo?.store?.ios ||
    project.demo?.store?.android ||
    project.github
  )

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Navigation */}
      <motion.div
        variants={itemVariants}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <motion.div
            whileHover={{ x: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowLeft size={18} />
          </motion.div>
          <span>Back to Portfolio</span>
        </Link>
      </motion.div>

      {/* Hero Section — cover photo if available, else gradient */}
      <motion.div
        variants={itemVariants}
        className="max-w-6xl mx-auto px-6 mb-20"
      >
        {coverImage ? (
          <div className="rounded-2xl overflow-hidden shadow-lg relative">
            <img
              src={coverImage}
              alt={`${project.title} cover`}
              className="w-full object-cover max-h-[480px]"
            />
            {/* Overlay with title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-10 sm:p-14">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-3 text-white">
                  {project.title}
                </h1>
                <p className="text-lg text-white/85 max-w-2xl">
                  {project.description}
                </p>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className={`rounded-2xl overflow-hidden ${project.coverColor} p-12 sm:p-16 text-white shadow-lg`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
                {project.title}
              </h1>
              <p className="text-lg opacity-90 max-w-2xl">
                {project.description}
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6 space-y-12 pb-20"
      >

        {/* Overview Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Role Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <Users className="text-slate-600 mt-1" size={20} />
              <h3 className="font-semibold text-slate-900">Role</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{project.role}</p>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <Zap className="text-slate-600 mt-1" size={20} />
              <h3 className="font-semibold text-slate-900">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-white text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50 rounded-xl p-6 border border-slate-200"
          >
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="text-slate-600 mt-1" size={20} />
              <h3 className="font-semibold text-slate-900">Status</h3>
            </div>
            <p className="text-slate-600 text-sm">
              {project.demo?.available ? (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Available
                </span>
              ) : (
                <span className="text-slate-500">Completed</span>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* ── Mobile Screenshots Gallery ── */}
        {screenshots.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 ">App Screenshots</h2>

            {/* Horizontally scrollable row of phone frames */}
            <div className="overflow-x-auto pb-4 -mx-6 px-6 pt-10">
              <div className="flex gap-5 w-max">
                {screenshots.map((src, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="flex-shrink-0"
                  >
                    {/* Phone frame */}
                    <div className="relative w-[160px] sm:w-[190px]">
                      {/* Outer shell */}
                      <div className="rounded-[2.4rem] border-[6px] border-slate-800 bg-slate-800 shadow-2xl overflow-hidden">
                        {/* Notch */}
                        <div className="relative bg-slate-800 flex justify-center pt-2 pb-1">
                          <div className="w-16 h-4 bg-slate-900 rounded-full" />
                        </div>
                        {/* Screen */}
                        <div className="bg-black overflow-hidden" style={{ borderRadius: '0 0 1.6rem 1.6rem' }}>
                          <img
                            src={src}
                            alt={`Screenshot ${idx + 1}`}
                            className="w-full object-cover"
                            style={{ aspectRatio: '9/19.5' }}
                          />
                        </div>
                      </div>
                      {/* Home bar pill */}
                      <div className="mx-auto mt-2 w-10 h-1 bg-slate-300 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Highlights Section */}
        {project.highlights && project.highlights.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.highlights.map((highlight, idx) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-3 items-start p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {project.features && project.features.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Core Features</h2>
            <div className="space-y-3">
              {project.features.map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <p className="text-slate-700">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Challenges & Solutions */}
        {project.challenges && project.challenges.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Challenges & Solutions</h2>
            <div className="space-y-4">
              {project.challenges.map((challenge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Challenge</h4>
                    <p className="text-red-800 text-sm">{challenge.problem}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="font-semibold text-emerald-900 mb-2">Solution</h4>
                    <p className="text-emerald-800 text-sm">{challenge.solution}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Demo & Links Section */}
        {hasAnyLinks && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore Project</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.demo?.web && (
              <motion.a
                href={project.demo.web}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors group"
              >
                <ExternalLink size={20} />
                <div>
                  <p className="font-semibold">Live Demo</p>
                  <p className="text-sm text-slate-400">View the project online</p>
                </div>
              </motion.a>
            )}

            {/* App Store */}
            {project.demo?.store?.ios && (
              <motion.a
                href={project.demo.store.ios}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors group"
              >
                {/* Apple icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 opacity-90">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.35-2.16 3.99.03 3.16 2.63 4.2 2.66 4.21l-.05.13c-.2.63-.52 1.56-1.2 2.34M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div>
                  <p className="text-xs text-slate-400 leading-none mb-0.5">Download on the</p>
                  <p className="font-semibold text-base leading-tight">App Store</p>
                </div>
              </motion.a>
            )}

            {/* Play Store */}
            {project.demo?.store?.android && (
              <motion.a
                href={project.demo.store.android}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors group"
              >
                {/* Google Play icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 opacity-90">
                  <path d="M3.18 23.76c.3.17.63.24.97.2l.1-.04 11.35-6.55-2.47-2.47-9.95 8.86zM.41 1.2C.16 1.57 0 2.08 0 2.73v18.54c0 .65.16 1.16.41 1.53l.08.08 10.39-10.39v-.24L.49 1.12l-.08.08zM20.13 9.53l-2.54-1.46-2.77 2.77 2.77 2.77 2.56-1.48c.73-.42.73-1.19-.02-1.6zM4.15.28l11.35 6.55-2.47 2.47L3.08.44l.1-.04c.34-.04.67.03.97.2v-.32z"/>
                </svg>
                <div>
                  <p className="text-xs text-slate-400 leading-none mb-0.5">Get it on</p>
                  <p className="font-semibold text-base leading-tight">Google Play</p>
                </div>
              </motion.a>
            )}

            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition-colors"
              >
                <FiGithub size={20} />
                <div>
                  <p className="font-semibold">Source Code</p>
                  <p className="text-sm text-slate-600">View on GitHub</p>
                </div>
              </motion.a>
            )}

            </div>
          </motion.div>
        )}

        {/* Impact Stats */}
        {project.impact && (
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Impact</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.impact.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center"
                >
                  <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects CTA */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Like what you see?</h3>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Check out more of my projects or let's collaborate on something amazing.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              View All Projects
            </Link>
          </motion.div>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}