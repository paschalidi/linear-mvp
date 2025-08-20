# Team Task Board

A full-stack task management application built with Next.js, Express, Prisma, and PostgreSQL.

## Project Structure

```
project-root/
├── client/                 # Next.js frontend
│   ├── src/
│   ├── components/
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utility functions
│   │   └── __tests__/     # Test files
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
├── docker-compose.yml      # PostgreSQL + server containers
└── README.md
```

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Status**: TODO, IN_PROGRESS, DONE
- **TypeScript**: Fully typed throughout (no `any` types)
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Jest with comprehensive test coverage
- **Docker**: Containerized database and server

## API Endpoints

- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
