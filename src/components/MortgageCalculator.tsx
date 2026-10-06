import React, { useState } from 'react'
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, CheckCircle } from 'lucide-react'

interface MortgageCalculatorProps {
  onInquire: () => void
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ onInquire }) => {
  const [propertyPrice, setPropertyPrice] = useState(1850000)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25)
  const [loanTermYears, setLoanTermYears] = useState(25)
  const [interestRate, setInterestRate] = useState(5.5)

  // Calculations
  const downPayment = (propertyPrice * downPaymentPercent) / 100
  const loanPrincipal = propertyPrice - downPayment

  const monthlyRate = interestRate / 100 / 12
  const totalMonths = loanTermYears * 12

  const monthlyPayment =
    monthlyRate > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanPrincipal / totalMonths

  // 5-year estimated capital appreciation at conservative 6.2% CAGR
  const fiveYearValue = propertyPrice * Math.pow(1 + 0.062, 5)
  const projectedAppreciation = fiveYearValue - propertyPrice

  return (
    <section id="calculator" className="py-24 relative bg-white dark:bg-obsidian-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 font-semibold mb-2 flex items-center justify-center gap-2">
            <Calculator className="w-4 h-4 text-brand-500 dark:text-brand-400" />
            Financial Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-medium text-slate-900 dark:text-white tracking-tight mb-4">
            Investment & Payment Modeling
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
            Model your acquisition structure with flexible developer milestone payment schedules and institutional lending options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-white/10 space-y-6">
            {/* Property Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Acquisition Value
                </label>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  ${propertyPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500000"
                max="10000000"
                step="50000"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>$500K</span>
                <span>$5.0M</span>
                <span>$10.0M+</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Down Payment ({downPaymentPercent}%)
                </label>
                <span className="font-mono text-base font-bold text-brand-600 dark:text-brand-300">
                  ${Math.round(downPayment).toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>

            {/* Term & Interest Rate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Financing Horizon
                </label>
                <select
                  value={loanTermYears}
                  onChange={(e) => setLoanTermYears(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value={15}>15 Years (Accelerated)</option>
                  <option value={20}>20 Years (Standard)</option>
                  <option value={25}>25 Years (Optimal)</option>
                  <option value={30}>30 Years (Extended)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Indicative Interest Rate ({interestRate}%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="12"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Developer Staged Payment Plans:</strong> We offer 20/80 and 40/60 construction-linked milestones with 0% interest during structural build stages.
              </span>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 glass-panel-gold p-8 rounded-2xl shadow-2xl relative">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-700 dark:text-brand-400 mb-1">
              Estimated Monthly Capital Outlay
            </div>
            <div className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              ${Math.round(monthlyPayment).toLocaleString()}
              <span className="text-sm font-sans font-normal text-slate-500 dark:text-slate-400"> / month</span>
            </div>

            <div className="space-y-3.5 py-6 border-t border-b border-brand-500/20 dark:border-white/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Total Borrowed Principal:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  ${Math.round(loanPrincipal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Initial Equity / Down Payment:</span>
                <span className="font-mono font-semibold text-brand-600 dark:text-brand-300">
                  ${Math.round(downPayment).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Estimated 5-Yr Asset Growth:
                </span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  +${Math.round(projectedAppreciation).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={onInquire}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white dark:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-500/20 text-center"
            >
              Request Custom Investor Dossier
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
