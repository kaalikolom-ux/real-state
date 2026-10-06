import React, { useState } from 'react'
import { Project } from '../types'
import { Send, Shield, CheckCircle2, Lock, Sparkles, Building, PhoneCall, AlertCircle } from 'lucide-react'

interface InquirySectionProps {
  projects: Project[]
  selectedProjectTitle?: string
}

export const InquirySection: React.FC<InquirySectionProps> = ({ projects, selectedProjectTitle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_id: '',
    project_title: selectedProjectTitle || '',
    buyer_type: 'End-User',
    budget_range: '$2.5M - $5.0M',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = (await res.json()) as { success: boolean; message?: string; error?: string }
      if (data.success) {
        setSubmitted(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          project_id: '',
          project_title: '',
          buyer_type: 'End-User',
          budget_range: '$2.5M - $5.0M',
          message: '',
        })
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry. Please try again.')
      }
    } catch (err: any) {
      setErrorMsg('Network error. Please verify your connection or try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 relative bg-[#f4f1ea]/50 dark:bg-obsidian-900 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
              Strict Confidentiality
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-medium text-slate-900 dark:text-white tracking-tight leading-tight">
              Initiate Private Dialogue.
            </h2>

            <p className="text-sm text-slate-700 dark:text-slate-300 font-light leading-relaxed">
              Whether you are acquiring a generational family residence, structuring commercial floorplates, or seeking off-market sovereign allocations, our Senior Advisory Board provides direct, discrete representation.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Non-disclosure agreements executed prior to architectural blueprint disclosures.</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span>Direct line to Developer Partner Group within 24 operational hours.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-obsidian-950/80 border border-slate-200 dark:border-brand-500/20 text-xs font-mono text-slate-600 dark:text-slate-400 shadow-sm">
              <span className="text-brand-600 dark:text-brand-400 font-bold block mb-1">Live Database Connection:</span>
              Cloudflare D1 Serverless SQLite Edge <br />
              <span className="text-slate-500 text-[10px]">DB Cluster: real-state (735ef93c-7093...)</span>
            </div>
          </div>

          {/* Right Lead Capture Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    Inquiry Securely Recorded in D1
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you. Your dossier request has been registered directly on Cloudflare D1. A designated Managing Director will coordinate private consultation materials.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2.5 rounded-lg bg-brand-500 text-white dark:text-obsidian-950 font-semibold text-xs uppercase tracking-wider"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lord Alexander Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alexander@vancefamily.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Development of Interest
                      </label>
                      <select
                        value={formData.project_title}
                        onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
                      >
                        <option value="">General Portfolio Advisory</option>
                        {projects.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Entity / Buyer Type
                      </label>
                      <select
                        value={formData.buyer_type}
                        onChange={(e) => setFormData({ ...formData, buyer_type: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
                      >
                        <option value="End-User">Private End-User (Personal Residence)</option>
                        <option value="Investor">Private Investor / Family Office</option>
                        <option value="Institutional">Institutional Fund / Sovereign Wealth</option>
                        <option value="Broker">Authorized Broker / Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Target Capital Allocation
                      </label>
                      <select
                        value={formData.budget_range}
                        onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors cursor-pointer"
                      >
                        <option value="$1.0M - $2.5M">$1.0M – $2.5M</option>
                        <option value="$2.5M - $5.0M">$2.5M – $5.0M</option>
                        <option value="$5.0M - $10.0M">$5.0M – $10.0M</option>
                        <option value="$10.0M+">$10.0M+ Ultra-Bespoke</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Confidential Notes / Preferred Showing Date
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Specify your specific architectural preferences, penthouse or villa tier, or requested dates for private helicopter/yacht site showing..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white dark:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white dark:border-obsidian-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Confidential Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
