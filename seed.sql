-- Seed Data for Real Estate Development Company

INSERT INTO projects (
  id, slug, title, tagline, description, category, status, location, city, 
  price_from, currency, completion_date, architect, total_units, floors, 
  featured_image, gallery_images, amenities, featured
) VALUES 
(
  'proj-1', 
  'obsidian-waterfront-residences', 
  'The Obsidian Residences', 
  'Sculptural waterfront towers redefining shoreline luxury', 
  'Rising majestically above the marina, The Obsidian is an architectural masterpiece designed for discerning collectors of fine living. Featuring unobstructed ocean horizons, private yacht slips, floor-to-ceiling acoustic glass, and curated private sky gardens for every residence.',
  'Waterfront Estate', 
  'Under Construction', 
  'Biscayne Point Island, Marina District', 
  'Miami / Coastal Harbor', 
  1850000, 
  '$', 
  'Q4 2026', 
  'Studio Zaha & Foster Partners', 
  120, 
  48,
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
  '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"]',
  '["Private Marina Berths","Helipad Access","Infinity Edge Sky Pool","Private Wine Cellars","24/7 White-Glove Concierge","State-of-the-Art Wellness Spa","Valet & Automated Parking"]',
  1
),
(
  'proj-2', 
  'aura-one-sky-tower', 
  'Aura One Financial Tower & Suites', 
  'Iconic 64-storey pinnacle of urban commerce and sky living', 
  'Positioned at the epicentre of the metropolis, Aura One combines prime corporate headquarters with exclusive upper-deck sky penthouses. Certified LEED Platinum with biophilic vertical forests, smart air purification systems, and world-class culinary destinations.',
  'Mixed-Use', 
  'Launching Soon', 
  '740 Grand Avenue, Financial Core', 
  'Metropolitan Center', 
  950000, 
  '$', 
  'Q2 2027', 
  'Kohn Pedersen Fox Associates', 
  260, 
  64,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
  '["https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"]',
  '["Biophilic Sky Atriums","Smart Building Automation","Michelin-Starred Rooftop Dining","Executive Boardrooms & Co-working Lounge","Olympic-Length Lap Pool","LEED Platinum Certified"]',
  1
),
(
  'proj-3', 
  'elysium-hills-sanctuary', 
  'Elysium Hills Sanctuary Villas', 
  'Ultra-private hillside sanctuaries nestled in protected nature', 
  'An exclusive enclave of just 24 bespoke architectural estates. Set against dramatic ridgelines, each villa integrates native stone, organic cedar timber, and zero-edge infinity pools hovering over the lush valley below.',
  'Luxury Residential', 
  'Ready to Move', 
  'Highland Crest Ridge, Reserve Way', 
  'Pacific Heights Escarpment', 
  3400000, 
  '$', 
  'Completed', 
  'SAOTA Architecture & Design', 
  24, 
  3,
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
  '["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"]',
  '["Gated 24/7 Security Enclave","Private Tennis Court & Clubhouse","Subterranean 6-Car Garages","Geothermal Energy & Solar Grid","Infinity Ridge Pools","Private Wine Tasting Pavilions"]',
  1
),
(
  'proj-4', 
  'solstice-bay-promenade', 
  'Solstice Bay Promenade Condos', 
  'Riviera-inspired beachfront living with panoramic sunsets', 
  'Boutique low-rise coastal residences celebrating the romance of Mediterranean resort architecture with modern Scandinavian minimalism. Steps away from pristine white sands and private beach clubs.',
  'Waterfront Estate', 
  'Handover 2026', 
  'Coastal Crescent Highway', 
  'Azure Coastline', 
  1250000, 
  '$', 
  'Q3 2026', 
  'Bjarke Ingels Group (BIG)', 
  78, 
  12,
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80',
  '["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80"]',
  '["Direct Beach Access","Private Beach Club & Cabanas","Outdoor Cinema Amphitheatre","Hydrotherapy Spa","Sunset Cocktail Deck","Kids Nautical Play Park"]',
  0
),
(
  'proj-5', 
  'vertex-innovation-campus', 
  'Vertex Innovation Tech Campus', 
  'The premier headquarters campus for world-leading technology & biotech', 
  'Spanning 45 acres of sustainable commercial infrastructure, Vertex offers flexible high-bay laboratory facilities, collaborative open-air plazas, and carbon-neutral operational architecture.',
  'Commercial Tower', 
  'Under Construction', 
  'Silicon Boulevard & Innovation Way', 
  'Tech Innovation Corridor', 
  4500000, 
  '$', 
  'Q1 2027', 
  'Gensler Architectural Group', 
  42, 
  18,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
  '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"]',
  '["Carbon Neutral Net-Zero Facility","Supercharged EV Fleet Hub","High-Security Data Redundancy","Auditorium & Exhibition Center","On-Site Organic Cafeterias","Wellness & Fitness Complex"]',
  0
);

-- Floor Plans
INSERT INTO floor_plans (id, project_id, name, type, bedrooms, bathrooms, area_sqft, price_from, image_url) VALUES
('fp-1', 'proj-1', 'The Horizon Suite', '2-Bedroom Panoramic', 2, 2.5, 1850, 1850000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('fp-2', 'proj-1', 'The Grand Azure Villa', '3-Bedroom Sky Villa', 3, 3.5, 2900, 2750000, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'),
('fp-3', 'proj-1', 'Imperial Duplex Penthouse', 'Duplex Penthouse', 4, 5.0, 5200, 5800000, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),

('fp-4', 'proj-2', 'Executive Metropolitan Studio', '1-Bedroom Executive', 1, 1.5, 920, 950000, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('fp-5', 'proj-2', 'The Pinnacle Residence', '2-Bedroom Panoramic', 2, 2.0, 1640, 1550000, 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80'),

('fp-6', 'proj-3', 'The Sovereign Crest Villa', 'Estate Villa A', 4, 4.5, 6100, 3400000, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'),
('fp-7', 'proj-3', 'The Royal Ridge Manor', 'Estate Villa B', 5, 6.0, 8400, 4800000, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80');

-- Initial Inquiries for Demonstration
INSERT INTO inquiries (id, name, email, phone, project_id, project_title, buyer_type, budget_range, message, status) VALUES
('inq-1', 'Alexander Vance', 'vance.familyoffice@example.com', '+1 (555) 392-8819', 'proj-1', 'The Obsidian Residences', 'Investor', '$2M - $5M', 'Looking to acquire two units on the upper floor for family portfolio. Would like to schedule an in-person site walk.', 'New'),
('inq-2', 'Dr. Sophia Reyes', 's.reyes@biocrest.com', '+1 (555) 714-2200', 'proj-3', 'Elysium Hills Sanctuary Villas', 'End-User', '$3M+', 'Inquiring regarding custom interior finishes and privacy clearance for Villa #4.', 'Tour Scheduled');
