# Quick Reference Guide

## File Navigation

### Frontend Pages
| Page | Path | Purpose |
|------|------|---------|
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Project overview |
| Projects | `/projects` | Project management |
| Meetings | `/meetings` | Meeting scheduling |
| Documents | `/documents` | Document management |
| Project Details | `/projects/:id` | Detailed project view |

### Backend Files Structure
```
server/
├── controllers/      → Business logic for each resource
├── models/          → Database schemas
├── routes/          → API endpoint definitions
├── middlewares/     → Auth, error handling, etc.
├── config/          → Database connection
├── utils/           → Helper functions
├── constants/       → App constants
└── validators/      → Input validation
```

### Frontend Files Structure
```
client/src/
├── pages/           → Page components (full pages)
├── components/      → Reusable components
├── services/        → API communication (api.js)
├── context/         → State management (AuthContext)
├── hooks/           → Custom React hooks
├── constants/       → App constants
├── utils/           → Helper functions
├── App.js           → Router setup
└── index.js         → Entry point
```

## Common Commands

### Backend
```bash
cd server
npm install              # Install dependencies
npm run dev              # Start development server
npm start                # Start production server
npm test                 # Run tests
npm run build            # Build for production
```

### Frontend
```bash
cd client
npm install              # Install dependencies
npm start                # Start development server
npm run build            # Build for production
npm test                 # Run tests
npm run eject            # Eject from create-react-app (irreversible)
```

## API Call Pattern (Frontend)

```javascript
// Import API service
import { projectAPI } from '../services/api.js';

// Get all projects
const response = await projectAPI.getAll({ limit: 50 });
const projects = response.data.data;

// Get specific project
const project = await projectAPI.getById(id);

// Create project
const newProject = await projectAPI.create(formData);

// Update project
const updated = await projectAPI.update(id, updateData);

// Delete project
await projectAPI.delete(id);
```

## Authentication Flow

```javascript
// 1. Login
const { user, token } = await authAPI.login(email, password);

// 2. Token stored in localStorage automatically
// 3. Every request includes token in header (via interceptor)
// 4. Logout clears token and redirects
await authAPI.logout();
```

## Component Pattern

```javascript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyComponent() {
  const { user, isArchitect } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      setData(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* JSX here */}
    </Container>
  );
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/architect-office
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Material-UI Components Used

- `Container` - Layout wrapper
- `Paper` - Card/container
- `TextField` - Input field
- `Button` - Clickable button
- `Table` - Data display
- `Dialog` - Modal form
- `Chip` - Status badge
- `Alert` - Notifications
- `CircularProgress` - Loading spinner
- `Box` - Flex container
- `Grid` - Responsive grid
- `Typography` - Text display
- `Navbar/AppBar` - Top navigation

## Database Connection

MongoDB URI formats:
```
# Local
mongodb://localhost:27017/architect-office

# Atlas Cloud
mongodb+srv://username:password@cluster.mongodb.net/architect-office
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend | 5000 | http://localhost:5000 |
| Frontend | 3000 | http://localhost:3000 |
| MongoDB | 27017 | localhost:27017 |

## User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | All access |
| **Architect** | Create projects, manage meetings/documents |
| **Client** | View projects, participate in meetings |

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed",
  "data": { /* actual data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| Cannot find module | Missing npm install | Run `npm install` |
| ECONNREFUSED | MongoDB not running | Start MongoDB |
| EADDRINUSE | Port in use | Change PORT in .env |
| CORS error | Wrong CLIENT_URL | Check .env |
| 401 Unauthorized | Invalid token | Login again |
| 403 Forbidden | Insufficient permissions | Check user role |
| 404 Not Found | Resource doesn't exist | Verify ID |

## File Upload Mock

Currently using file URLs:
```javascript
// Frontend: User provides URL string
const formData = {
  name: "Blueprint.pdf",
  fileUrl: "https://example.com/file.pdf"
};

// For real file upload, use:
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
```

## Debugging Tips

1. **Check Browser Console**
   - Open DevTools (F12)
   - Check Network tab for API calls
   - Check Console for errors

2. **Check Server Logs**
   - Terminal where `npm run dev` is running
   - Look for error stack traces

3. **MongoDB Debugging**
   - Use MongoDB Compass to view data
   - Or mongosh CLI tool

4. **API Testing**
   - Use Postman or Thunder Client
   - Test endpoints directly
   - Check request/response format

## Performance Tips

- Use pagination for large datasets
- Implement search/filter on frontend
- Cache API responses
- Lazy load routes
- Use React.memo for expensive components
- Optimize images and files
- Use MongoDB indexes

## Security Checklist

- ✅ Never commit .env files
- ✅ Use strong JWT_SECRET
- ✅ Validate all inputs
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Regular security audits
- ✅ Keep dependencies updated

## Useful Links

- [MongoDB Docs](https://docs.mongodb.com/)
- [Express Guide](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)

## Testing Workflow

1. Start backend: `npm run dev`
2. Start frontend: `npm start`
3. Login with test credentials
4. Test each feature:
   - Create project
   - Schedule meeting
   - Upload document
   - View details
   - Edit/delete items

## Deployment Checklist

- [ ] Update .env for production
- [ ] Set NODE_ENV=production
- [ ] Configure database (MongoDB Atlas)
- [ ] Update REACT_APP_API_URL
- [ ] Test all features
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Document deployment steps

## Quick Troubleshooting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear MongoDB
mongo
db.dropDatabase()

# Clear browser cache
# Chrome: DevTools → Application → Clear storage

# Kill port processes
lsof -i :5000  # Find what's using port 5000
kill -9 <PID>  # Kill the process
```

---

**Last Updated:** 2024
**Version:** 1.0
