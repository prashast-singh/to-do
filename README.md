# AICI SDE Challenge - Express + TypeScript + PostgreSQL

A production-grade microservices architecture with User Service and Todo Service, featuring JWT authentication, PostgreSQL databases, comprehensive testing, and a working frontend for testing.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  User Service   │    │  Todo Service   │
│   Port: 3000    │◄──►│   Port: 3001    │◄──►│   Port: 3002    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   User DB       │    │   Todo DB       │
                       │  (PostgreSQL)   │    │  (PostgreSQL)   │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL (for local development)

### Environment Configuration

The project includes an `env.example` file that shows all required environment variables:

```bash
# Copy the example file
cp env.example .env

# Edit .env with your values (optional for Docker)
# The Docker Compose setup works out-of-the-box
```

### Option 1: Run with Docker Compose (Recommended)

```bash
# Clone and setup
git clone <repository-url>
cd to-do

# Start all services
docker-compose up --build

# Services will be available at:
# - User Service: http://localhost:3001
# - Todo Service: http://localhost:3002
# - Frontend: http://localhost:3000
```

**Note**: The first build may take a few minutes as it needs to install dependencies and generate Prisma clients.

### Option 2: Local Development with Local PostgreSQL

```bash
# 1. Start your local PostgreSQL server
# (Using Postgres.app or brew services start postgresql)

# 2. Create databases
 -U postgres -c "CREATE DATABASE users;"
 -U postgres -c "CREATE DATABASE todos;"

# 3. Set up User Service
cd user-service
npm install
npm install pino-pretty  # Required for development
cp .env.example .env
# Update .env with your local PostgreSQL credentials
npm run migrate
npm run dev

# 4. Set up Todo Service (in another terminal)
cd todo-service
npm install
npm install pino-pretty  # Required for development
cp .env.example .env
# Update .env with your local PostgreSQL credentials
npm run migrate
npm run dev

# 5. Start Frontend (in another terminal)
cd frontend
python3 -m http.server 3000
# Or use: npx http-server -p 3000 --cors
```

## 🌐 Frontend

The project includes a **working frontend** for testing the API:

- **URL**: http://localhost:3000
- **Features**: User registration, login, and full CRUD operations for todos
- **Authentication**: JWT-based with automatic token management
- **UI**: Clean, minimal interface with real-time feedback
- **Proxy**: Nginx reverse proxy to backend services with CORS support

### Frontend Features

- ✅ User registration and login
- ✅ Create new todos
- ✅ View all user todos
- ✅ Edit existing todos
- ✅ Delete todos
- ✅ Real-time status updates
- ✅ Responsive design
- ✅ API proxy to backend services

### Frontend API Proxy

The frontend includes Nginx configuration that proxies API requests:

- `/api/users/*` → User Service (port 3001)
- `/api/todos/*` → Todo Service (port 3002)

This allows frontend applications to make API calls to the same origin.

## 📋 API Endpoints

### Health Checks

- `GET /health` - Service health status (available on all services)

### User Service (Port 3001)

#### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Todo Service (Port 3002)

#### Todos (Requires JWT Authorization)

- `POST /api/v1/todos` - Create todo
- `GET /api/v1/todos` - List user's todos
- `PATCH /api/v1/todos/:id` - Update todo
- `DELETE /api/v1/todos/:id` - Delete todo

## 🔐 Authentication Flow

1. **Register**: `POST /api/v1/auth/register` with email/password
2. **Login**: `POST /api/v1/auth/login` to get JWT token
3. **Use Token**: Include `Authorization: Bearer <JWT>` header for todo operations

## 📝 Example Requests

### Health Check

```bash
# Check service health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3000/
```

### Register User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "Test User"}'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create Todo (with JWT)

```bash
curl -X POST http://localhost:3002/api/v1/todos \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Buy groceries"}'
```

### Update Todo (with JWT)

```bash
curl -X PATCH http://localhost:3002/api/v1/todos/1 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Buy organic groceries"}'
```

### Test Frontend Proxy

```bash
# Test proxy to user service
curl http://localhost:3000/api/users/health

# Test proxy to todo service
curl http://localhost:3000/api/todos/health
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# User Service (.env)
USER_DB_URL=postgresql://postgres:your_password@localhost:5432/users
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=60m
PORT=3001
LOG_LEVEL=info

# Todo Service (.env)
TODO_DB_URL=postgresql://postgres:your_password@localhost:5432/todos
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3002
LOG_LEVEL=info
```

## 🔧 Configuration

### Database

- **User Service**: PostgreSQL database for user management
- **Todo Service**: PostgreSQL database for todo storage
- **Foreign Key**: Todos are linked to users via `user_uuid`
- **Local Setup**: Supports both Docker and local PostgreSQL

