import React, { useState, useEffect } from 'react'
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  FileText,
  Terminal,
  Plus,
  Trash2,
  ExternalLink,
  Share2,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ImageUploader from '../components/ImageUploader'
import { contact as defaultContact } from '../../../data/contact'
import { featuresSentences as defaultSentences } from '../../../data/home'

interface ProfileData {
  id?: string
  name: string
  role: string
  email: string
  linkedin: string
  whatsapp: string
  github: string
  formspree: string
  hero_sentences: string[]
  resume_url?: string
}

export default function ManageProfile(): React.JSX.Element {
  const [profile, setProfile] = useState<ProfileData>({
    name: defaultContact.name,
    role: defaultContact.role,
    email: defaultContact.email,
    linkedin: defaultContact.linkedin,
    whatsapp: defaultContact.whatsapp,
    github: defaultContact.github,
    formspree: defaultContact.formspree,
    hero_sentences: defaultSentences,
    resume_url: '',
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newSentence, setNewSentence] = useState<string>('')

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setProfile({
          id: data.id,
          name: data.name || defaultContact.name,
          role: data.role || defaultContact.role,
          email: data.email || defaultContact.email,
          linkedin: data.linkedin || defaultContact.linkedin,
          whatsapp: data.whatsapp || defaultContact.whatsapp,
          github: data.github || defaultContact.github,
          formspree: data.formspree || defaultContact.formspree,
          hero_sentences: Array.isArray(data.hero_sentences) && data.hero_sentences.length > 0
            ? data.hero_sentences
            : defaultSentences,
          resume_url: data.resume_url || '',
        })
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      showToast('error', err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const handleAddSentence = () => {
    if (!newSentence.trim()) return
    setProfile((prev) => ({
      ...prev,
      hero_sentences: [...prev.hero_sentences, newSentence.trim()],
    }))
    setNewSentence('')
  }

  const handleRemoveSentence = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      hero_sentences: prev.hero_sentences.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload: any = {
        name: profile.name.trim(),
        role: profile.role.trim(),
        email: profile.email.trim(),
        linkedin: profile.linkedin.trim(),
        whatsapp: profile.whatsapp.trim(),
        github: profile.github.trim(),
        formspree: profile.formspree.trim(),
        hero_sentences: profile.hero_sentences,
        resume_url: profile.resume_url || '',
        updated_at: new Date().toISOString(),
      }

      if (profile.id) {
        payload.id = profile.id
      }

      const { data, error } = await supabase.from('profile').upsert(payload).select().single()
      if (error) throw error

      if (data) {
        setProfile((prev) => ({ ...prev, id: data.id }))
      }

      showToast('success', 'Profile and resume settings saved')
    } catch (err: any) {
      console.error('Error saving profile:', err)
      showToast('error', err.message || 'Failed to save profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 size={24} className="animate-spin text-slate-400" />
        <p className="text-xs text-slate-400">Loading profile data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="section-title heading-gradient">Profile & Meta</h2>
          <div className="fancy-underline mt-2" />
          <p className="section-subtitle mt-2">
            Configure global contact endpoints, hero typewriter copy, and CV file.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-900 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 darkGlass border ${
            toast.type === 'success'
              ? 'border-emerald-500/30 text-emerald-300'
              : 'border-red-500/30 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* General Info */}
        <div className="darkGlass p-5 sm:p-6 rounded-2xl border border-white/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <User size={15} className="text-slate-400" />
            <span>General Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Headline / Role *</label>
              <input
                type="text"
                required
                value={profile.role}
                onChange={(e) => setProfile((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Formspree Form ID</label>
              <input
                type="text"
                value={profile.formspree}
                onChange={(e) => setProfile((prev) => ({ ...prev, formspree: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>
          </div>
        </div>

        {/* Social Profiles */}
        <div className="darkGlass p-5 sm:p-6 rounded-2xl border border-white/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <Share2 size={15} className="text-slate-400" />
            <span>Social & Connect Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile((prev) => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">WhatsApp Chat URL</label>
              <input
                type="url"
                value={profile.whatsapp}
                onChange={(e) => setProfile((prev) => ({ ...prev, whatsapp: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub URL</label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile((prev) => ({ ...prev, github: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
              />
            </div>
          </div>
        </div>

        {/* Hero Sentences */}
        <div className="darkGlass p-5 sm:p-6 rounded-2xl border border-white/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <Terminal size={15} className="text-slate-400" />
            <div>
              <span>Hero Typewriter Sentences</span>
              <p className="text-[11px] text-slate-400 font-normal">Rotating phrases displayed in homepage hero</p>
            </div>
          </div>

          <div className="space-y-2">
            {profile.hero_sentences.map((sentence, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60"
              >
                <span className="text-xs text-slate-200 font-mono">{sentence}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSentence(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                  title="Remove sentence"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              placeholder="Add new hero sentence..."
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSentence()
                }
              }}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/40"
            />
            <button
              type="button"
              onClick={handleAddSentence}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Resume PDF */}
        <div className="darkGlass p-5 sm:p-6 rounded-2xl border border-white/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
            <FileText size={15} className="text-slate-400" />
            <div>
              <span>Curriculum Vitae / Resume</span>
              <p className="text-[11px] text-slate-400 font-normal">Publicly downloadable PDF file</p>
            </div>
          </div>

          <ImageUploader
            label="Upload Resume Document"
            folder="resumes"
            accept="application/pdf,.doc,.docx"
            value={profile.resume_url}
            onChange={(url) => setProfile((prev) => ({ ...prev, resume_url: url }))}
          />

          {profile.resume_url && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs font-mono truncate max-w-sm text-slate-300">
                {profile.resume_url}
              </span>
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700"
              >
                <span>Preview</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
