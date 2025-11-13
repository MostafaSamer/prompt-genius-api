# Prompt Genius API

A NestJS-based web application that lets users create, categorize, and reuse AI prompts with dynamic placeholders (like `{productName}` or `{tone}`), and optionally run them directly using the OpenAI API.

## Features

- 🔐 **User Authentication** - JWT-based authentication system
- 📝 **Prompt Management** - Create, read, update, and delete prompts
- 🏷️ **Categories** - Organize prompts into categories
- 🔄 **Dynamic Placeholders** - Use placeholders like `{productName}` in prompts
- 🤖 **OpenAI Integration** - Run prompts directly with OpenAI API
- 📚 **Swagger Documentation** - Complete API documentation at `/api`
- 🐳 **Docker Support** - Fully dockerized with docker-compose

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (Passport)
- **API Documentation**: Swagger/OpenAPI
- **AI Integration**: OpenAI API

## Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL (if running locally without Docker)
- OpenAI API Key (optional, only needed for running prompts)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd prompt-genius
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/prompt_genius?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
OPENAI_API_KEY="your-openai-api-key-here"
PORT=3000
```

4. Start the application:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api`

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

4. Start the development server:
```bash
npm run start:dev
```

## Database Schema

### Users
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `name` (optional)
- `createdAt`, `updatedAt`

### Categories
- `id` (UUID)
- `name`
- `userId` (foreign key)
- `createdAt`, `updatedAt`
- Unique constraint on `(userId, name)`

### Prompts
- `id` (UUID)
- `title`
- `content` (text with placeholders like `{productName}`)
- `description` (optional)
- `userId` (foreign key)
- `categoryId` (optional foreign key)
- `placeholders` (array of placeholder names)
- `createdAt`, `updatedAt`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users
- `GET /users/me` - Get current user profile (requires authentication)

### Categories
- `POST /categories` - Create a new category
- `GET /categories` - Get all categories for current user
- `GET /categories/:id` - Get a category by ID
- `PATCH /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Prompts
- `POST /prompts` - Create a new prompt
- `GET /prompts` - Get all prompts (optionally filter by `categoryId` query param)
- `GET /prompts/:id` - Get a prompt by ID
- `PATCH /prompts/:id` - Update a prompt
- `DELETE /prompts/:id` - Delete a prompt
- `POST /prompts/:id/run` - Run a prompt with OpenAI API

## Usage Examples

### Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create a Prompt
```bash
curl -X POST http://localhost:3000/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Product Description Generator",
    "content": "Write a compelling product description for {productName} that highlights its {features} and appeals to {targetAudience}.",
    "description": "Generates product descriptions with customizable placeholders"
  }'
```

### Run a Prompt
```bash
curl -X POST http://localhost:3000/prompts/PROMPT_ID/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "placeholders": {
      "productName": "iPhone 15",
      "features": "A17 chip, 48MP camera",
      "targetAudience": "tech enthusiasts"
    },
    "model": "gpt-3.5-turbo",
    "temperature": 0.7
  }'
```

## Swagger Documentation

Once the application is running, visit `http://localhost:3000/api` to access the interactive Swagger documentation. You can test all endpoints directly from the Swagger UI.

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start only Prisma Studio
docker-compose up -d prisma-studio

# View logs
docker-compose logs -f app
docker-compose logs -f prisma-studio

# Stop services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

## Development

### Running Prisma Studio

**Using Docker (Recommended):**
```bash
# Start Prisma Studio with docker-compose
docker-compose up -d prisma-studio
```

Prisma Studio will be available at `http://localhost:5555`

**Or locally:**
```bash
npm run prisma:studio
```

This opens a visual database browser at `http://localhost:5555`

### Running Migrations
```bash
# Create a new migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:deploy
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key for running prompts | No | - |
| `PORT` | Server port | No | 3000 |

## Project Structure

```
prompt-genius/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # Users module
│   ├── categories/     # Categories module
│   ├── prompts/        # Prompts module
│   ├── prisma/         # Prisma service and module
│   ├── app.module.ts   # Root module
│   └── main.ts         # Application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # Docker image definition
└── .env.example        # Environment variables template
```

## License

UNLICENSED
