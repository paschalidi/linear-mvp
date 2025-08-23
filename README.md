# Task Board

⚡ Live version: https://taskboard-mvp.vercel.app

Full-stack task management application with drag-and-drop kanban interface.

## Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express, Prisma, PostgreSQL (Neon)
- **Auth**: JWT

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose

### Installation
```bash
# Install root dependencies (concurrently)
npm i
```

### Development
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

The `npm run dev` command runs:
- Server via Docker Compose (PostgreSQL + Express API)
- Client locally via Next.js dev server

## Database Configuration

This project uses a hardcoded Neon PostgreSQL database connection for simplicity and ease of setup. The database URL is directly embedded in:
- `server/.env.local` (for local development)
- `docker-compose.yml` (for containerized deployment)

**Why hardcoded instead of secret environment variables?**
- **Demo purposes**: Makes the project immediately runnable without additional infrastructure

## Future Roadmap

To bring this to production I would spent more time with the following topics:

1. **Boards**
   - Email invitations to join boards
   - Allow users to create multiple boards

2. **Real-time Features**
   - WebSocket implementation for live updates
   - Live cursors and editing indicators
   - Conflict resolution for concurrent edits

3. **Testing & Quality**
   - End-to-end testing (Cypress/Playwright)

4. **Infrastructure**
   - Proper environment variable management
   - Database migrations and seeding
   - Monitoring and error tracking
   - Scalable WebSocket architecture