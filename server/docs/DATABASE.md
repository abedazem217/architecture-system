# 📊 Database Design & Architecture

## 🗄️ Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARCHITECT OFFICE SYSTEM                 │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │     USER     │
                          ├──────────────┤
                          │ _id (PK)     │
                          │ name         │
                          │ email        │ (UNIQUE)
                          │ phone        │
                          │ password     │ (hashed)
                          │ role         │ (enum)
                          │ profilePic   │
                          │ createdAt    │
                          │ updatedAt    │
                          └──────────────┘
                          /      |      \
                   ________/       |       \________
                  /              |              \
        ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐
        │    PROJECT      │  │   MEETING       │  │   DOCUMENT   │
        ├─────────────────┤  ├─────────────────┤  ├──────────────┤
        │ _id (PK)        │  │ _id (PK)        │  │ _id (PK)     │
        │ title           │  │ title           │  │ name         │
        │ description     │  │ description     │  │ type         │
        │ status          │  │ date            │  │ url/path     │
        │ architect (FK)  │  │ time            │  │ size         │
        │ client (FK)     │  │ location        │  │ project (FK) │
        │ startDate       │  │ status          │  │ uploadedBy   │
        │ endDate         │  │ project (FK)    │  │ uploadedAt   │
        │ budget          │  │ participants[]  │  │ updatedAt    │
        │ phase           │  │ notes           │  └──────────────┘
        │ createdAt       │  │ createdAt       │
        │ updatedAt       │  │ updatedAt       │
        └─────────────────┘  └─────────────────┘
                 │                    │
                 └────────────────────┘

```

## 📋 Database Collections

### 1. **USER** Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Auto-generated MongoDB ID |
| `name` | String | Required | Full name |
| `email` | String | Required, Unique | Email address |
| `phone` | String | Required | Phone number |
| `password` | String | Required | Hashed password (bcrypt) |
| `role` | Enum | Required | `admin`, `architect`, `client` |
| `profilePic` | String | Optional | Profile picture URL |
| `company` | String | Optional | Company name (for architects) |
| `address` | String | Optional | Address |
| `specialization` | String | Optional | Architect specialization |
| `isActive` | Boolean | Default: true | Account active status |
| `createdAt` | DateTime | Auto | Account creation date |
| `updatedAt` | DateTime | Auto | Last update date |

### 2. **PROJECT** Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Auto-generated |
| `title` | String | Required | Project name |
| `description` | String | Required | Project description |
| `status` | Enum | Default: planning | `planning`, `licensed`, `in_progress`, `completed`, `on_hold` |
| `architect` | ObjectId | Required, FK | References User (Architect) |
| `client` | ObjectId | Required, FK | References User (Client) |
| `startDate` | DateTime | Optional | Project start date |
| `endDate` | DateTime | Optional | Expected end date |
| `budget` | Number | Optional | Project budget |
| `location` | String | Optional | Project location |
| `phase` | Enum | Default: planning | `planning`, `licensing`, `construction`, `completion` |
| `documents` | [ObjectId] | Optional | Array of Document IDs |
| `meetings` | [ObjectId] | Optional | Array of Meeting IDs |
| `notes` | String | Optional | Internal notes |
| `createdAt` | DateTime | Auto | Creation date |
| `updatedAt` | DateTime | Auto | Last update |

### 3. **MEETING** Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Auto-generated |
| `title` | String | Required | Meeting title |
| `description` | String | Optional | Meeting description |
| `date` | DateTime | Required | Meeting date & time |
| `duration` | Number | Optional | Duration in minutes |
| `location` | String | Optional | Meeting location |
| `status` | Enum | Default: scheduled | `scheduled`, `completed`, `cancelled` |
| `project` | ObjectId | Required, FK | References Project |
| `createdBy` | ObjectId | Required, FK | References User |
| `participants` | [ObjectId] | Required | Array of User IDs |
| `notes` | String | Optional | Meeting notes/minutes |
| `attachments` | [ObjectId] | Optional | Array of Document IDs |
| `createdAt` | DateTime | Auto | Creation date |
| `updatedAt` | DateTime | Auto | Last update |

### 4. **DOCUMENT** Collection
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary Key | Auto-generated |
| `name` | String | Required | Document name |
| `type` | Enum | Required | `blueprint`, `license`, `contract`, `report`, `other` |
| `fileUrl` | String | Required | S3 or file path |
| `fileSize` | Number | Optional | File size in bytes |
| `mimeType` | String | Optional | File type (PDF, JPG, etc.) |
| `project` | ObjectId | Required, FK | References Project |
| `uploadedBy` | ObjectId | Required, FK | References User |
| `description` | String | Optional | Document description |
| `version` | Number | Default: 1 | Version number |
| `isPublic` | Boolean | Default: false | Public access flag |
| `createdAt` | DateTime | Auto | Upload date |
| `updatedAt` | DateTime | Auto | Last update |

---

## 🔗 Relationships

### One-to-Many
- **USER → PROJECT**: One architect can have many projects
- **USER → PROJECT**: One client can have many projects
- **PROJECT → MEETING**: One project can have many meetings
- **PROJECT → DOCUMENT**: One project can have many documents
- **USER → DOCUMENT**: One user can upload many documents
- **MEETING → DOCUMENT**: One meeting can have many document attachments

### Many-to-Many
- **MEETING ↔ USER**: Multiple users can attend multiple meetings
  - Implemented through `participants` array in MEETING

---

## 📈 Data Flow

```
CLIENT (Web Browser)
       ↓
   API Gateway
       ↓
