import React, { useState } from 'react'
import { Project } from '../types'
import { MapPin, Calendar, Ruler, Award, ArrowUpRight, CheckCircle2, SlidersHorizontal } from 'lucide-react'

interface ProjectsSectionProps {
  projects: Project[]
  loading: boolean
  activeCategory: string
  activeStatus: string
  onSelectCategory: (cat: string) => void
  onSelectProject: (project: Project) => void
  onInquireProject: (project: Project) => void
}

const CATEGORIES = ['All', 'Waterfront Estate', 'Luxury Residential', 'Mixed-Use', 'Commercial Tower']

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  loading,
  activeCategory,
  activeStatus,
  onSelectCategory,
  onSelectProject,
  onInquireProject,
}) => {
  const filteredProjects = projects.filter((p) => {
    const matchCategory = activeCategory === 'All' || p.category === activeCategory
    const matchStatus = activeStatus === 'All' || p.status === activeStatus
    return matchCategory && matchStatus
  })

  const formatPrice = (price: number, currency: string = '$') => {
    return `${currency}${price.toLocaleString('en-US')}`
  }

  return (
    <section id="projects" className="py-24 relative bg-obsidian-900 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold mb-2 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-brand-400 inline-block" />
              Signature Portfolio
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight">
              Curated Developments
            </h2>
          </div>

          {/* Filter Categories Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-obsidian-950/80 rounded-xl border border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-500 text-obsidian-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-obsidian-950/50 rounded-2xl border border-white/5">
            <SlidersHorizontal className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-1">No developments match your filter</h3>
            <p className="text-sm text-slate-400 mb-4">Try clearing your filters to explore our full landmark portfolio.</p>
            <button
              onClick={() => onSelectCategory('All')}
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded bg-brand-500 text-obsidian-950"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-brand-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/11] overflow-hidden bg-obsidian-950">
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent opacity-80" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-obsidian-950/90 text-brand-300 border border-brand-500/30 backdrop-blur-md">
                      {project.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wider bg-black/60 text-slate-300 backdrop-blur-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Price Tag in Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block">
                        Starting From
                      </span>
                      <span className="font-display text-2xl font-bold text-white">
                        {formatPrice(project.price_from, project.currency)}
                      </span>
                    </div>
                    {project.completion_date && (
                      <span className="text-xs text-brand-300 bg-obsidian-900/90 px-2.5 py-1 rounded border border-brand-400/20 font-mono">
                        {project.completion_date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-300 transition-colors mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {project.tagline || project.description}
                    </p>

                    {/* Metadata Strip */}
                    <div className="space-y-2 py-3 border-t border-b border-white/5 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      {project.architect && (
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                          <span className="truncate text-slate-400">Architect: {project.architect}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 flex items-center gap-3">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-white/10 hover:border-white/20"
                    >
                      <span>Explore Plans</span>
                      <ArrowUpRight className="w-4 h-4 text-brand-400" />
                    </button>

                    <button
                      onClick={() => onInquireProject(project)}
                      className="py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
