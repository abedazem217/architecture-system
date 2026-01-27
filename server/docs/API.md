# 📚 API Reference - Architect Office System

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.architect-office.com/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "Ahmed Al-Hashimi",
  "email": "ahmed@example.com",
  "phone": "+970123456789",
  "password": "SecurePassword123",
  "role": "architect" // optional: "admin", "architect", "client"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
      "name": "Ahmed Al-Hashimi",
      "email": "ahmed@example.com",
      "phone": "+970123456789",
      "role": "architect",
      "isActive": true,
      "createdAt": "2025-01-27T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    "Email must be a valid email address",
    "Password must be at least 6 characters"
  ]
}
```

---

### 2. Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
      "name": "Ahmed Al-Hashimi",
      "email": "ahmed@example.com",
      "phone": "+970123456789",
      "role": "architect"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User Profile
**GET** `/auth/me`

Retrieve the logged-in user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
    "name": "Ahmed Al-Hashimi",
    "email": "ahmed@example.com",
    "phone": "+970123456789",
    "role": "architect",
    "company": "Modern Designs",
    "specialization": "Residential Architecture",
    "profilePic": "https://example.com/profile.jpg",
    "isActive": true,
    "createdAt": "2025-01-27T10:30:00Z",
    "updatedAt": "2025-01-27T10:30:00Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`

Update the current user's profile information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ahmed Al-Hashimi",
  "phone": "+970123456789",
  "company": "Modern Designs",
  "address": "Nablus, Palestine",
  "specialization": "Residential Architecture",
  "profilePic": "https://example.com/profile.jpg"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
    "name": "Ahmed Al-Hashimi",
    "email": "ahmed@example.com",
    "phone": "+970123456789",
    "company": "Modern Designs",
    "address": "Nablus, Palestine",
    "specialization": "Residential Architecture",
    "profilePic": "https://example.com/profile.jpg",
    "role": "architect",
    "isActive": true,
    "updatedAt": "2025-01-27T11:45:00Z"
  }
}
```

---

### 5. Change Password
**POST** `/auth/change-password`

Change the user's password.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456",
  "confirmPassword": "NewPassword456"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

### 6. Logout
**POST** `/auth/logout`

Logout the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

## 📁 Project Endpoints

### 1. Create Project
**POST** `/projects`

Create a new architectural project.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Downtown Office Complex",
  "description": "Modern 5-story office building with green architecture features",
  "clientId": "64f7b8c1a2b3c4d5e6f7g8h9",
  "startDate": "2025-02-01",
  "endDate": "2025-08-01",
  "budget": 500000,
  "location": "Downtown, Nablus"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Project created successfully",
  "data": {
    "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
    "title": "Downtown Office Complex",
    "description": "Modern 5-story office building with green architecture features",
    "status": "planning",
    "phase": "planning",
    "architect": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h8",
      "name": "Ahmed Al-Hashimi",
      "email": "ahmed@example.com"
    },
    "client": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
      "name": "Mohammed Abu Jaber",
      "email": "client@example.com"
    },
    "startDate": "2025-02-01T00:00:00Z",
    "endDate": "2025-08-01T00:00:00Z",
    "budget": 500000,
    "location": "Downtown, Nablus",
    "documents": [],
    "meetings": [],
    "createdAt": "2025-01-27T12:00:00Z"
  }
}
```

---

### 2. List Projects
**GET** `/projects?status=planning&page=1&limit=10`

Get all projects with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `planning`, `licensed`, `in_progress`, `completed`, `on_hold` |
| `phase` | string | Filter by phase: `planning`, `licensing`, `construction`, `completion` |
| `search` | string | Search in title, description, location |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

**Success Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
      "title": "Downtown Office Complex",
      "description": "Modern 5-story office building",
      "status": "planning",
      "phase": "planning",
      "architect": {
        "_id": "64f7b8c1a2b3c4d5e6f7g8h8",
        "name": "Ahmed Al-Hashimi",
        "email": "ahmed@example.com"
      },
      "client": {
        "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
        "name": "Mohammed Abu Jaber",
        "email": "client@example.com"
      },
      "budget": 500000,
      "location": "Downtown, Nablus",
      "createdAt": "2025-01-27T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

