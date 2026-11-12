import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Menu, X, Mail } from 'lucide-react'
import { contact } from '../../../data/contact'

interface NavbarProps {
  onContactOpen: () => void
}

const navLinks = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Resume', href: '#resume' },
]

export default function MonochromeNavbar({ onContactOpen }: NavbarProps): React.JSX.Element {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      if (location.pathname === '/') {
        const sectionIds = ['skills', 'projects', 'experience', 'education', 'resume']
        const scrollPosition = window.scrollY + 220

        let current = ''
        for (let i = 0; i < sectionIds.length; i++) {
          const el = document.getElementById(sectionIds[i])
          if (el && el.offsetTop <= scrollPosition) {
            current = sectionIds[i]
          }
        }
        if (window.scrollY < 200) {
          current = ''
        }
        setActiveSection(current)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname === '/' || location.pathname === '') {
      e.preventDefault()
      const targetId = href.replace(/^#/, '')
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', href)
      }
      setMobileMenuOpen(false)
    }
  }

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/' || location.pathname === '') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.history.pushState(null, '', '/')
      setActiveSection('')
      setMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 py-4 transition-all duration-300 ${
        scrolled
          ? 'bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/50'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Monogram Brand */}
        <Link
          to="/"
          onClick={handleBrandClick}
          className="group flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-xs tracking-tighter group-hover:bg-white transition-colors">
            SM
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
              {contact.name}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Mobile & Web
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links with Luminous Active Dot */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {navLinks.map((item) => {
            const isActive = location.pathname === '/' && activeSection === item.href.slice(1)
            const targetHref = location.pathname === '/' ? item.href : `/${item.href}`

            return (
              <a
                key={item.label}
                href={targetHref}
                onClick={(e) => handleNavClick(e, item.href)}
                className="relative py-1.5 text-[13px] font-medium transition-colors cursor-pointer group flex flex-col items-center"
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white font-medium' : 'text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="navbar-luminous-dot"
                    className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Contact CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onContactOpen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-800 px-6 py-6 space-y-4"
          >
            <nav className="space-y-1.5">
              {navLinks.map((item) => {
                const isActive = location.pathname === '/' && activeSection === item.href.slice(1)
                const targetHref = location.pathname === '/' ? item.href : `/${item.href}`

                return (
                  <a
                    key={item.label}
                    href={targetHref}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors rounded-xl cursor-pointer ${
                      isActive
                        ? 'text-white font-medium bg-zinc-900/80'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.95)]" />
                    )}
                  </a>
                )
              })}
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onContactOpen()
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-white"
            >
              <Mail size={14} />
              <span>Get In Touch</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
