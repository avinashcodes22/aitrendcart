# AItrendcart Admin Dashboard

## Overview
Production-ready admin dashboard for managing AI-powered 3D e-commerce platform.

## Components

### Layout Components
- **Sidebar.tsx** - Navigation sidebar with glassmorphism design
- **Topbar.tsx** - Top navigation bar with user actions
- **ProtectedLayout.tsx** - Wrapper for authenticated admin pages

### UI Components
- **KpiCard.tsx** - Key performance indicator cards with trends
- **Scene3D.tsx** - React Three Fiber 3D visualization component

### Pages
- **LoginPage.tsx** - Admin authentication with email/password and OAuth
- **DashboardPage.tsx** - Main dashboard with KPIs and 3D visualization
- **ProductsPage.tsx** - Product catalog management with 3D status
- **SuppliersPage.tsx** - Supplier configuration and sync controls

## API Integration

### Mock Mode
Set `MOCK=true` in your environment to use local mock data without backend.

### API Endpoints (To be implemented)
```typescript
// Authentication
POST /api/admin/auth/login
POST /api/admin/auth/logout

// Suppliers
GET /api/admin/suppliers
POST /api/admin/suppliers/test
POST /api/admin/suppliers/sync

// Products
GET /api/admin/products
POST /api/admin/products/:id/approve
POST /api/admin/products/:id/generate-3d

// AI Jobs
GET /api/admin/ai-jobs
POST /api/admin/ai-jobs/:id/retry

// License Ledger
GET /api/admin/license/reports
POST /api/admin/license/:id/verify

// Audit Logs
GET /api/admin/audit
POST /api/admin/audit
```

## Security Requirements

### Authentication
- Admin-only access with role checking
- JWT tokens with secure HTTP-only cookies
- 2FA support (placeholder in UI)
- IP whitelisting capability

### Headers
```javascript
// Recommended security headers
{
  "Content-Security-Policy": "default-src 'self'",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Strict-Transport-Security": "max-age=31536000"
}
```

### Secrets Management
- Never store secrets in client code
- Use environment variables for API keys
- Reference secrets by ID, not value
- Integrate with Doppler or similar secret manager

### Audit Logging
All destructive actions should log:
```typescript
{
  action: string,
  user: string,
  ip: string,
  resource: string,
  result: "success" | "failure",
  timestamp: Date
}
```

## Design System

### Colors
- Primary: `#00E5FF` (Electric Cyan)
- Accent: `#FF007A` (Trend Pink)
- Background: `#141414`
- Foreground: `#FFFFFF`

### Typography
- Headings: Orbitron
- Body: Inter
- Code: JetBrains Mono

### Effects
- Glassmorphism: Semi-transparent cards with backdrop blur
- Neon glow: Box shadows with brand colors
- Smooth animations: 300ms ease transitions

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## Future Enhancements
- Real-time WebSocket updates for job status
- Advanced 3D model viewer with AR preview
- CSV upload with field mapping UI
- Batch operations for products
- Advanced filtering and search
- Export functionality for reports
