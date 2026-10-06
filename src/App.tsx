import React, { useState, useEffect } from 'react'
import { Project } from './types'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ProjectsSection } from './components/ProjectsSection'
import { ProjectModal } from './components/ProjectModal'
import { MortgageCalculator } from './components/MortgageCalculator'
import { VisionSection } from './components/VisionSection'
import { LocationsSection } from './components/LocationsSection'
import { InquirySection } from './components/InquirySection'
import { AdminModal } from './components/AdminModal'
import { Footer } from './components/Footer'

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [inquiryTargetProject, setInquiryTargetProject] = useState<string>('')

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('aura_theme') as 'dark' | 'light' | null
    const initialTheme = savedTheme || 'dark'
    setTheme(initialTheme)
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('aura_theme', next)
      if (next === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  // Fetch Projects from API (Cloudflare Worker -> Cloudflare D1)
  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (data.success && data.projects) {
        setProjects(data.projects)
      }
    } catch (err) {
      console.warn('API fetch failed, will retry or rely on server response', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleSearch = (category: string, status: string) => {
    setActiveCategory(category)
    setActiveStatus(status)
  }

  const handleInquireProject = (project?: Project | string) => {
    const title = typeof project === 'string' ? project : project?.title || ''
    setInquiryTargetProject(title)
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white dark:selection:text-obsidian-950 transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenInquiry={() => handleInquireProject()}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onSearch={handleSearch}
          onExploreProjects={() => {
            const el = document.getElementById('projects')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* Developments Portfolio */}
        <ProjectsSection
          projects={projects}
          loading={loading}
          activeCategory={activeCategory}
          activeStatus={activeStatus}
          onSelectCategory={(cat) => {
            setActiveCategory(cat)
            setActiveStatus('All')
          }}
          onSelectProject={(project) => setSelectedProject(project)}
          onInquireProject={(project) => handleInquireProject(project)}
        />

        {/* Vision & Sustainability */}
        <VisionSection />

        {/* Financial & Mortgage Investment Calculator */}
        <MortgageCalculator
          onInquire={() => handleInquireProject()}
        />

        {/* Prime Locations */}
        <LocationsSection />

        {/* Private Consultation & Lead Capture (Writes to D1) */}
        <InquirySection
          projects={projects}
          selectedProjectTitle={inquiryTargetProject}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onBookTour={(projectTitle) => handleInquireProject(projectTitle)}
      />

      {/* Cloudflare D1 Super Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProjectUpdated={loadProjects}
      />
    </div>
  )
}

export default App
