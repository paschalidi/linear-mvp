# Task Board

Full-stack task management application with drag-and-drop kanban interface.

## Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express, Prisma, PostgreSQL (Neon)
- **Auth**: JWT

## Quick Start
```bash
npm install
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Database Configuration

This project uses a hardcoded Neon PostgreSQL database connection for simplicity and ease of setup. The database URL is directly embedded in:
- `server/.env.local` (for local development)
- `docker-compose.yml` (for containerized deployment)

**Why hardcoded instead of secret environment variables?**
- **Demo purposes**: Makes the project immediately runnable without additional infrastructure