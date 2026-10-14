import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Zap, Calendar, ExternalLink, FolderX, Sun, Moon, Loader2 } from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import ContactModal from '../components/ContactModal'
import { usePortfolioData } from '../hooks/usePortfolioData'

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
  const { projects: allProjects, isLoading } = usePortfolioData()
  const project = allProjects.find(p => p.id === id)
  const { isDark, toggle } = useTheme()
  const [contactOpen, setContactOpen] = useState(false)

  // Dynamically update document title and description for SEO
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Sanyam Mujavadia`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', project.description || `${project.title} — developed by Sanyam Mujavadia.`)
      }
    }
    return () => {
      document.title = 'Sanyam Mujavadia — React Native & Web Developer Portfolio'
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', 'React Native & Frontend Developer specializing in high-performance iOS, Android, and web applications.')
      }
    }
  }, [project])

  if (isLoading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
        className="glass rounded-3xl p-8 sm:p-12 shadow-2xl max-w-md w-full text-center relative overflow-hidden border border-white/50 dark:border-slate-700/60"
      >
        {/* Ambient background glows */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

        {/* Animated 404 Icon Badge */}
        <motion.div
          initial={{ rotate: -12, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto mb-5 text-indigo-600 dark:text-indigo-400 shadow-inner"
        >
          <FolderX className="w-8 h-8" />
        </motion.div>

        {/* 404 pill badge */}
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 mb-3 inline-block tracking-wide">
          404 • Not Found
        </span>

        {/* Heading & Description */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2.5">
          Project Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8 leading-relaxed">
          The project you're looking for doesn't exist or may have been moved.
        </p>

        {/* Designed CTA button with hover effects */}
        <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm shadow-lg hover:shadow-xl dark:hover:bg-white transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )

  // Separate cover image from screenshots
  // Convention: images[0] = cover (portrait/landscape), images[1..] = mobile screenshots
  const coverImage = project.coverImage || (project.images && project.images[0])
  const screenshots = project.screenshots || (project.images && project.images.length > 1 ? project.images.slice(1) : [])
  const store = typeof project.demo?.store === 'object' ? project.demo.store : null
  const iosUrl = store?.ios
  const androidUrl = store?.android
  const hasAnyLinks = Boolean(
    project.demo?.web ||
    iosUrl ||
    androidUrl ||
    project.github
  )

  return (
    <motion.div
      className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300 relative z-10"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Top Floating Glass Navigation */}
      <motion.div
        variants={itemVariants}
        className="max-w-6xl mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-between glass px-5 py-3 rounded-2xl border border-white/60 dark:border-slate-800 shadow-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ArrowLeft size={18} />
            </motion.div>
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/80 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? 'sun' : 'moon'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Let's Talk CTA */}
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setContactOpen(true)}
              className="hidden sm:inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors"
            >
              Let's talk
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Project Hero Header & Cover Showcase */}
      <motion.div
        variants={itemVariants}
        className="max-w-6xl mx-auto px-6 mb-12 sm:mb-16"
      >
        {/* Title & Description Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              {project.role}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Cover Showcase Image */}
        {coverImage ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[16/9] max-h-[540px] w-full"
          >
            <img
              src={coverImage}
              alt={`${project.title} cover preview`}
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
            />
          </motion.div>
        ) : (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 p-8 sm:p-14 text-white shadow-xl border border-slate-800">
            <p className="text-sm font-medium tracking-widest uppercase text-slate-400 mb-2">Project Preview</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">{project.title}</h2>
          </div>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        className="max-w-6xl mx-auto px-6 space-y-12 pb-20"
      >
        {/* Overview Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Role Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50/90 dark:bg-slate-800/70 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <Users className="text-indigo-600 dark:text-indigo-400 mt-1" size={20} />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Role</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{project.role}</p>
          </motion.div>

          {/* Tech Stack Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50/90 dark:bg-slate-800/70 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <Zap className="text-amber-500 dark:text-amber-400 mt-1" size={20} />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Tech Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-white dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Status Card */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="bg-slate-50/90 dark:bg-slate-800/70 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <Calendar className="text-emerald-600 dark:text-emerald-400 mt-1" size={20} />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Status</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {project.demo?.available ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Available
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">Completed</span>
              )}
            </p>
          </motion.div>
        </motion.div>

        {/* ── Mobile Screenshots Gallery ── */}
        {screenshots.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-2">App Screenshots</h2>
            <div className="fancy-underline mb-6" />

            {/* Horizontally scrollable row of phone frames */}
            <div className="overflow-x-auto pb-4 -mx-6 px-6 pt-4">
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
                      <div className="rounded-[2.4rem] border-[6px] border-slate-800 dark:border-slate-700 bg-slate-800 dark:bg-slate-700 shadow-2xl overflow-hidden">
                        {/* Notch */}
                        <div className="relative bg-slate-800 dark:bg-slate-700 flex justify-center pt-2 pb-1">
                          <div className="w-16 h-4 bg-slate-900 dark:bg-slate-900 rounded-full" />
                        </div>
                        {/* Screen */}
                        <div className="bg-black overflow-hidden" style={{ borderRadius: '0 0 1.6rem 1.6rem' }}>
                          <img
                            src={src}
                            alt={`${project.title} app screenshot ${idx + 1}`}
                            className="w-full object-cover"
                            style={{ aspectRatio: '9/19.5' }}
                          />
                        </div>
                      </div>
                      {/* Home bar pill */}
                      <div className="mx-auto mt-2 w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
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
            <h2 className="section-title heading-gradient mb-2">Key Highlights</h2>
            <div className="fancy-underline mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.highlights.map((highlight, idx) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-3 items-start p-4 bg-slate-50/90 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors backdrop-blur-sm"
                >
                  <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{highlight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        {project.features && project.features.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-2">Core Features</h2>
            <div className="fancy-underline mb-6" />
            <div className="space-y-3">
              {project.features.map((feature, idx) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 bg-white/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl hover:shadow-md transition-shadow backdrop-blur-sm"
                >
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Challenges & Solutions */}
        {project.challenges && project.challenges.length > 0 && (
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-2">Challenges & Solutions</h2>
            <div className="fancy-underline mb-6" />
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
                  <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-xl backdrop-blur-sm">
                    <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2">Challenge</h4>
                    <p className="text-rose-800 dark:text-rose-300/90 text-sm leading-relaxed">{challenge.problem}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl backdrop-blur-sm">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2">Solution</h4>
                    <p className="text-emerald-800 dark:text-emerald-300/90 text-sm leading-relaxed">{challenge.solution}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Demo & Links Section */}
        {hasAnyLinks && (
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-2">Explore Project</h2>
            <div className="fancy-underline mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.demo?.web && (
                <motion.a
                  href={project.demo.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors group shadow-md"
                >
                  <ExternalLink size={20} />
                  <div>
                    <p className="font-semibold">Live Demo</p>
                    <p className="text-sm text-slate-400 dark:text-indigo-200">View the project online</p>
                  </div>
                </motion.a>
              )}

              {/* App Store */}
              {iosUrl && (
                <motion.a
                  href={iosUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors group border border-transparent dark:border-slate-700 shadow-md"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 opacity-90">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.35-2.16 3.99.03 3.16 2.63 4.2 2.66 4.21l-.05.13c-.2.63-.52 1.56-1.2 2.34M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400 leading-none mb-0.5">Download on the</p>
                    <p className="font-semibold text-base leading-tight">App Store</p>
                  </div>
                </motion.a>
              )}

              {/* Play Store */}
              {androidUrl && (
                <motion.a
                  href={androidUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors group border border-transparent dark:border-slate-700 shadow-md"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0 opacity-90">
                    <path d="M3.18 23.76c.3.17.63.24.97.2l.1-.04 11.35-6.55-2.47-2.47-9.95 8.86zM.41 1.2C.16 1.57 0 2.08 0 2.73v18.54c0 .65.16 1.16.41 1.53l.08.08 10.39-10.39v-.24L.49 1.12l-.08.08zM20.13 9.53l-2.54-1.46-2.77 2.77 2.77 2.77 2.56-1.48c.73-.42.73-1.19-.02-1.6zM4.15.28l11.35 6.55-2.47 2.47L3.08.44l.1-.04c.34-.04.67.03.97.2v-.32z" />
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
                  className="flex items-center gap-3 p-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors border border-slate-300/50 dark:border-slate-700 shadow-sm"
                >
                  <FiGithub size={20} />
                  <div>
                    <p className="font-semibold">Source Code</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View on GitHub</p>
                  </div>
                </motion.a>
              )}
            </div>
          </motion.div>
        )}

        {/* Impact Stats */}
        {project.impact && (
          <motion.div variants={itemVariants}>
            <h2 className="section-title heading-gradient mb-2">Impact</h2>
            <div className="fancy-underline mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.impact.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-4 bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-center backdrop-blur-sm shadow-sm"
                >
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Projects CTA */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-10 sm:p-12 text-center backdrop-blur-sm shadow-sm"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">Like what you see?</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Check out more of my projects or let's collaborate on something amazing.
          </p>
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/"
              className="inline-block px-8 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors shadow-lg shadow-slate-900/10 dark:shadow-indigo-500/25"
            >
              View All Projects
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </motion.div>
  )
}