---

### 3. Get Project Details
**GET** `/projects/:id`

Get detailed information about a specific project.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
    "title": "Downtown Office Complex",
    "description": "Modern 5-story office building with green architecture features",
    "status": "in_progress",
    "phase": "construction",
    "architect": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h8",
      "name": "Ahmed Al-Hashimi",
      "email": "ahmed@example.com",
      "phone": "+970123456789",
      "company": "Modern Designs",
      "specialization": "Residential Architecture"
    },
    "client": {
      "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
      "name": "Mohammed Abu Jaber",
      "email": "client@example.com",
      "phone": "+970987654321"
    },
    "startDate": "2025-02-01T00:00:00Z",
    "endDate": "2025-08-01T00:00:00Z",
    "budget": 500000,
    "location": "Downtown, Nablus",
    "notes": "Project is progressing well. Foundation completed.",
    "documents": [
      {
        "_id": "64f7b8c1a2b3c4d5e6f7g8h0",
        "name": "Blueprint - Ground Floor",
        "type": "blueprint",
        "createdAt": "2025-01-20T10:00:00Z"
      }
    ],
    "meetings": [
      {
        "_id": "64f7b8c1a2b3c4d5e6f7g8h1",
        "title": "Progress Review",
        "date": "2025-01-25T14:00:00Z",
        "status": "completed"
      }
    ],
    "createdAt": "2025-01-27T12:00:00Z",
    "updatedAt": "2025-01-27T14:30:00Z"
  }
}
```

---

### 4. Update Project
**PUT** `/projects/:id`

Update project information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Downtown Office Complex - Phase 2",
  "description": "Modern 5-story office building - Updated description",
  "status": "in_progress",
  "phase": "construction",
  "startDate": "2025-02-01",
  "endDate": "2025-08-15",
  "budget": 550000,
  "location": "Downtown, Nablus",
  "notes": "Project on schedule. No major issues reported."
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Project updated successfully",
  "data": {
    "_id": "64f7b8c1a2b3c4d5e6f7g8h9",
    "title": "Downtown Office Complex - Phase 2",
    "description": "Modern 5-story office building - Updated description",
    "status": "in_progress",
    "phase": "construction",
    "budget": 550000,
    "location": "Downtown, Nablus",
    "notes": "Project on schedule. No major issues reported.",
    "updatedAt": "2025-01-27T15:00:00Z"
  }
}
```

---

### 5. Delete Project
**DELETE** `/projects/:id`

Delete a project (only architects and admins).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "message": "Project deleted successfully"
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": ["Email is required"]
}
```

### 401 - Unauthorized
```json
{
  "status": "error",
  "message": "Not authorized, invalid token"
}
```

### 403 - Forbidden
```json
{
  "status": "error",
  "message": "Not authorized to access this resource"
}
```

### 404 - Not Found
```json
{
  "status": "error",
  "message": "Project not found"
}
```

### 409 - Conflict
```json
{
  "status": "error",
  "message": "User with this email already exists"
}
```

### 500 - Server Error
```json
{
  "status": "error",
  "message": "Failed to create project",
  "error": "Internal server error"
}
```

---

## 🔒 Authorization

### User Roles
- **admin**: Full access to all endpoints
- **architect**: Can create/manage projects, view all projects they're involved with
- **client**: Can view projects assigned to them, cannot create/delete

### Role-Based Endpoints
| Endpoint | Admin | Architect | Client |
|----------|-------|-----------|--------|
| POST /projects | ✅ | ✅ | ❌ |
| GET /projects | ✅ | ✅ | ✅ |
| GET /projects/:id | ✅ | ✅ | ✅ |
| PUT /projects/:id | ✅ | ✅* | ❌ |
| DELETE /projects/:id | ✅ | ✅* | ❌ |

\* Only if user is the project architect

---

## 📝 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal server error |

---

**API Version:** 1.0
**Last Updated:** 2026-01-27
