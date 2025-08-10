# AICI SDE Challenge - API Documentation

This directory contains comprehensive API documentation for the AICI SDE Challenge project.

## 📚 Available Documentation

### 1. OpenAPI 3.0 Specification (`openapi.yaml`)

- **Format**: YAML-based OpenAPI 3.0.3 specification
- **Coverage**: Complete API documentation for both User Service and Todo Service
- **Features**: Request/response schemas, examples, error codes, and authentication details

### 2. Postman Collection (`../postman/AICI_SDE_Challenge.postman_collection.json`)

- **Format**: Postman collection v2.1.0
- **Coverage**: All API endpoints with pre-configured requests and test scripts
- **Features**: Automated testing, environment variable management, and response validation

### 3. Postman Environment (`../postman/AICI_SDE_Challenge.postman_environment.json`)

- **Format**: Postman environment configuration
- **Coverage**: Pre-configured variables for local development and testing
- **Features**: Auto-populated values, secure token storage, and easy switching between environments

## 🚀 Getting Started

### Option 1: OpenAPI/Swagger UI

1. **Install Swagger UI** (if not already installed):

   ```bash
   npm install -g swagger-ui-express
   # or
   docker run -p 8080:8080 -e SWAGGER_JSON=/openapi.yaml -v $(pwd):/swagger swaggerapi/swagger-ui
   ```

2. **View Documentation**:
   - **Local**: Open `openapi.yaml` in any OpenAPI viewer
   - **Online**: Use [Swagger Editor](https://editor.swagger.io/) and paste the YAML content
   - **Docker**: Run the Docker command above and visit `http://localhost:8080`

### Option 2: Postman Collection

1. **Import Collection**:

   - Open Postman
   - Click "Import" → "File" → Select `AICI_SDE_Challenge.postman_collection.json`

2. **Import Environment**:

   - Click "Import" → "File" → Select `AICI_SDE_Challenge.postman_environment.json`
   - Select the environment from the dropdown in the top-right corner

3. **Start Testing**:
   - Begin with "User Service" → "User Registration"
   - Follow the collection order for best results

## 🔐 Authentication Flow

The API uses JWT (JSON Web Token) authentication:

1. **Register**: `POST /api/v1/auth/register` to create a new user
2. **Login**: `POST /api/v1/auth/login` to get a JWT token
3. **Use Token**: Include `Authorization: Bearer <JWT>` header for protected endpoints

## 📋 API Endpoints Overview

### User Service (Port 3001)

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /health` - Service health check

### Todo Service (Port 3002)

- `POST /api/v1/todos` - Create todo (requires auth)
- `GET /api/v1/todos` - List user's todos (requires auth)
- `PATCH /api/v1/todos/:id` - Update todo (requires auth)
- `DELETE /api/v1/todos/:id` - Delete todo (requires auth)
- `GET /health` - Service health check

## 🧪 Testing with Postman

### Automated Testing Features

- **Pre-request Scripts**: Automatically set up test data
- **Test Scripts**: Validate responses and store values for subsequent requests
- **Environment Variables**: Auto-populate tokens and IDs
- **Response Validation**: Comprehensive checks for status codes, data structure, and business logic

### Test Flow

1. **Health Check**: Verify services are running
2. **User Registration**: Create a test user account
3. **User Login**: Authenticate and get JWT token
4. **Create Todo**: Add a new todo item
5. **List Todos**: Verify todo was created
6. **Update Todo**: Modify the todo content
7. **Delete Todo**: Remove the todo item
8. **Error Testing**: Test validation and authorization scenarios

### Environment Variables (Auto-populated)

- `auth_token`: JWT token from login
- `user_uuid`: User's unique identifier
- `user_email`: User's email address
- `todo_id`: Created todo's ID
- `todo_uuid`: Created todo's UUID

## 🔧 Customization

### Adding New Endpoints

1. **OpenAPI**: Add new paths to `openapi.yaml`
2. **Postman**: Add new requests to the collection
3. **Update README**: Document new functionality

### Environment Configuration

- **Local Development**: Use `localhost` URLs
- **Docker**: Use service names (e.g., `user-service:3001`)
- **Production**: Update URLs in environment files

### Test Scripts

- Modify test scripts in Postman collection for custom validation
- Add new test cases for specific business requirements
- Extend pre-request scripts for complex setup scenarios

## 📖 API Schema Details

### Request Validation

- **Email**: Must be valid email format
- **Password**: Minimum 6 characters for registration
- **Todo Content**: 1-500 characters, required

### Response Format

```json
{
  "success": true|false,
  "data": {...} | null,
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": "Additional details (optional)"
  }
}
```

### Status Codes

- `200` - Success (GET, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid JWT)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure services are running and accessible
2. **Authentication Failures**: Check JWT token format and expiration
3. **Validation Errors**: Verify request body format and required fields
4. **Service Unavailable**: Check if services are running on correct ports

### Debug Tips

- Use Postman's console to view test script output
- Check service logs for detailed error information
- Verify environment variables are correctly set
- Test endpoints individually before running full collection

## 📚 Additional Resources

- **Project README**: `../README.md` - Complete project overview
- **Service Code**: `../user-service/` and `../todo-service/` - Implementation details
- **Docker Setup**: `../docker-compose.yml` - Container orchestration
- **Frontend**: `../frontend/` - Working UI for testing

## 🤝 Contributing

When adding new API endpoints or modifying existing ones:

1. **Update OpenAPI spec** with new schemas and examples
2. **Add Postman requests** with appropriate test scripts
3. **Update environment variables** if new ones are needed
4. **Document changes** in this README
5. **Test thoroughly** with the Postman collection

## 📄 License

This documentation is part of the AICI SDE Challenge project.
