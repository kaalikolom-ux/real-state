import React, { useState, useEffect } from 'react'
import { Inquiry } from '../types'
import { X, Database, RefreshCw, CheckCircle, Clock, Calendar, Mail, Phone, User, Filter, AlertCircle } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('All')

  const fetchInquiries = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries')
      const data = (await res.json()) as { success: boolean; inquiries?: Inquiry[] }
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq))
        )
      }
    } catch (e) {
      console.error(e)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterStatus === 'All') return true
    return inq.status === filterStatus
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-obsidian-900 border border-brand-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-obsidian-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white">Cloudflare D1 Leads Hub</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Edge D1
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                DB: real-state (735ef93c-7093-47c4-a22d-f90bc9310119)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Refresh D1 Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Filter Bar */}
        <div className="px-6 py-3 bg-obsidian-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Filter by Stage:</span>
            {['All', 'New', 'Contacted', 'Tour Scheduled', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterStatus === st
                    ? 'bg-brand-500 text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-white/5'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-slate-400">
            Total Leads: {filteredInquiries.length}
          </span>
        </div>

        {/* Inquiries Table / Feed */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {loading ? (
            <div className="text-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Querying Cloudflare D1 SQLite Database...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-16 bg-obsidian-950/50 rounded-xl border border-white/5">
              <Database className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No inquiries found in this filter.</p>
              <p className="text-xs text-slate-400">Submit an inquiry on the front page to see it appear in real-time!</p>
            </div>
          ) : (
            filteredInquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 rounded-xl bg-obsidian-950 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-400" />
                      {inq.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20">
                      {inq.buyer_type}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      Budget: {inq.budget_range}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {inq.email}
                    </span>
                    {inq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {inq.phone}
                      </span>
                    )}
                    <span className="text-brand-300 font-medium">
                      Project: {inq.project_title || 'General Advisory'}
                    </span>
                  </div>

                  {inq.message && (
                    <p className="text-xs text-slate-300 bg-obsidian-900/60 p-3 rounded-lg border border-white/5 italic">
                      "{inq.message}"
                    </p>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono">
                    ID: {inq.id} • Registered: {new Date(inq.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                    Lead Status
                  </span>
                  <select
                    value={inq.status}
                    disabled={updatingId === inq.id}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className="bg-obsidian-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer font-medium"
                  >
                    <option value="New">New Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Tour Scheduled">Tour Scheduled</option>
                    <option value="Negotiating">Negotiating</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-obsidian-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Connected via Cloudflare Worker API & Cloudflare D1 SQLite</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
