import React, { useState } from 'react'
import { ArrowRight, Search, Award, Sparkles, Shield, ChevronDown } from 'lucide-react'

interface HeroProps {
  onSearch: (category: string, status: string) => void
  onExploreProjects: () => void
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onExploreProjects }) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(selectedCategory, selectedStatus)
    const element = document.getElementById('projects')
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Architectural Canvas */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Architecture"
          className="w-full h-full object-cover object-center filter brightness-[0.35] dark:brightness-[0.4] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f5] via-black/50 to-black/30 dark:from-obsidian-950 dark:via-obsidian-950/70 dark:to-obsidian-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full text-center mt-8">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 dark:bg-brand-500/10 border border-white/30 dark:border-brand-500/30 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-brand-400" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-white dark:text-brand-300">
            Global Master Developer & Architect
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium text-white tracking-tight leading-[1.08] max-w-5xl mx-auto mb-6 drop-shadow-md">
          Sculpting Landmarks. <br />
          <span className="text-amber-200 dark:text-gold-gradient italic font-normal">Elevating Generations.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-100 dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-10 drop-shadow">
          We curate ultra-luxury residential towers, beachfront private estates, and carbon-neutral commercial headquarters with uncompromising craftsmanship.
        </p>

        {/* Interactive Search Bar / Filter Pod */}
        <div className="max-w-4xl mx-auto glass-panel p-4 sm:p-5 rounded-2xl shadow-2xl mb-12">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Category Select */}
            <div className="text-left bg-slate-50 dark:bg-obsidian-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 mb-0.5">
                Collection Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">All Portfolios</option>
                <option value="Waterfront Estate" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Waterfront Estates</option>
                <option value="Luxury Residential" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Hillside Sanctuaries</option>
                <option value="Mixed-Use" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Sky Tower & Suites</option>
                <option value="Commercial Tower" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Commercial Campuses</option>
              </select>
            </div>

            {/* Status Select */}
            <div className="text-left bg-slate-50 dark:bg-obsidian-900/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5">
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-brand-600 dark:text-brand-400 mb-0.5">
                Development Stage
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">All Stages</option>
                <option value="Under Construction" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Under Construction</option>
                <option value="Launching Soon" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Launching Soon</option>
                <option value="Ready to Move" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Ready for Immediate Move</option>
                <option value="Handover 2026" className="bg-white dark:bg-obsidian-900 text-slate-900 dark:text-white">Handover 2026</option>
              </select>
            </div>

            {/* Action CTA */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white dark:text-obsidian-950 font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-brand-500/20"
              >
                <Search className="w-4 h-4" />
                <span>Search Portfolio</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Trust Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/50 dark:border-white/10">
          <div className="text-left px-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-0.5">
              $2.4B+
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              Delivered Asset Value
            </div>
          </div>

          <div className="text-left px-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-0.5">
              4.2M+
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              Sq Ft Masterplanned
            </div>
          </div>

          <div className="text-left px-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-0.5">
              99.2%
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              On-Time Handover
            </div>
          </div>

          <div className="text-left px-4">
            <div className="font-display text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400 mb-0.5 flex items-center gap-1.5">
              <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400 inline" />
              LEED Gold
            </div>
            <div className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400 font-medium">
              100% Sustainable Grid
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
