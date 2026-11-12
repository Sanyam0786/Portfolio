import React from 'react'
import { Mail } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import { contact } from '../../../data/contact'

export default function MonochromeFooter(): React.JSX.Element {
  return (
    <footer className="py-16 bg-zinc-950 text-zinc-400 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-900">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white tracking-tight">{contact.name}</h4>
            <p className="text-xs text-zinc-400">{contact.role}</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              title="GitHub"
            >
              <FaGithub size={18} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              title="LinkedIn"
            >
              <FaLinkedinIn size={18} />
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
              title="WhatsApp"
            >
              <FaWhatsapp size={18} />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-zinc-400 hover:text-white transition-colors"
              title="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <p>© {new Date().getFullYear()} {contact.name}. All rights reserved.</p>
          <p className="text-zinc-400">Crafted with precision & modern aesthetics.</p>
        </div>
      </div>
    </footer>
  )
}
