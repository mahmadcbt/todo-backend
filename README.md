# Todo List Backend

REST API backend for Todo List application built with Express.js and Prisma.

## Tech Stack

- Express.js
- Prisma
- MySQL

## Prerequisites

- Node.js
- MySQL
- npm/yarn

## Installation

```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Update database credentials in .env
DATABASE_URL="mysql://user:password@localhost:3306/todo_db"

# Run Prisma migrations
npx prisma migrate dev
```

## Database Schema

```prisma
model Task {
  id        Int      @id @default(autoincrement())
  title     String
  color     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## API Endpoints

### Get Tasks
```
GET /tasks
Response: 
[
  {
    "id": 1,
    "title": "Task title",
    "color": "#FF0000",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Task
```
POST /tasks
Body: 
{
  "title": "Task title",
  "color": "#FF0000"
}
```

### Update Task
```
PUT /tasks/:id
Body:
{
  "title": "Updated title",
  "color": "#00FF00",
  "completed": true
}
```

### Delete Task
```
DELETE /tasks/:id
```

## Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Environment Variables

```
PORT=3000
DATABASE_URL="mysql://user:password@localhost:3306/todo_db"
```

## Scripts

- `npm run dev`: Start development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm start`: Start production server

## Error Handling

- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## License

MIT