┌──────────────────────────┐
│   EXPRESS SERVER         │
│   - Routes               │
│   - Controllers          │
│   - Middleware           │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│   MONGOOSE MODELS        │
│   - User                 │
│   - Project              │
│   - Meeting              │
│   - Document             │
└──────────────────────────┘
       ↓
┌──────────────────────────┐
│   MONGODB ATLAS          │
│   - Collections          │
│   - Indexes              │
│   - Validation Rules     │
└──────────────────────────┘
```

---

## 🔐 Indexes

### User Collection
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

### Project Collection
```javascript
db.projects.createIndex({ architect: 1 })
db.projects.createIndex({ client: 1 })
db.projects.createIndex({ status: 1 })
db.projects.createIndex({ createdAt: -1 })
```

### Meeting Collection
```javascript
db.meetings.createIndex({ project: 1 })
db.meetings.createIndex({ date: 1 })
db.meetings.createIndex({ status: 1 })
```

### Document Collection
```javascript
db.documents.createIndex({ project: 1 })
db.documents.createIndex({ uploadedBy: 1 })
db.documents.createIndex({ createdAt: -1 })
```

---

## 🚀 Sample Data

### User Examples
```javascript
// Architect
{
  name: "Ahmed Al-Hashimi",
  email: "ahmed@arch.com",
  phone: "+970123456789",
  role: "architect",
  company: "Modern Designs",
  specialization: "Residential Architecture"
}

// Client
{
  name: "Mohammed Abu Jaber",
  email: "client@example.com",
  phone: "+970987654321",
  role: "client"
}

// Admin
{
  name: "Admin User",
  email: "admin@system.com",
  role: "admin"
}
```

### Project Example
```javascript
{
  title: "Downtown Office Complex",
  description: "Modern 5-story office building",
  status: "in_progress",
  architect: ObjectId("..."),
  client: ObjectId("..."),
  startDate: "2025-01-15",
  endDate: "2025-07-15",
  budget: 500000,
  location: "Downtown, Nablus",
  phase: "construction"
}
```

---

## 📊 Stats & Growth

### Expected Data Growth
- Users: ~100-500 per year
- Projects: ~200-1000 per year
- Meetings: ~2000-5000 per year
- Documents: ~5000-20000 per year

### Storage Estimation
- Metadata: ~5-10 MB/year
- Documents/Files: ~100-500 GB/year (depending on usage)

---

## 🔄 Transactions & Consistency

### Atomic Operations Required
1. **Create Project**: Create project + initialize empty arrays
2. **Add Meeting**: Validate participants exist + add to project
3. **Upload Document**: Save file + create DB record

---

**Last Updated:** 2026-01-27
**Database:** MongoDB Atlas
**ORM:** Mongoose
