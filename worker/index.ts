import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

// API: Health / System Status
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'real-state-edge-api',
    region: c.req.raw.cf?.colo || 'global',
  })
})

// API: Company Stats & Highlights
app.get('/api/stats', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT key, value FROM company_stats').all()
    const statsMap: Record<string, string> = {}
    for (const row of results as { key: string; value: string }[]) {
      statsMap[row.key] = row.value
    }
    return c.json({ success: true, stats: statsMap })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: List Projects (supports filtering by category, status, featured)
app.get('/api/projects', async (c) => {
  try {
    const category = c.req.query('category')
    const status = c.req.query('status')
    const featured = c.req.query('featured')

    let query = 'SELECT * FROM projects WHERE 1=1'
    const params: any[] = []

    if (category && category !== 'All') {
      query += ' AND category = ?'
      params.push(category)
    }
    if (status && status !== 'All') {
      query += ' AND status = ?'
      params.push(status)
    }
    if (featured === 'true' || featured === '1') {
      query += ' AND featured = 1'
    }

    query += ' ORDER BY featured DESC, created_at DESC'

    const stmt = c.env.DB.prepare(query)
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()

    // Parse JSON strings safely
    const formatted = (results || []).map((p: any) => ({
      ...p,
      gallery_images: p.gallery_images ? JSON.parse(p.gallery_images) : [],
      amenities: p.amenities ? JSON.parse(p.amenities) : [],
    }))

    return c.json({ success: true, count: formatted.length, projects: formatted })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Single Project Details + Floor Plans
app.get('/api/projects/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const project = await c.env.DB.prepare(
      'SELECT * FROM projects WHERE id = ? OR slug = ?'
    ).bind(id, id).first()

    if (!project) {
      return c.json({ success: false, error: 'Project not found' }, 404)
    }

    const { results: floorPlans } = await c.env.DB.prepare(
      'SELECT * FROM floor_plans WHERE project_id = ? ORDER BY area_sqft ASC'
    ).bind(project.id).all()

    const parsedProject = {
      ...project,
      gallery_images: project.gallery_images ? JSON.parse(project.gallery_images as string) : [],
      amenities: project.amenities ? JSON.parse(project.amenities as string) : [],
      floor_plans: floorPlans || [],
    }

    return c.json({ success: true, project: parsedProject })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Submit Buyer / Investor Inquiry (Lead Capture to Cloudflare D1)
app.post('/api/inquiries', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, phone, project_id, project_title, buyer_type, budget_range, message } = body

    if (!name || !email) {
      return c.json({ success: false, error: 'Name and email are required' }, 400)
    }

    const id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    await c.env.DB.prepare(`
      INSERT INTO inquiries (
        id, name, email, phone, project_id, project_title, buyer_type, budget_range, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `).bind(
      id,
      name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      project_id || null,
      project_title || 'General Consultation',
      buyer_type || 'End-User',
      budget_range || 'Flexible',
      message || '',
    ).run()

    return c.json({
      success: true,
      message: 'Inquiry received. Our executive advisor will contact you within 24 hours.',
      inquiry_id: id,
    })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Get Inquiries (for Admin / Agent Dashboard)
app.get('/api/inquiries', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 100'
    ).all()
    return c.json({ success: true, count: results.length, inquiries: results })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Update Inquiry Status
app.patch('/api/inquiries/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { status } = await c.req.json()

    if (!status) {
      return c.json({ success: false, error: 'Status is required' }, 400)
    }

    await c.env.DB.prepare(
      'UPDATE inquiries SET status = ? WHERE id = ?'
    ).bind(status, id).run()

    return c.json({ success: true, message: 'Status updated successfully' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Fallback: Hand off static assets to Cloudflare Assets binding
app.all('*', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw)
  }
  return c.text('Cloudflare Worker is running.', 200)
})

export default app
