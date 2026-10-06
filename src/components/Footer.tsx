import React from 'react'
import { Building2, Globe, Shield, Mail, Phone, ArrowUp } from 'lucide-react'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-obsidian-950 border-t border-white/10 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center shadow-lg">
                <Building2 className="w-4 h-4 text-obsidian-950" />
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-wider uppercase text-white block leading-none">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.25em] text-brand-400 uppercase font-semibold">
                  Developments
                </span>
              </div>
            </div>

            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Conceiving monumental residences, private estates, and carbon-neutral civic towers across the world's most coveted horizons.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-brand-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Cloudflare D1 & Edge Workers Active</span>
            </div>
          </div>

          {/* Developments */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              Portfolio
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#projects" className="hover:text-brand-300 transition-colors">The Obsidian Residences</a></li>
              <li><a href="#projects" className="hover:text-brand-300 transition-colors">Aura One Financial Tower</a></li>
              <li><a href="#projects" className="hover:text-brand-300 transition-colors">Elysium Hills Sanctuary</a></li>
              <li><a href="#projects" className="hover:text-brand-300 transition-colors">Solstice Bay Promenade</a></li>
              <li><a href="#projects" className="hover:text-brand-300 transition-colors">Vertex Innovation Campus</a></li>
            </ul>
          </div>

          {/* Private Offices */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              Global Private Offices
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li>Miami • Biscayne Marina Tower</li>
              <li>London • Mayfair Sovereign Suite</li>
              <li>Dubai • DIFC Gate Precinct 4</li>
              <li>Singapore • Marina One Core</li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              Advisory Desk
            </h4>
            <div className="space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                advisory@auradevelopments.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-400" />
                +1 (800) 480-AURA
              </p>
              <p className="pt-2 text-[11px] text-slate-500">
                Mon - Sat: 08:00 - 20:00 EST <br />
                Private site visits arranged on request.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Technology Line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AURA Development Group Inc. All rights reserved. Equal Housing Opportunity.
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by GitHub • Cloudflare D1 • Cloudflare Workers</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
