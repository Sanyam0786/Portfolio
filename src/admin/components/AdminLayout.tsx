import React, { useState, ReactNode, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  Briefcase,
  GraduationCap,
  UserCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import TwoFactorModal from './TwoFactorModal'
import { contact } from '../../../data/contact'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Skills', href: '/admin/skills', icon: Cpu },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Profile', href: '/admin/profile', icon: UserCheck },
]

export default function AdminLayout({ children }: { children: ReactNode }): React.JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, hasMfaEnrolled } = useAdminAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false)
  const [showSignOutConfirm, setShowSignOutConfirm] = useState<boolean>(false)
  const [signingOut, setSigningOut] = useState<boolean>(false)

  const handleConfirmSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/admin/login')
    } finally {
      setSigningOut(false)
      setShowSignOutConfirm(false)
    }
  }

  useEffect(() => {
    if (showSignOutConfirm) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [showSignOutConfirm])

  const currentSectionName =
    navItems.find((item) => item.href === location.pathname)?.label || 'Overview'

  return (
    <div className="dark min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased relative selection:bg-slate-700 selection:text-white">
      {/* Ambient Canvas Lighting (Matching Website dark theme, No Bubbles) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-canvas opacity-70" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(100,116,139,0.12),transparent)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_80%_80%,rgba(30,41,59,0.2),transparent_50%)]" />

      {/* Desktop Sidebar (Positioned on the Left, Dark Glass aesthetic matching website) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/90 backdrop-blur-2xl border-r border-slate-800/80 fixed inset-y-0 left-0 z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/70">
          <Link to="/admin" className="group">
            <span className="text-sm font-semibold tracking-tight text-white group-hover:text-slate-200 transition-colors">
              {contact.name}
            </span>
          </Link>
        </div>

        {/* Section Label */}
        <div className="px-4 pt-5 pb-2">
          <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'darkGlass text-white font-semibold border border-slate-700/80 shadow-md shadow-slate-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon
                  size={16}
                  className={`transition-colors ${
                    isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-300 shadow-sm" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
          {/* --- 2FA UI (Commented out per request. To manage or disable 2FA later, uncomment below) --- */}
          {/*
          <button
            onClick={() => setTwoFactorModalOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium border border-slate-700/60 darkGlass hover:border-slate-600 transition-colors text-slate-300 mb-2"
          >
            <div className="flex items-center gap-2">
              {hasMfaEnrolled ? (
                <ShieldCheck size={14} className="text-emerald-400" />
              ) : (
                <Shield size={14} className="text-slate-400" />
              )}
              <span className="text-[11px]">2FA Security</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                hasMfaEnrolled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {hasMfaEnrolled ? 'Active' : 'Setup'}
            </span>
          </button>
          */}

          <div className="darkGlass border border-slate-700/60 rounded-2xl p-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-200 flex-shrink-0 shadow-inner">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <p className="text-[11px] font-medium text-slate-200 truncate max-w-[135px]">
                {user?.email || 'admin'}
              </p>
            </div>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-xl hover:bg-red-950/30 transition-all"
              title="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport (Positioned on the Right Side of Sidebar) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 px-6 sm:px-8 bg-slate-900/70 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Portfolio Admin</span>
              <span className="text-slate-600">/</span>
              <span className="font-semibold text-white px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-[11px]">
                {currentSectionName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View live portfolio */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="darkGlass inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white border border-slate-700/70 hover:border-slate-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Live Portfolio</span>
              <ExternalLink size={12} className="text-slate-400" />
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900/95 z-50 p-4 flex flex-col lg:hidden border-r border-slate-800 text-slate-200 backdrop-blur-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-semibold tracking-tight text-white">{contact.name}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                        isActive
                          ? 'darkGlass text-white border border-slate-700/80 font-semibold shadow-md'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all"
                >
                  <span>View Live Site</span>
                  <ExternalLink size={12} />
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setShowSignOutConfirm(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs text-red-400 hover:bg-red-950/30 transition-all border border-red-500/20"
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Sign Out Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !signingOut && setShowSignOutConfirm(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            />

            {/* Modal Dialog styled with Website darkGlass */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-sm rounded-3xl darkGlass border border-white/10 p-6 sm:p-7 shadow-2xl z-10 space-y-5 bg-slate-900/95 backdrop-blur-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                  <LogOut size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Confirm Sign Out</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Are you sure you want to sign out? You will need your credentials to log back in.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={signingOut}
                  onClick={() => setShowSignOutConfirm(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={signingOut}
                  onClick={handleConfirmSignOut}
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {signingOut ? 'Signing out...' : 'Yes, Sign Out'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Two-Factor Authentication Modal (Commented out per request. To manage or disable 2FA, uncomment below) --- */}
      {/*
      <TwoFactorModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
      />
      */}
    </div>
  )
}