### Security

- JWT authentication with HS256 algorithm
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting on auth routes
- Input validation with Zod
- Helmet for security headers
- CORS configuration

## 📊 Data Models

### User

- `id` (Primary Key - PostgreSQL auto-increment)
- `uuid` (Unique identifier)
- `user_email` (Unique email address)
- `User_pwd` (Hashed password)

### Todo

- `id` (Primary Key - PostgreSQL auto-increment)
- `uuid` (Unique identifier)
- `content` (Todo item content)
- `user_uuid` (Foreign Key → users.uuid)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## 🐳 Docker

### Services

- **user-service**: Express.js User Service
- **todo-service**: Express.js Todo Service
- **user-db**: PostgreSQL for users
- **todo-db**: PostgreSQL for todos
- **frontend**: Working UI for testing

### Health Checks

All services include health checks and wait for database availability before starting.

### Docker Image Details

- **Base Images**: Uses `node:18-slim` for better Prisma compatibility
- **Multi-stage Builds**: Optimized for production with separate build and runtime stages
- **Security**: Runs as non-root user
- **Dependencies**: Includes OpenSSL for Prisma runtime requirements

### Prisma Compatibility

The Docker images are specifically configured for Prisma compatibility:

- Uses Debian-based `node:18-slim` instead of Alpine Linux
- Explicitly installs OpenSSL dependencies
- Ensures all build dependencies are available during Prisma client generation

## 📚 API Documentation

- **OpenAPI 3.0**: Available in `openapi/` directory
- **Postman Collection**: Available in `postman/` directory

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000-3002 are available
2. **Database connection**: Check if PostgreSQL containers are running
3. **JWT issues**: Verify JWT_SECRET is set in environment
4. **Migration errors**: Check database logs for connection issues
5. **Frontend not loading**: Ensure you're serving from the `frontend/` directory

### Docker-Specific Issues

#### Prisma OpenSSL Errors

**Symptoms**: `Prisma failed to detect the libssl/openssl version` or `Could not parse schema engine response`
**Solution**: The Dockerfiles have been updated to use `node:18-slim` and install OpenSSL dependencies. If you encounter this, ensure you're using the latest Dockerfile versions.

#### Nginx Configuration Errors

**Symptoms**: `nginx: [emerg] "if" directive is not allowed here` or `"add_header" directive is not allowed here`
**Solution**: The Nginx configuration has been fixed to properly place directives within valid contexts. Ensure you're using the latest `nginx.conf`.

#### Container Startup Failures

**Symptoms**: Services exit immediately after starting
**Solution**: Check logs with `docker-compose logs <service-name>`. Common causes:

- Database not ready (check health checks)
- Environment variables missing
- Port conflicts

### Local Development Issues

1. **Missing pino-pretty**: Run `npm install pino-pretty` in both service directories
2. **Database connection**: Ensure PostgreSQL is running and databases exist
3. **Port already in use**: Kill existing processes or use different ports

### Logs

```bash
# View service logs
docker-compose logs user-service
docker-compose logs todo-service

# View database logs
docker-compose logs user-db
docker-compose logs todo-db

# View frontend logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f <service-name>

# Local development logs
# Check terminal output for each service
```

### Debugging Steps

1. **Check container status**: `docker-compose ps`
2. **View logs**: `docker-compose logs <service-name>`
3. **Test health endpoints**: `curl http://localhost:<port>/health`
4. **Check database connectivity**: `docker exec <db-container> pg_isready`
5. **Rebuild if needed**: `docker-compose down && docker-compose up --build`

## 📈 Performance & Monitoring

- JSON structured logging with Pino
- Request/response logging
- Error tracking and monitoring
- Health check endpoints
- Rate limiting on authentication

## 🔒 Security Considerations

- Passwords are never logged or returned
- JWT tokens expire after 60 minutes
- Rate limiting on authentication endpoints
- Input validation on all endpoints
- CORS properly configured
- Security headers with Helmet
- User data isolation (users can only access their own todos)

## 🎯 User Stories Implementation Status

### User Service ✅

- **User Registration**: ✅ Complete with validation, password hashing, and conflict handling
- **User Login**: ✅ Complete with JWT generation and secure credential verification

### Todo Service ✅

- **Create Todo**: ✅ Complete with user authentication and ownership
- **Read Todos**: ✅ Complete with user isolation and proper filtering
- **Update Todo**: ✅ Complete with ownership verification and validation
- **Delete Todo**: ✅ Complete with ownership verification and proper status codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is part of the AICI SDE Challenge.
