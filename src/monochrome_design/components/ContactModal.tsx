import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, Check, Loader2, ArrowUpRight } from 'lucide-react'
import { FaWhatsapp, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { contact } from '../../../data/contact'

export interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

type FormStatus = 'idle' | 'sending' | 'success'

export default function MonochromeContactModal({ isOpen, onClose }: ContactModalProps): React.JSX.Element {
  const [state, setState] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const formRef = useRef<HTMLFormElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus first input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!state.name.trim()) errs.name = 'Name is required'
    if (!state.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Valid email is required'
    if (!state.message.trim()) errs.message = 'Message is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setState((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || !formRef.current) return
    setStatus('sending')
    try {
      const res = await fetch(contact.formspree, {
        method: 'POST',
        body: new FormData(formRef.current),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        setState({ name: '', email: '', message: '' })
        setTimeout(() => {
          setStatus('idle')
          onClose()
        }, 2200)
      } else {
        setStatus('idle')
      }
    } catch {
      setStatus('idle')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Glass Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80 bg-zinc-900/40">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-base font-bold text-white tracking-tight">Initiate Conversation</h3>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono">Direct inquiry • Usually responds within 24 hours</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Direct Channels Bar */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-zinc-900/20 border-b border-zinc-800/60">
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group"
                >
                  <FaWhatsapp size={14} className="text-emerald-400" />
                  <span>WhatsApp</span>
                  <ArrowUpRight size={11} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </a>

                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group"
                >
                  <FaLinkedinIn size={13} className="text-sky-400" />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={11} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </a>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all group"
                >
                  <Mail size={13} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <span>Email</span>
                  <ArrowUpRight size={11} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </a>
              </div>

              {/* Form Body */}
              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="monochrome_design-name" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    ref={firstInputRef}
                    id="monochrome_design-name"
                    name="name"
                    type="text"
                    value={state.name}
                    onChange={handleChange}
                    placeholder="Alex Mercer"
                    disabled={status !== 'idle'}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none transition-colors ${
                      errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-zinc-400'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="monochrome_design-email" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="monochrome_design-email"
                    name="email"
                    type="email"
                    value={state.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    disabled={status !== 'idle'}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none transition-colors ${
                      errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-zinc-400'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="monochrome_design-message" className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Project Brief / Message
                  </label>
                  <textarea
                    id="monochrome_design-message"
                    name="message"
                    rows={4}
                    value={state.message}
                    onChange={handleChange}
                    placeholder="Describe your project, timeline, or idea..."
                    disabled={status !== 'idle'}
                    className={`w-full bg-zinc-900/80 border rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none resize-none transition-colors ${
                      errors.message ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-zinc-400'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-rose-400 mt-1 font-mono">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status !== 'idle'}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm text-zinc-950 bg-white hover:bg-zinc-200 transition-colors disabled:opacity-50"
                  >
                    {status === 'sending' && (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Transmission...</span>
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <Check size={16} className="text-emerald-600" />
                        <span>Message Dispatched Successfully!</span>
                      </>
                    )}
                    {status === 'idle' && <span>Send Message</span>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
