import React, { useState, useEffect } from 'react'
import { Building2, Compass, ShieldCheck, PhoneCall, Database, Menu, X, Sun, Moon } from 'lucide-react'

interface NavbarProps {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
  onOpenAdmin: () => void
  onOpenInquiry: (projectTitle?: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme, onOpenAdmin, onOpenInquiry }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-obsidian-950/90 backdrop-blur-md py-4 border-b border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-white dark:text-obsidian-950" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wider uppercase text-slate-900 dark:text-white block leading-none">
              AURA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-brand-600 dark:text-brand-400 uppercase font-semibold">
              Developments
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
          <a
            href="#projects"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Developments
          </a>
          <a
            href="#vision"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Architectural Vision
          </a>
          <a
            href="#calculator"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            Investment & ROI
          </a>
          <a
            href="#locations"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            Prime Locations
          </a>
          <a
            href="#contact"
            className="hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            Private Office
          </a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 text-slate-700 dark:text-brand-300 border border-slate-200 dark:border-brand-500/30 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Cloudflare D1 Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-850 dark:hover:bg-obsidian-800 text-slate-800 dark:text-brand-300 border border-slate-200 dark:border-brand-500/30 flex items-center gap-1.5 transition-colors"
            title="Access D1 Cloudflare Inquiries Database"
          >
            <Database className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
            <span>D1 Leads Hub</span>
          </button>

          <button
            onClick={() => onOpenInquiry()}
            className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white dark:text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Request Consultation
          </button>
        </div>

        {/* Mobile Hamburger & Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-700 dark:text-amber-400"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onOpenAdmin}
            className="p-2 text-brand-600 dark:text-brand-400"
            title="D1 Leads Hub"
          >
            <Database className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-obsidian-900 border-b border-slate-200 dark:border-white/10 px-6 py-6 space-y-4 shadow-xl">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 py-1"
          >
            Developments Portfolio
          </a>
          <a
            href="#vision"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 py-1"
          >
            Architectural Vision & Legacy
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 py-1"
          >
            Investment & ROI Calculator
          </a>
          <a
            href="#locations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 py-1"
          >
            Prime Locations
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-300 py-1"
          >
            Private Consultation
          </a>
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenInquiry()
              }}
              className="w-full py-3 rounded-sm bg-brand-500 text-white dark:text-obsidian-950 font-semibold text-xs uppercase tracking-wider text-center"
            >
              Request Consultation
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
