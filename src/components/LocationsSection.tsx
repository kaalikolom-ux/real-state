import React from 'react'
import { MapPin, Navigation, Anchor, Plane, Building2, Trees } from 'lucide-react'

export const LocationsSection: React.FC = () => {
  const LOCATIONS = [
    {
      name: 'Biscayne Bay Point',
      region: 'Coastal Waterfront Enclave',
      projectCount: '3 Signature Projects',
      features: ['Private Yacht Berths', '12 Mins to Private Jet Port', 'Helipad Access'],
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Grand Avenue Core',
      region: 'Central Financial & Cultural District',
      projectCount: '2 Mixed-Use Towers',
      features: ['Adjacent to Opera & Arts Pavilion', 'High-Speed Maglev Access', 'Michelin Culinary Row'],
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Pacific Escarpment Ridge',
      region: 'Highland Sanctuary & Reserve',
      projectCount: 'Exclusive Private Estates',
      features: ['2,000 Acres Protected Reserve', 'Panoramic Sunset Ridges', 'PGA Championship Golf'],
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    },
  ]

  return (
    <section id="locations" className="py-24 relative bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-brand-400 font-semibold mb-2 flex items-center justify-center gap-2">
            <Navigation className="w-4 h-4 text-brand-400" />
            Strategic Terrains
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-medium text-white tracking-tight mb-4">
            Prime Landmark Locations
          </h2>
          <p className="text-sm text-slate-400 font-light">
            Every parcel in our portfolio is acquired through decades of land-banking foresight in irreproducible geographical coordinates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LOCATIONS.map((loc, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-brand-500/40 transition-all duration-500 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-obsidian-900">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-obsidian-900/90 text-brand-300 border border-brand-500/30">
                    {loc.projectCount}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">
                    {loc.name}
                  </h3>
                  <span className="text-xs text-brand-400 font-medium block mb-4">
                    {loc.region}
                  </span>

                  <div className="space-y-2 py-3 border-t border-white/5 text-xs text-slate-300">
                    {loc.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
