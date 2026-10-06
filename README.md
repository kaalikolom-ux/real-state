# AURA Real Estate Developments — Edge Web Platform

A luxury real estate development company website engineered with **Cloudflare Workers**, **Cloudflare D1 (Serverless SQLite)**, **Cloudflare Pages / Static Assets**, and **GitHub**.

- **Production URL:** [https://real-state.notabeneinc.workers.dev](https://real-state.notabeneinc.workers.dev)
- **Repository:** [https://github.com/kaalikolom-ux/real-state.git](https://github.com/kaalikolom-ux/real-state.git)
- **Cloudflare D1 Database:** `real-state` (`735ef93c-7093-47c4-a22d-f90bc9310119`)

---

## 🏛️ Features

1. **Signature Developments Portfolio**: Filter luxury towers, waterfront estates, and commercial campuses by category, construction phase, and price.
2. **Interactive Architectural Explorer**: Detailed modal view for each project featuring high-resolution galleries, unit specs, architects, and floor plans.
3. **Interactive Floor Plans**: Switch between 1-bedroom, 2-bedroom, Sky Villas, and Penthouses with square footage and pricing.
4. **Financial Architecture & Mortgage Calculator**: Real-time modeling for acquisition values, down payments, loan terms, and projected 5-year capital appreciation.
5. **Direct Lead Capture to Cloudflare D1**: Private buyer, family office, and institutional inquiries are recorded directly to Cloudflare D1 SQLite.
6. **Live Cloudflare D1 Leads Hub**: Embedded dashboard to view, filter, and update lead stages (`New`, `Contacted`, `Tour Scheduled`, `Closed`) in real time.
7. **Architectural Manifesto & Locations**: Highlighting LEED Platinum certification, biophilic engineering, and strategic terrain landmarks.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **Edge Backend:** Cloudflare Workers with [Hono](https://hono.dev/)
- **Database:** Cloudflare D1 Serverless SQLite (Global read replication)
- **Static Assets:** Cloudflare Edge Assets Binding (`ASSETS`)
- **Package Manager:** [Bun](https://bun.sh/)
- **Deployment:** Wrangler CLI

---

## 📂 Project Structure

```
real-state/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Sticky luxury navigation & quick triggers
│   │   ├── Hero.tsx               # Cinematic hero with live search filters
│   │   ├── ProjectsSection.tsx    # Portfolio grid with dynamic filters & badges
│   │   ├── ProjectModal.tsx       # Deep project detail, gallery, & floor plans
│   │   ├── MortgageCalculator.tsx # Investment & payment modeling calculator
│   │   ├── VisionSection.tsx      # Developer manifesto & sustainability
│   │   ├── LocationsSection.tsx   # Strategic terrains showcase
│   │   ├── InquirySection.tsx     # Lead capture form saving to D1
│   │   ├── AdminModal.tsx         # Live D1 inquiries manager
│   │   └── Footer.tsx             # Global offices & compliance
│   ├── types.ts                   # TypeScript interfaces
│   ├── App.tsx                    # Root layout & state
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Tailwind styles & luxury palette
├── worker/
│   └── index.ts                   # Edge API (Hono + D1 database queries)
├── schema.sql                     # D1 Database schema definition
├── seed.sql                       # Initial sample luxury projects & leads
├── wrangler.jsonc                 # Cloudflare Worker & D1 binding configuration
├── vite.config.ts                 # Vite bundler configuration
└── package.json                   # Dependencies & run scripts
```

---

## 🚀 Local Development

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Run local frontend:**
   ```bash
   bun run dev
   ```

3. **Run local worker:**
   ```bash
   bun x wrangler dev
   ```

---

## 📦 Cloudflare D1 Database Commands

- **Run migrations on remote D1:**
  ```bash
  bun x wrangler d1 execute real-state --remote --file=./schema.sql
  ```

- **Seed remote D1 database:**
  ```bash
  bun x wrangler d1 execute real-state --remote --file=./seed.sql
  ```

- **Query database directly:**
  ```bash
  bun x wrangler d1 execute real-state --remote --command="SELECT * FROM inquiries;"
  ```

---

## 🚢 Deploying to Cloudflare Workers

```bash
bun run build
bun x wrangler deploy
```
