import express, { type Application } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 4291;

// General rate limiter: 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3847',
  credentials: true,
}));
app.use(express.json());
// Brute-force protection for actual sign-in is handled by Better Auth on the Next.js layer.
// The backend auth utility routes (/api/auth/role/me, /api/auth/me) are session checks
// called on every page load — using the general 100/min limit is appropriate.
app.use('/api', limiter);

// Mount all API routes
app.use('/api', routes);

// ============================================================================
// SERVER STARTUP
// ============================================================================

if (process.env.NODE_ENV !== 'test') app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running at http://localhost:${PORT}\n`);
  console.log('Available API endpoints:');
  console.log('  Auth:');
  console.log('    POST   /api/auth/login');
  console.log('    GET    /api/auth/me');
  console.log('  Sponsors:');
  console.log('    GET    /api/sponsors');
  console.log('    GET    /api/sponsors/:id');
  console.log('    POST   /api/sponsors');
  console.log('  Publishers:');
  console.log('    GET    /api/publishers');
  console.log('    GET    /api/publishers/:id');
  console.log('  Campaigns:');
  console.log('    GET    /api/campaigns');
  console.log('    GET    /api/campaigns/:id');
  console.log('    POST   /api/campaigns');
  console.log('  Ad Slots:');
  console.log('    GET    /api/ad-slots');
  console.log('    GET    /api/ad-slots/available');
  console.log('    GET    /api/ad-slots/:id');
  console.log('    POST   /api/ad-slots');
  console.log('  Placements:');
  console.log('    GET    /api/placements');
  console.log('    POST   /api/placements');
  console.log('  Dashboard:');
  console.log('    GET    /api/dashboard/stats');
  console.log('  Health:');
  console.log('    GET    /api/health');
  console.log('');
})

export default app;
