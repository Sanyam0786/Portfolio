import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail } from 'lucide-react'
import { FaWhatsapp, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { contact } from '../../data/contact'

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
  form?: string
}

type FormStatus = 'idle' | 'sending' | 'success'

export default function ContactModal({ isOpen, onClose }: ContactModalProps): React.JSX.Element {
  const [state, setState] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<FormStatus>('idle') // idle | sending | success
  const formRef = useRef<HTMLFormElement | null>(null)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 200)
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!state.name.trim()) errs.name = 'Name required'
    if (!state.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Valid email required'
    if (!state.message.trim()) errs.message = 'Message required'
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
        setTimeout(() => { setStatus('idle'); onClose() }, 2500)
      } else {
        setStatus('idle')
      }
    } catch {
      setStatus('idle')
    }
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-white/60 dark:bg-slate-700/50 border rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
     focus:outline-none focus:ring-2 transition-all duration-200 ${errors[field]
      ? 'border-rose-300 focus:ring-rose-200'
      : 'border-slate-200 dark:border-slate-600 focus:ring-slate-200 dark:focus:ring-slate-600 focus:border-slate-400 dark:focus:border-slate-500'
    }`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-md glass rounded-2xl shadow-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-center gap-3">
                  <motion.span
                    className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block flex-shrink-0"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                      Let's work together
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contact.name} · {contact.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0 ml-3"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="3" x2="11" y2="11" /><line x1="11" y1="3" x2="3" y2="11" />
                  </svg>
                </button>
              </div>

              {/* Quick contact links */}
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {[
                  {
                    href: `mailto:${contact.email}`,
                    label: 'Email',
                    icon: <Mail className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                  },
                  ...(contact.github ? [{
                    href: contact.github,
                    label: 'GitHub',
                    icon: <FaGithub className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" />
                  }] : []),
                  {
                    href: contact.whatsapp,
                    label: 'WhatsApp',
                    icon: <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  },
                  {
                    href: contact.linkedin,
                    label: 'LinkedIn',
                    icon: <FaLinkedinIn className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  },
                ].map(({ href, label, icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 2 }}
                    className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-700/60 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {icon}
                    {label}
                  </motion.a>
                ))}
              </div>



              <div className="mx-6 h-px bg-slate-200/80 dark:bg-slate-700 mb-5" />

              {/* Form */}
              <form ref={formRef} onSubmit={handleSubmit} className="px-6 pb-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      ref={firstInputRef}
                      name="name"
                      value={state.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      value={state.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className={inputClass('email')}
                    />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="mb-4">
                  <textarea
                    name="message"
                    value={state.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell me about your project..."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-white disabled:opacity-60 transition-colors"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                    {status !== 'sending' && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="2" y1="7" x2="12" y2="7" /><polyline points="8,3 12,7 8,11" />
                      </svg>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {status === 'success' && (
                      <motion.span
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-emerald-600 font-medium flex items-center gap-1.5"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="2,7.5 5.5,11 13,4" />
                        </svg>
                        Message sent!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}