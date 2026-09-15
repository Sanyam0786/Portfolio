import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { icons } from '../assets'

export default function Footer(){
  const [state, setState] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, sending, success
  const [errors, setErrors] = useState({})
  const formRef = useRef(null)

  function validate() { 
    const errs = {}
    if (!state.name.trim()) errs.name = 'Name required'
    if (!state.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errs.email = 'Valid email required'
    if (!state.message.trim()) errs.message = 'Message required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(e){
    setState({ ...state, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
  e.preventDefault()

  if (!validate()) return

  setStatus('sending')

  try {
    const res = await fetch('https://formspree.io/f/xbdqjddg', {
      method: 'POST',
      body: new FormData(formRef.current),
      headers: {
        Accept: 'application/json',
      },
    })

    if (res.ok) {
      setStatus('success')
      setState({ name: '', email: '', message: '' })
      setErrors({})
    } else {
      alert('Something went wrong')
      setStatus('idle')
    }
  } catch (err) {
    alert('Network error')
    setStatus('idle')
  }
}

  return (
    <motion.footer
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-20 mt-12"
      id="contact"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 glass rounded-2xl shadow-soft-lg overflow-hidden ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: contact info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/12 dark:bg-slate-700/40 flex items-center justify-center border border-white/6 dark:border-slate-600/40">
                <div className="w-3 h-3 rounded-full bg-accent inline-block" />
              </div>
              <div>
                <div className="text-lg font-semibold">{`MD Ashim Raja`}</div>
                <div className="text-sm opacity-80">{`Open for freelance remote work`}</div>
              </div>
            </div>

            <div className="space-y-3">
              <a className="flex items-center gap-3 p-2 rounded-md hover:translate-x-1 transition-transform" href={`mailto:rajaasim652@gmail.com`}>
                <span className="text-slate-700 dark:text-slate-300">
                  <img
                    src={icons.ic_mail}
                    alt="email"
                    className="w-5 h-5 object-contain"
                  />
                </span>
                <span className="text-sm">{`rajaasim652@gmail.com`}</span>
              </a>
              <a className="flex items-center gap-3 p-2 rounded-md hover:translate-x-1 transition-transform" href={`https://www.linkedin.com/in/mdashimraja786`} target="_blank" rel="noreferrer">
                <span className="text-slate-700 dark:text-slate-300">
                  <img
                    src={icons.ic_linkedin}
                    alt="email"
                    className="w-5 h-5 object-contain"
                  />
                </span>
                <span className="text-sm">{`LinkedIn`}</span>
              </a>
              <a className="flex items-center gap-3 p-2 rounded-md hover:translate-x-1 transition-transform" href={`https://wa.me/+9179707152334`} target="_blank" rel="noreferrer">
                <span className="text-slate-700 dark:text-slate-300">
                  <img
                    src={icons.ic_whatsapp}
                    alt="email"
                    className="w-6 h-6 object-contain"
                  />
                </span>
                <span className="text-sm">{`WhatsApp`}</span>
              </a>
            </div>
          </div>

          {/* Right: contact form */}
          <form action="https://formspree.io/f/xbdqjddg" ref={formRef} onSubmit={handleSubmit} className="bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="sr-only">Name</label>
                <input name="name" value={state.name} onChange={handleChange} className={`w-full rounded-lg py-2 px-3 bg-white/6 dark:bg-slate-700/40 border border-white/6 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent transition`} placeholder="Name" />
                {errors.name && <div className="text-xs text-rose-500 mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="sr-only">Email</label>
                <input name="email" value={state.email} onChange={handleChange} className={`w-full rounded-lg py-2 px-3 bg-white/6 dark:bg-slate-700/40 border border-white/6 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent transition`} placeholder="Email" />
                {errors.email && <div className="text-xs text-rose-500 mt-1">{errors.email}</div>}
              </div>
            </div>
            <div className="mt-3">
              <label className="sr-only">Message</label>
              <textarea name="message" value={state.message} onChange={handleChange} rows={4} className={`w-full rounded-lg py-2 px-3 bg-white/6 dark:bg-slate-700/40 border border-white/6 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent transition`} placeholder="Message"></textarea>
              {errors.message && <div className="text-xs text-rose-500 mt-1">{errors.message}</div>}
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button type="submit" disabled={status==='sending'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white font-medium shadow-sm transform transition hover:-translate-y-0.5 disabled:opacity-60">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                
              </button>
              <div className="text-sm opacity-70">
                {status === 'success' ? <motion.span initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.36 }}>Message sent successfully</motion.span> : <span></span>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.footer>
  )
}
