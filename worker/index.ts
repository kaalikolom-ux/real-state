import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Env {
  DB: D1Database
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())

const ADMIN_EMAIL = 'notabene.inc@gmail.com'
const ADMIN_PASS = 'nIncttps;(/)+88@1711583165ninC'
const TOKEN_SECRET = 'aura-super-admin-cf-secret-2026'

async function generateToken(email: string): Promise<string> {
  const payload = {
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }
  const payloadStr = JSON.stringify(payload)
  const base64Payload = btoa(payloadStr)

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(base64Payload)
  )
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return `${base64Payload}.${base64Sig}`
}

async function verifyToken(token?: string | null): Promise<boolean> {
  if (!token) return false
  const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
  const parts = cleanToken.split('.')
  if (parts.length !== 2) return false
  const [base64Payload, base64Sig] = parts
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(TOKEN_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    const sigBytes = Uint8Array.from(atob(base64Sig), (c) => c.charCodeAt(0))
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(base64Payload)
    )
    if (!valid) return false

    const payload = JSON.parse(atob(base64Payload))
    if (payload.exp < Date.now()) return false
    return payload.email === ADMIN_EMAIL
  } catch {
    return false
  }
}

// API: Health / System Status
app.get('/api/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'real-state-edge-api',
    region: c.req.raw.cf?.colo || 'global',
  })
})

// API: Super Admin Login
app.post('/api/auth/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    if (username === ADMIN_EMAIL && password === ADMIN_PASS) {
      const token = await generateToken(username)
      return c.json({
        success: true,
        token,
        user: {
          email: ADMIN_EMAIL,
          role: 'Super Admin',
          name: 'Notabene Inc.',
        },
      })
    }
    return c.json({ success: false, error: 'Invalid username or password.' }, 401)
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// API: Verify Current Auth Token
app.get('/api/auth/verify', async (c) => {
  const authHeader = c.req.header('Authorization')
  const isValid = await verifyToken(authHeader)
  if (isValid) {
    return c.json({ success: true, user: { email: ADMIN_EMAIL, role: 'Super Admin' } })
  }
  return c.json({ success: false, error: 'Unauthorized or token expired' }, 401)
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

// ----------------- ADMIN CRUD FOR PROJECTS ----------------- //

// Admin: Create New Property
app.post('/api/admin/projects', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!(await verifyToken(authHeader))) {
    return c.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, 401)
  }

  try {
    const body = await c.req.json()
    const {
      title,
      slug,
      tagline,
      description,
      category,
      status,
      location,
      city,
      price_from,
      currency,
      completion_date,
      architect,
      total_units,
      floors,
      featured_image,
      gallery_images,
      amenities,
      featured,
    } = body

    if (!title || !price_from || !category || !location) {
      return c.json({ success: false, error: 'Title, price, category, and location are required' }, 400)
    }

    const id = body.id || `proj-${Date.now()}`
    const finalSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')

    const galleryJson = typeof gallery_images === 'string' ? gallery_images : JSON.stringify(gallery_images || [])
    const amenitiesJson = typeof amenities === 'string' ? amenities : JSON.stringify(amenities || [])

    await c.env.DB.prepare(`
      INSERT INTO projects (
        id, slug, title, tagline, description, category, status, location, city,
        price_from, currency, completion_date, architect, total_units, floors,
        featured_image, gallery_images, amenities, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      finalSlug,
      title,
      tagline || '',
      description || '',
      category || 'Luxury Residential',
      status || 'Under Construction',
      location,
      city || '',
      Number(price_from),
      currency || '$',
      completion_date || '',
      architect || '',
      Number(total_units) || 1,
      Number(floors) || 1,
      featured_image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      galleryJson,
      amenitiesJson,
      featured ? 1 : 0
    ).run()

    return c.json({ success: true, message: 'Property created successfully in D1', id })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Admin: Edit / Update Property
app.put('/api/admin/projects/:id', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!(await verifyToken(authHeader))) {
    return c.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, 401)
  }

  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const {
      title,
      slug,
      tagline,
      description,
      category,
      status,
      location,
      city,
      price_from,
      currency,
      completion_date,
      architect,
      total_units,
      floors,
      featured_image,
      gallery_images,
      amenities,
      featured,
    } = body

    const galleryJson = typeof gallery_images === 'string' ? gallery_images : JSON.stringify(gallery_images || [])
    const amenitiesJson = typeof amenities === 'string' ? amenities : JSON.stringify(amenities || [])

    await c.env.DB.prepare(`
      UPDATE projects SET
        title = ?, slug = ?, tagline = ?, description = ?, category = ?, status = ?,
        location = ?, city = ?, price_from = ?, currency = ?, completion_date = ?,
        architect = ?, total_units = ?, floors = ?, featured_image = ?,
        gallery_images = ?, amenities = ?, featured = ?
      WHERE id = ?
    `).bind(
      title,
      slug,
      tagline || '',
      description || '',
      category,
      status,
      location,
      city || '',
      Number(price_from),
      currency || '$',
      completion_date || '',
      architect || '',
      Number(total_units) || 1,
      Number(floors) || 1,
      featured_image,
      galleryJson,
      amenitiesJson,
      featured ? 1 : 0,
      id
    ).run()

    return c.json({ success: true, message: 'Property updated successfully in D1' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// Admin: Delete Property
app.delete('/api/admin/projects/:id', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!(await verifyToken(authHeader))) {
    return c.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, 401)
  }

  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM floor_plans WHERE project_id = ?').bind(id).run()
    await c.env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run()
    return c.json({ success: true, message: 'Property and associated floor plans deleted from D1' })
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500)
  }
})

// ----------------- INQUIRIES & LEADS ----------------- //

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
      message || ''
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

// Admin: Delete Inquiry
app.delete('/api/admin/inquiries/:id', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!(await verifyToken(authHeader))) {
    return c.json({ success: false, error: 'Unauthorized. Super Admin access required.' }, 401)
  }

  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(id).run()
    return c.json({ success: true, message: 'Inquiry deleted successfully' })
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
