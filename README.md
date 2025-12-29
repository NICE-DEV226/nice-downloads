<div align="center">

# NICE Downloader Frontend

Modern React frontend for the NICE Downloader platform.

<img src="https://i.ibb.co/Xkdr0bWH/screenshot.png" alt="NICE Downloader" width="100%">

</div>

## Features

- 🎨 Clean, minimal design
- 🌙 Dark mode
- 📱 Fully responsive
- ⚡ Fast with Vite
- 🎬 17+ platform support
- 📊 Admin dashboard
- 📢 Announcements system
- 📝 User feedback & polls

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite
- Axios

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://your-backend-url.com
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `` (same origin) |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Main download page |
| `/admin` | Admin dashboard |

## Admin Dashboard

Access at `/admin` with your admin key.

**Features:**
- 📊 Download statistics
- 🐛 Error reports management
- ⭐ User ratings
- 📢 Announcements (create, toggle, delete)
- 📝 Polls (create, view responses)
- ⚙️ Platform management (enable/disable)

## Deployment

### Vercel

1. Import this repository
2. Set `VITE_API_URL` to your backend URL
3. Deploy

### Static Hosting

```bash
npm run build
# Upload 'dist' folder to your hosting
```

## Project Structure

```
src/
├── components/      # UI components
├── hooks/           # Custom hooks
├── pages/           # Page components
├── services/        # API services
├── types/           # TypeScript types
├── utils/           # Utilities
├── App.tsx          # Main app
└── main.tsx         # Entry point
```

## License

MIT © NICE-DEV

## backend & api repo : https://github.com/NICE-DEV226/BACKEND_NICE_DL.git
