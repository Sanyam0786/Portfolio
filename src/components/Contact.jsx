import React from 'react'
import { contact } from '../../data/contact'

export default function Contact(){
  return (
    <section className="py-12" aria-label="contact">
      <div className="max-w-4xl mx-auto px-6">
        <h3 className="text-lg font-semibold mb-4">Contact</h3>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${contact.email}`} className="px-4 py-2 rounded-md bg-slate-900 text-white">Email</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md border">LinkedIn</a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md border">WhatsApp</a>
        </div>
      </div>
    </section>
  )
}
