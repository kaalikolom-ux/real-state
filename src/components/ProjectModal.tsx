import React, { useState } from 'react'
import { Project, FloorPlan } from '../types'
import { X, MapPin, Calendar, Ruler, Award, CheckCircle2, Bed, Bath, Sparkles, Building, ArrowRight, ShieldCheck } from 'lucide-react'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
  onBookTour: (projectTitle: string) => void
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onBookTour }) => {
  if (!project) return null

  const [activeImage, setActiveImage] = useState<string>(project.featured_image)
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(
    project.floor_plans && project.floor_plans.length > 0 ? project.floor_plans[0] : null
  )

  const allImages = [project.featured_image, ...(project.gallery_images || [])]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col transition-colors duration-300">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-500/30">
              {project.status}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {project.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          {/* Main Visual & Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5">
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-1">
                  {project.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400 inline" />
                  {project.location}, {project.city}
                </p>
              </div>
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-brand-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Gallery thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 text-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Starting Price</span>
              <span className="font-display text-lg font-bold text-brand-600 dark:text-brand-300">
                {project.currency}{project.price_from.toLocaleString('en-US')}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Estimated Handover</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">{project.completion_date || 'Inquire'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Total Residences</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white">{project.total_units} Bespoke Units</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Lead Architect</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-white truncate block">{project.architect}</span>
            </div>
          </div>

          {/* Architectural Description */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold mb-2">
              Vision & Architecture
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          {/* Floor Plans & Units */}
          {project.floor_plans && project.floor_plans.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-2">
                <Building className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Available Unit Configurations & Floor Plans
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {project.floor_plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                      selectedPlan?.id === plan.id
                        ? 'bg-brand-50/80 border-brand-500 shadow-md dark:bg-brand-500/10 dark:border-brand-500'
                        : 'bg-slate-50 border-slate-200 dark:bg-obsidian-950/60 dark:border-white/5 hover:border-brand-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{plan.name}</h4>
                      <span className="text-xs text-brand-600 dark:text-brand-300 font-mono font-semibold">
                        {project.currency}{plan.price_from.toLocaleString('en-US')}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-3">{plan.type}</span>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {plan.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {plan.bathrooms} Baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" /> {plan.area_sqft} sq ft
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Amenities */}
          {project.amenities && project.amenities.length > 0 && (
            <div>
              <h3 className="text-sm uppercase tracking-wider text-brand-600 dark:text-brand-400 font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                Curated Amenities & Lifestyle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {project.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 dark:bg-obsidian-950/70 border border-slate-200 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-500 dark:text-brand-400 flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-obsidian-950 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Acquisition & Private Client Advisory</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Private viewings by invitation & confidential inquiry</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose()
                onBookTour(project.title)
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white dark:text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <span>Schedule Private Tour</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
