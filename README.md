# SCAL3 Arena

The Creatorverse platform for Web3 creator campaigns.

## Features

- 🎯 Creator dashboard with earnings tracking
- 🏆 Campaign management with leaderboards
- 📊 Admin panel for campaign & creator management
- 💰 Automated payout calculations
- 📱 Fully responsive design

## Tech Stack

- React 18
- Tailwind CSS
- Supabase (PostgreSQL database)

## Getting Started

### Prerequisites

- Supabase account with project set up
- Database tables created (see `schema.sql`)

### Environment

The app connects to Supabase using credentials in `index.html`. Update these if needed:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Deployment

This project is deployed on Vercel. Any push to `main` triggers auto-deployment.

## Demo Accounts

**Admin:**
- Email: `admin@scal3.io`
- Password: any

**Creator:**
- Email: `alex@test.com`
- Password: any

## License

© 2026 SCAL3 - The Creatorverse
