import React from 'react'
import { Leaf, Award, Compass, ShieldCheck, Check, Sparkles, Building2 } from 'lucide-react'

export const VisionSection: React.FC = () => {
  return (
    <section id="vision" className="py-24 relative bg-[#f4f1ea]/50 dark:bg-obsidian-900 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] max-w-lg mx-auto border border-slate-200 dark:border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="Architectural Craftsmanship"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

              {/* Floating Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/90 dark:glass-panel-gold border border-brand-500/30 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">Global Architectural Laureate</h4>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300">Winner — International Property Awards 2025</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-light">
                  "Recognized for redefining skyline harmony with net-zero biophilic engineering."
                </p>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -inset-4 bg-brand-500/10 blur-3xl -z-10 rounded-full" />
          </div>

          {/* Narrative & Pillars */}
          <div className="space-y-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 font-semibold mb-2 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-brand-500 dark:bg-brand-400 inline-block" />
                The Developer's Manifesto
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-medium text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                Architecture That Outlasts Generations.
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-light leading-relaxed">
                Founded with a conviction that luxury should never be transient, ASHIQUE Developments conceives structures that harmonize nature, monumental civic presence, and private sanctity.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    Uncompromising Sustainability & LEED Platinum
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    100% of our portfolio integrates closed-loop geothermal cooling, high-yield solar glass envelopes, and indigenous micro-forest canopies.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    Visionary Pritzker-Grade Collaborations
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    We commission solely the world's most reverent architectural masters, including Foster, Zaha Hadid Architects, and SAOTA.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                    99.2% Proven Delivery & Institutional Capital
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Fully backed by private equity reserves with zero debt dependency on single escrow deposits, safeguarding your acquisition milestone handovers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
