import React, { useState, useEffect } from 'react'
import { Project, Inquiry } from '../types'
import {
  X,
  Database,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Lock,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  User,
  Filter,
  Search,
  ExternalLink,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectUpdated: () => void
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onProjectUpdated,
}) => {
  if (!isOpen) return null

  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aura_admin_token'))
  const [loginEmail, setLoginEmail] = useState('notabene.inc@gmail.com')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Active Tab: 'properties' | 'inquiries' | 'database'
  const [activeTab, setActiveTab] = useState<'properties' | 'inquiries' | 'database'>('properties')

  // Projects State
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [searchProjectQuery, setSearchProjectQuery] = useState('')

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loadingInquiries, setLoadingInquiries] = useState(false)
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All')

  // Project Add / Edit Modal Form State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formSaving, setFormSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // Check Token Validity or load data
  useEffect(() => {
    if (token) {
      loadProjectsData()
      loadInquiriesData()
    }
  }, [token])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail.trim(), password: loginPassword }),
      })
      const data = await res.json()
      if (data.success && data.token) {
        localStorage.setItem('aura_admin_token', data.token)
        setToken(data.token)
        setLoginPassword('')
      } else {
        setLoginError(data.error || 'Invalid credentials.')
      }
    } catch (err: any) {
      setLoginError('Network error logging in. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_token')
    setToken(null)
  }

  // Fetch Projects from API
  const loadProjectsData = async () => {
    setLoadingProjects(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success && data.projects) {
        setProjects(data.projects)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Fetch Inquiries from API
  const loadInquiriesData = async () => {
    setLoadingInquiries(true)
    try {
      const res = await fetch('/api/inquiries')
      const data = await res.json()
      if (data.success && data.inquiries) {
        setInquiries(data.inquiries)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingInquiries(false)
    }
  }

  // Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from Cloudflare D1? This cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
        onProjectUpdated()
      } else {
        alert(data.error || 'Failed to delete project.')
      }
    } catch (err: any) {
      alert('Error deleting project from D1: ' + err.message)
    }
  }

  // Open Form for Adding New Project
  const handleOpenAddProject = () => {
    setEditingProject({
      id: '',
      title: '',
      slug: '',
      tagline: '',
      description: '',
      category: 'Luxury Residential',
      status: 'Under Construction',
      location: '',
      city: '',
      price_from: 1500000,
      currency: '$',
      completion_date: 'Q4 2026',
      architect: '',
      total_units: 48,
      floors: 12,
      featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      gallery_images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      ],
      amenities: ['Infinity Sky Pool', 'Helipad Access', '24/7 White-Glove Concierge', 'LEED Platinum'],
      featured: 1,
    })
    setFormError('')
    setIsFormOpen(true)
  }

  // Open Form for Editing Existing Project
  const handleOpenEditProject = (proj: Project) => {
    setEditingProject({ ...proj })
    setFormError('')
    setIsFormOpen(true)
  }

  // Save Project (POST or PUT)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject?.title || !editingProject.price_from || !editingProject.location) {
      setFormError('Title, price, and location are required.')
      return
    }

    setFormSaving(true)
    setFormError('')

    const isEdit = !!editingProject.id
    const url = isEdit ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProject),
      })
      const data = await res.json()
      if (data.success) {
        setIsFormOpen(false)
        setEditingProject(null)
        await loadProjectsData()
        onProjectUpdated()
      } else {
        setFormError(data.error || 'Failed to save property.')
      }
    } catch (err: any) {
      setFormError('Network error saving to D1: ' + err.message)
    } finally {
      setFormSaving(false)
    }
  }

  // Update Inquiry Status
  const handleStatusChange = async (id: string, newStatus: string) => {
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
    }
  }

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this inquiry from Cloudflare D1?')) return
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchProjectQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProjectQuery.toLowerCase())
  )

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter === 'All') return true
    return inq.status === inquiryStatusFilter
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-brand-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col transition-colors duration-300">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Super Admin Management Portal
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  Edge D1 Active
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                DB ID: 735ef93c-7093-47c4-a22d-f90bc9310119
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {token && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
                title="Sign out of Super Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In State: Super Admin Login Screen */}
        {!token ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Super Admin Authentication
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Enter your administrative credentials to manage developments, floor plans, and inquiries in Cloudflare D1.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Super Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Security Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white dark:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Authorize & Access D1 Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Admin Dashboard */
          <>
            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-slate-100/70 dark:bg-obsidian-950/80 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'properties'
                      ? 'bg-brand-500 text-white dark:text-obsidian-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Properties Portfolio ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'inquiries'
                      ? 'bg-brand-500 text-white dark:text-obsidian-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Inquiries & Leads ({inquiries.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('database')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === 'database'
                      ? 'bg-brand-500 text-white dark:text-obsidian-950 shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>D1 Health & Stats</span>
                </button>
              </div>

              {activeTab === 'properties' && (
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Property</span>
                </button>
              )}
            </div>

            {/* Main Content Area */}
            <div className="overflow-y-auto p-6 flex-1 space-y-6">

              {/* TAB 1: PROPERTIES MANAGEMENT */}
              {activeTab === 'properties' && (
                <div className="space-y-4">
                  {/* Search bar */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Search properties by title, category, or location..."
                        value={searchProjectQuery}
                        onChange={(e) => setSearchProjectQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <button
                      onClick={loadProjectsData}
                      disabled={loadingProjects}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300"
                      title="Reload from D1"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingProjects ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Properties Grid */}
                  {loadingProjects ? (
                    <div className="text-center py-20">
                      <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Fetching developments from Cloudflare D1...</span>
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 dark:bg-obsidian-950/50 rounded-xl border border-slate-200 dark:border-white/5">
                      <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">No properties found.</p>
                      <button
                        onClick={handleOpenAddProject}
                        className="mt-3 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded bg-brand-500 text-white dark:text-obsidian-950"
                      >
                        Add Your First Property
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredProjects.map((project) => (
                        <div
                          key={project.id}
                          className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4 hover:border-brand-500/40 transition-all shadow-sm"
                        >
                          <div>
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-slate-200 dark:bg-obsidian-900">
                              <img
                                src={project.featured_image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-2 left-2 flex gap-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 text-brand-300">
                                  {project.status}
                                </span>
                              </div>
                            </div>

                            <h4 className="font-display font-bold text-base text-slate-900 dark:text-white mb-1">
                              {project.title}
                            </h4>
                            <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold block mb-2">
                              {project.currency}{project.price_from.toLocaleString('en-US')} • {project.category}
                            </span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {project.location}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-2">
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                              {project.id}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProject(project)}
                                className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white transition-colors"
                                title="Edit Property"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id, project.title)}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                                title="Delete Property from D1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: INQUIRIES & LEADS MANAGEMENT */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-600 dark:text-slate-400">Filter by Stage:</span>
                      {['All', 'New', 'Contacted', 'Tour Scheduled', 'Closed'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryStatusFilter(st)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            inquiryStatusFilter === st
                              ? 'bg-brand-500 text-white dark:text-obsidian-950 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={loadInquiriesData}
                      disabled={loadingInquiries}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {loadingInquiries ? (
                    <div className="text-center py-20">
                      <RefreshCw className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-2" />
                      <span className="text-xs text-slate-500">Querying D1 inquiries table...</span>
                    </div>
                  ) : filteredInquiries.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 dark:bg-obsidian-950/50 rounded-xl border border-slate-200 dark:border-white/5">
                      <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">No inquiries found.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col md:flex-row justify-between gap-4"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                                <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                                {inq.name}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
                                {inq.buyer_type}
                              </span>
                              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                                Budget: {inq.budget_range}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {inq.email}
                              </span>
                              {inq.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                                  {inq.phone}
                                </span>
                              )}
                              <span className="text-brand-600 dark:text-brand-300 font-medium">
                                Project: {inq.project_title || 'General Advisory'}
                              </span>
                            </div>

                            {inq.message && (
                              <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-obsidian-900/60 p-3 rounded-lg border border-slate-200 dark:border-white/5 italic">
                                "{inq.message}"
                              </p>
                            )}

                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                              ID: {inq.id} • Registered: {new Date(inq.created_at).toLocaleString()}
                            </div>
                          </div>

                          <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-2">
                              <select
                                value={inq.status}
                                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                className="bg-white dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer font-medium"
                              >
                                <option value="New">New Lead</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Tour Scheduled">Tour Scheduled</option>
                                <option value="Negotiating">Negotiating</option>
                                <option value="Closed">Closed</option>
                              </select>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DATABASE HEALTH & STATS */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 text-center">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Total Properties in D1</span>
                      <span className="font-display text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 text-center">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Inquiries Recorded</span>
                      <span className="font-display text-3xl font-bold text-brand-600 dark:text-brand-300">{inquiries.length}</span>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 text-center">
                      <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Database Type</span>
                      <span className="font-display text-xl font-bold text-emerald-600 dark:text-emerald-400">Serverless SQLite</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-3 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-slate-500">Database Binding:</span>
                      <span className="text-slate-800 dark:text-white font-bold">env.DB (real-state)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-slate-500">UUID:</span>
                      <span className="text-slate-800 dark:text-white">735ef93c-7093-47c4-a22d-f90bc9310119</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                      <span className="text-slate-500">Super Admin User:</span>
                      <span className="text-slate-800 dark:text-white font-bold">notabene.inc@gmail.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cloudflare Edge Region:</span>
                      <span className="text-emerald-600 dark:text-emerald-400">Global Anycast Network</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* PROPERTY ADD / EDIT MODAL DRAWER */}
        {isFormOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-white dark:bg-obsidian-900 border border-slate-300 dark:border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {editingProject.id ? 'Edit Development Property' : 'Add New Development Property'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solstice Promenade Residences"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Collection Category
                    </label>
                    <select
                      value={editingProject.category || 'Luxury Residential'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Waterfront Estate">Waterfront Estate</option>
                      <option value="Luxury Residential">Luxury Residential</option>
                      <option value="Mixed-Use">Mixed-Use</option>
                      <option value="Commercial Tower">Commercial Tower</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Construction Stage
                    </label>
                    <select
                      value={editingProject.status || 'Under Construction'}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    >
                      <option value="Under Construction">Under Construction</option>
                      <option value="Launching Soon">Launching Soon</option>
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Handover 2026">Handover 2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Starting Price ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="100000"
                      value={editingProject.price_from || 0}
                      onChange={(e) => setEditingProject({ ...editingProject, price_from: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Handover
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Q4 2026"
                      value={editingProject.completion_date || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, completion_date: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Location / Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Biscayne Harbor Point"
                      value={editingProject.location || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Lead Architect
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Foster & Partners / Zaha Hadid"
                      value={editingProject.architect || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, architect: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Total Units
                    </label>
                    <input
                      type="number"
                      value={editingProject.total_units || 1}
                      onChange={(e) => setEditingProject({ ...editingProject, total_units: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Floors
                    </label>
                    <input
                      type="number"
                      value={editingProject.floors || 1}
                      onChange={(e) => setEditingProject({ ...editingProject, floors: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingProject.featured_image || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, featured_image: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="Sculptural waterfront towers redefining shoreline luxury"
                    value={editingProject.tagline || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Architectural Narrative & Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the architectural concept, materials, and living experience..."
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-obsidian-950 border border-slate-300 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured_check"
                    checked={editingProject.featured === 1}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked ? 1 : 0 })}
                    className="rounded accent-brand-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="featured_check" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    Display as Featured Hero Landmark
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSaving}
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white dark:text-obsidian-950 font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {formSaving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save to Cloudflare D1</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
