import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderKanban,
  Cpu,
  Briefcase,
  GraduationCap,
  ExternalLink,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAdminAuth } from '../context/AdminAuthContext'
import TwoFactorModal from '../components/TwoFactorModal'
import { migrateAllStaticImagesToWebP, MigrationProgress } from '../utils/storageMigrator'
import { projects as localProjects } from '../../../data/projects'
import { skills as localSkills } from '../../../data/skills'
import { experience as localExperience } from '../../../data/experience'
import { education as localEducation } from '../../../data/education'
import { contact as localContact } from '../../../data/contact'
import { featuresSentences as localSentences } from '../../../data/home'

interface Stats {
  projects: number
  skills: number
  experience: number
  education: number
}

export default function AdminDashboard(): React.JSX.Element {
  const { hasMfaEnrolled } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, experience: 0, education: 0 })
  const [loading, setLoading] = useState<boolean>(true)
  const [syncing, setSyncing] = useState<boolean>(false)
  const [migratingImages, setMigratingImages] = useState<boolean>(false)
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | null>(null)
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const [
        { count: projCount },
        { count: skillCount },
        { count: expCount },
        { count: eduCount },
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
        supabase.from('education').select('*', { count: 'exact', head: true }),
      ])

      setStats({
        projects: projCount || 0,
        skills: skillCount || 0,
        experience: expCount || 0,
        education: eduCount || 0,
      })
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const syncStep = async (stepName: 'profile' | 'skills' | 'projects' | 'experience' | 'education') => {
    switch (stepName) {
      case 'profile': {
        const { data: existing } = await supabase.from('profile').select('id').limit(1)
        const payload = {
          name: localContact.name,
          role: localContact.role,
          email: localContact.email,
          linkedin: localContact.linkedin,
          whatsapp: localContact.whatsapp,
          github: localContact.github,
          formspree: localContact.formspree,
          hero_sentences: localSentences,
        }
        if (existing && existing.length > 0) {
          const { error } = await supabase.from('profile').update(payload).eq('id', existing[0].id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('profile').insert(payload)
          if (error) throw error
        }
        await fetchStats()
        return { success: true, message: `Profile seeded for ${localContact.name}` }
      }
      case 'skills': {
        await supabase.from('skills').delete().neq('name', '___never___')
        const formattedSkills = localSkills.map((s, index) => ({
          name: s.name,
          icon: typeof s.icon === 'string' ? s.icon : '',
          level: s.level || 'Expert',
          display_order: index,
        }))
        const { error } = await supabase.from('skills').insert(formattedSkills)
        if (error) throw error
        await fetchStats()
        return { success: true, message: `${formattedSkills.length} skills seeded` }
      }
      case 'projects': {
        const formattedProjects = localProjects.map((p, index) => ({
          id: p.id,
          title: p.title,
          role: p.role,
          description: p.description,
          tags: p.tags,
          cover_image: typeof p.coverImage === 'string' ? p.coverImage : '',
          screenshots: Array.isArray(p.screenshots) ? p.screenshots : [],
          demo: p.demo || {},
          highlights: p.highlights || [],
          features: p.features || [],
          challenges: p.challenges || [],
          impact: p.impact || [],
          github: p.github || '',
          display_order: index,
          is_published: true,
        }))
        const { error } = await supabase.from('projects').upsert(formattedProjects, { onConflict: 'id' })
        if (error) throw error
        await fetchStats()
        return { success: true, message: `${formattedProjects.length} projects seeded` }
      }
      case 'experience': {
        await supabase.from('experience').delete().neq('company', '___never___')
        const formattedExp = localExperience.map((e, index) => ({
          company: e.company,
          role: e.role,
          period: e.period,
          impact: e.impact,
          display_order: index,
        }))
        const { error } = await supabase.from('experience').insert(formattedExp)
        if (error) throw error
        await fetchStats()
        return { success: true, message: `${formattedExp.length} experience records seeded` }
      }
      case 'education': {
        await supabase.from('education').delete().neq('school', '___never___')
        const formattedEdu = localEducation.map((ed, index) => ({
          school: ed.school,
          degree: ed.degree,
          period: ed.period,
          notes: ed.notes,
          display_order: index,
        }))
        const { error } = await supabase.from('education').insert(formattedEdu)
        if (error) throw error
        await fetchStats()
        return { success: true, message: `${formattedEdu.length} education records seeded` }
      }
    }
  }

  useEffect(() => {
    ;(window as any).__syncStep = syncStep
    ;(window as any).__fetchStats = fetchStats
    ;(window as any).__migrateAllStaticImagesToWebP = migrateAllStaticImagesToWebP
  }, [])

  const handleMigrateImages = async () => {
    setMigratingImages(true)
    setSyncMessage(null)

    const result = await migrateAllStaticImagesToWebP((p) => {
      setMigrationProgress(p)
    })

    if (result.success) {
      setSyncMessage({
        type: 'success',
        text: 'All static images successfully converted to WebP and stored in Supabase Storage!',
      })
      await fetchStats()
    } else {
      setSyncMessage({
        type: 'error',
        text: result.error || 'Failed to migrate images to storage.',
      })
    }
    setMigratingImages(false)
  }

  const handleSyncLocalData = async () => {
    setSyncing(true)
    setSyncMessage(null)

    try {
      await syncStep('profile')
      await syncStep('skills')
      await syncStep('projects')
      await syncStep('experience')
      await syncStep('education')

      setSyncMessage({
        type: 'success',
        text: 'Database successfully synced with portfolio codebase data.',
      })
      await fetchStats()
    } catch (err: any) {
      console.error('Sync error:', err)
      setSyncMessage({
        type: 'error',
        text: err.message || 'Failed to sync data.',
      })
    } finally {
      setSyncing(false)
    }
  }

  const statCards = [
    { title: 'Projects', count: stats.projects, href: '/admin/projects', icon: FolderKanban },
    { title: 'Skills', count: stats.skills, href: '/admin/skills', icon: Cpu },
    { title: 'Experience', count: stats.experience, href: '/admin/experience', icon: Briefcase },
    { title: 'Education', count: stats.education, href: '/admin/education', icon: GraduationCap },
  ]

  const sectionsList = [
    {
      title: 'Projects & Case Studies',
      desc: 'Add, update or reorder projects, roles, and media.',
      href: '/admin/projects',
      count: stats.projects,
      icon: FolderKanban,
    },
    {
      title: 'Technical Skills',
      desc: 'Manage technical competencies, icons and proficiency.',
      href: '/admin/skills',
      count: stats.skills,
      icon: Cpu,
    },
    {
      title: 'Work History',
      desc: 'Manage career timeline positions, dates, and achievements.',
      href: '/admin/experience',
      count: stats.experience,
      icon: Briefcase,
    },
    {
      title: 'Education',
      desc: 'Academic degrees, universities, and specializations.',
      href: '/admin/education',
      count: stats.education,
      icon: GraduationCap,
    },
    {
      title: 'Profile & Resume',
      desc: 'Update headline copy, contact endpoints, and CV document.',
      href: '/admin/profile',
      count: 'Ready',
      icon: UserCheck,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Section Header matching Website typography */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title heading-gradient">Dashboard Overview</h2>
          <div className="fancy-underline mt-2" />
          <p className="section-subtitle mt-2">
            Real-time control center for your portfolio data in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleSyncLocalData}
            disabled={syncing || migratingImages}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Database size={13} />
            <span>{syncing ? 'Syncing...' : 'Sync Codebase Data'}</span>
          </button>

          <button
            onClick={handleMigrateImages}
            disabled={migratingImages || syncing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            title="Convert and upload all local static project & skill images to WebP in Supabase Storage"
          >
            {migratingImages ? (
              <Loader2 size={13} className="animate-spin text-indigo-400" />
            ) : (
              <ImageIcon size={13} className="text-indigo-400" />
            )}
            <span>{migratingImages ? 'Migrating to WebP...' : 'Store Images in WebP Storage'}</span>
          </button>
        </div>
      </div>

      {/* Migration Progress Bar */}
      {migrationProgress && migratingImages && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl text-xs darkGlass border border-indigo-500/30 space-y-2 text-indigo-200"
        >
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-2">
              <Loader2 size={13} className="animate-spin text-indigo-400" />
              <span>{migrationProgress.currentItem}</span>
            </span>
            <span className="text-indigo-400 font-bold">
              {migrationProgress.current} / {migrationProgress.total}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round((migrationProgress.current / Math.max(migrationProgress.total, 1)) * 100)}%`,
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Sync / Alert Message */}
      {syncMessage && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 darkGlass border ${
            syncMessage.type === 'success'
              ? 'border-emerald-500/30 text-emerald-300'
              : 'border-red-500/30 text-red-300'
          }`}
        >
          {syncMessage.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          )}
          <span>{syncMessage.text}</span>
        </motion.div>
      )}

      {/* --- 2FA Setup Banner (Commented out per request. To show 2FA configuration banner later, uncomment below) --- */}
      {/*
      {!hasMfaEnrolled && (
        <div className="darkGlass p-5 rounded-2xl border border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Protect with Google Authenticator</p>
              <p className="text-xs text-slate-400">
                Enable 6-digit TOTP verification on your admin logins for enhanced security.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTwoFactorModalOpen(true)}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
          >
            Configure 2FA
          </button>
        </div>
      )}
      */}

      {/* Stats Cards Grid matching Website Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              to={card.href}
              className="darkGlass p-5 rounded-2xl border border-white/5 hover:border-slate-600 transition-all hover:-translate-y-1 shadow-sm hover:shadow-lg group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-4">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                  <Icon size={17} />
                </div>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-0.5">
                  {loading ? '—' : card.count}
                </p>
                <p className="text-xs font-medium text-slate-400">{card.title}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Sections List */}
      <div className="darkGlass rounded-2xl border border-white/5 overflow-hidden shadow-md">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-200">Manageable Sections</span>
          <span className="text-xs font-medium text-slate-400">Live Synchronized</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {sectionsList.map((sec) => {
            const Icon = sec.icon
            return (
              <Link
                key={sec.title}
                to={sec.href}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:scale-105 transition-all flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {sec.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{sec.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold text-slate-300 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/60">
                    {loading && typeof sec.count === 'number' ? '...' : sec.count}
                  </span>
                  <ArrowRight size={15} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* --- Two-Factor Setup Modal (Commented out per request. To manage or disable 2FA from dashboard, uncomment below) --- */}
      {/*
      <TwoFactorModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
      />
      */}
    </div>
  )
}
