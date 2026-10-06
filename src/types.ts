export interface FloorPlan {
  id: string
  project_id: string
  name: string
  type: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  price_from: number
  image_url?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  category: 'Luxury Residential' | 'Commercial Tower' | 'Waterfront Estate' | 'Mixed-Use' | string
  status: 'Launching Soon' | 'Under Construction' | 'Ready to Move' | 'Handover 2026' | string
  location: string
  city: string
  price_from: number
  currency: string
  completion_date: string
  architect: string
  total_units: number
  floors?: number
  featured_image: string
  gallery_images: string[]
  amenities: string[]
  featured: number
  floor_plans?: FloorPlan[]
  created_at: string
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  project_id?: string
  project_title?: string
  buyer_type: string
  budget_range: string
  message: string
  status: 'New' | 'Contacted' | 'Tour Scheduled' | 'Negotiating' | 'Closed'
  created_at: string
}

export interface CompanyStats {
  delivered_value: string
  total_sqft: string
  projects_completed: string
  on_time_delivery: string
  sustainability_rating: string
}
