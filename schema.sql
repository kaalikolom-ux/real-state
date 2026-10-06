-- Cloudflare D1 SQLite Schema for Real Estate Development Company
DROP TABLE IF EXISTS floor_plans;
DROP TABLE IF EXISTS inquiries;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS company_stats;

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL, -- 'Luxury Residential', 'Commercial Tower', 'Waterfront Estate', 'Mixed-Use'
  status TEXT NOT NULL,   -- 'Launching Soon', 'Under Construction', 'Ready to Move', 'Handover 2026'
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  price_from INTEGER NOT NULL,
  currency TEXT DEFAULT '$',
  completion_date TEXT,
  architect TEXT,
  total_units INTEGER,
  floors INTEGER,
  featured_image TEXT NOT NULL,
  gallery_images TEXT, -- JSON array of URLs
  amenities TEXT,      -- JSON array of strings
  featured INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE floor_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- '1-Bedroom Executive', '2-Bedroom Panoramic', '3-Bedroom Sky Villa', 'Duplex Penthouse'
  bedrooms INTEGER DEFAULT 1,
  bathrooms REAL DEFAULT 1,
  area_sqft INTEGER NOT NULL,
  price_from INTEGER NOT NULL,
  image_url TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_id TEXT,
  project_title TEXT,
  buyer_type TEXT DEFAULT 'End-User', -- 'End-User', 'Investor', 'Broker'
  budget_range TEXT,
  message TEXT,
  status TEXT DEFAULT 'New', -- 'New', 'Contacted', 'Tour Scheduled', 'Negotiating', 'Closed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE company_stats (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR REPLACE INTO company_stats (key, value) VALUES 
('delivered_value', '$2.4 Billion+'),
('total_sqft', '4.2M+ Sq Ft'),
('projects_completed', '18'),
('on_time_delivery', '99.2%'),
('sustainability_rating', '100% LEED Gold & Platinum Certified');
