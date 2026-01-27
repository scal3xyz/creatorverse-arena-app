# SCAL3 Arena

The Creatorverse platform for Web3 creator campaigns.

## Project Structure

```
scal3-arena/
├── api/
│   └── sync-notion.js    # Cron job: syncs Notion → Supabase
├── public/
│   └── index.html        # Main app
├── package.json
├── vercel.json           # Cron schedule config
└── README.md
```

## Features

- 🎯 Creator dashboard with earnings tracking
- 🏆 Campaign management with leaderboards
- 📊 Admin panel for campaign & creator management
- 💰 Automated payout calculations
- 🔄 Auto-sync from Notion (every 2 minutes)
- 💳 Wallet management in-app

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `NOTION_API_KEY` | Your Notion integration secret |
| `NOTION_DATABASE_ID` | Your Notion creators database ID |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `CRON_SECRET` | (Optional) Secret to protect cron endpoint |

## How Sync Works

1. Every 2 minutes, Vercel runs `/api/sync-notion`
2. It fetches all creators with **Status = "Approved"** from Notion
3. Creates/updates them in Supabase
4. **Never overwrites wallets** - those are only set in the app

## Deployment

1. Push this repo to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## Login Credentials

**Admin:** scal3xyz@gmail.com / Arena123

## License

© 2026 SCAL3 - The Creatorverse
