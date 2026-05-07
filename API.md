# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Health Check
```http
GET /api/health
```
Check if API is running.

**Response:**
```json
{
  "status": "success",
  "message": "API is running",
  "timestamp": "2024-02-28T10:00:00.000Z"
}
```

---

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "company": "Tech Corp",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": "success",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "company": "Tech Corp"
  }
}
```

---

### Contact

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "company": "Business Inc",
  "service": "network",
  "message": "I need help with network security"
}
```

**Service Options:**
- `network` - Network Security
- `cloud` - Cloud Protection
- `endpoint` - Endpoint Security
- `encryption` - Data Encryption
- `monitoring` - 24/7 Monitoring
- `incident` - Incident Response

**Response:**
```json
{
  "status": "success",
  "message": "Contact form submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "new",
    "createdAt": "2024-02-28T10:00:00.000Z"
  }
}
```

---

### Services

#### Get All Services
```http
GET /api/services
```

**Response:**
```json
{
  "status": "success",
  "results": 6,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Network Security",
      "slug": "network-security",
      "description": "Protect your network infrastructure...",
      "features": ["Firewall Management", "Intrusion Detection"],
      "price": 999,
      "duration": "monthly",
      "active": true
    }
  ]
}
```

#### Get Single Service
```http
GET /api/services/:slug
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Network Security",
    "slug": "network-security",
    "description": "Protect your network infrastructure...",
    "features": ["Firewall Management", "Intrusion Detection"],
    "price": 999,
    "duration": "monthly"
  }
}
```

---

### AI Assistant

#### Chat with AI
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "What is network security?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "response": "Network security involves protecting your network infrastructure from unauthorized access, misuse, or theft. It includes firewalls, intrusion detection systems, VPNs, and continuous monitoring..."
}
```

---

### Users (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "status": "success",
  "results": 10,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "company": "Tech Corp",
      "createdAt": "2024-02-28T10:00:00.000Z"
    }
  ]
}
```

#### Get Single User
```http
GET /api/users/:id
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "company": "Tech Corp",
    "phone": "+1234567890",
    "createdAt": "2024-02-28T10:00:00.000Z"
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

### Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","message":"Need help"}'
```

### AI Chat
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is cybersecurity?"}'
```

---

## Postman Collection

Import this JSON into Postman:

```json
{
  "info": {
    "name": "Cyber Guard Solutions API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\":\"Test\",\"email\":\"test@example.com\",\"password\":\"Test123!\"}"
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```
