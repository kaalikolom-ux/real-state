import React, { useState, useEffect } from 'react'
import { Building2, Compass, ShieldCheck, PhoneCall, Database, Menu, X } from 'lucide-react'

interface NavbarProps {
  onOpenAdmin: () => void
  onOpenInquiry: (projectTitle?: string) => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenInquiry }) => {
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
          ? 'bg-obsidian-950/90 backdrop-blur-md py-4 border-b border-white/10 shadow-2xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-obsidian-950" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-wider uppercase text-white block leading-none">
              AURA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-brand-400 uppercase font-semibold">
              Developments
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#projects"
            className="hover:text-brand-300 transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-brand-400" />
            Developments
          </a>
          <a
            href="#vision"
            className="hover:text-brand-300 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Architectural Vision
          </a>
          <a
            href="#calculator"
            className="hover:text-brand-300 transition-colors"
          >
            Investment & ROI
          </a>
          <a
            href="#locations"
            className="hover:text-brand-300 transition-colors"
          >
            Prime Locations
          </a>
          <a
            href="#contact"
            className="hover:text-brand-300 transition-colors"
          >
            Private Office
          </a>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cloudflare D1 Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className="px-3 py-1.5 rounded text-xs font-mono bg-obsidian-850 hover:bg-obsidian-800 text-brand-300 border border-brand-500/30 flex items-center gap-1.5 transition-colors"
            title="Access D1 Cloudflare Inquiries Database"
          >
            <Database className="w-3.5 h-3.5 text-brand-400" />
            <span>D1 Leads Hub</span>
          </button>

          <button
            onClick={() => onOpenInquiry()}
            className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-obsidian-950 font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 flex items-center gap-2"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Request Consultation
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAdmin}
            className="p-2 text-brand-400 hover:text-white"
            title="D1 Leads Hub"
          >
            <Database className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-obsidian-900 border-b border-white/10 px-6 py-6 space-y-4">
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-brand-300 py-1"
          >
            Developments Portfolio
          </a>
          <a
            href="#vision"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-brand-300 py-1"
          >
            Architectural Vision & Legacy
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-brand-300 py-1"
          >
            Investment & ROI Calculator
          </a>
          <a
            href="#locations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-brand-300 py-1"
          >
            Prime Locations
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-brand-300 py-1"
          >
            Private Consultation
          </a>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenInquiry()
              }}
              className="w-full py-3 rounded-sm bg-brand-500 text-obsidian-950 font-semibold text-xs uppercase tracking-wider text-center"
            >
              Request Consultation
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
