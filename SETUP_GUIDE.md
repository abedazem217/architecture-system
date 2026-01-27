# Setup Guide - Architect Office System

## Quick Start

### 1. Database Setup (MongoDB)

#### Option A: Local MongoDB
```bash
# Download and install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Windows: Start MongoDB service
net start MongoDB

# macOS/Linux: Start MongoDB
brew services start mongodb-community
# or
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Add to `.env` file

### 2. Environment Configuration

#### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/architect-office
JWT_SECRET=architect_office_secret_2024_change_in_production
JWT_EXPIRE=7d
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Installation & Running

#### Terminal 1 - Backend
```bash
cd architect-office-system/server
npm install
npm run dev
```
Expected output:
```
Server running on port 5000
Environment: development
```

#### Terminal 2 - Frontend
```bash
cd architect-office-system/client
npm install
npm start
```
Expected output:
```
Compiled successfully!
You can now view architect-office-client in the browser at http://localhost:3000
```

### 4. Access Application

Open browser and go to: `http://localhost:3000`

## First Time Setup

### Create Test Accounts

**Architect Account:**
- Email: architect@test.com
- Password: password123
- Role: Architect

**Client Account:**
- Email: client@test.com
- Password: password123
- Role: Client

### Test Workflow

1. **Login as Architect**
   - Navigate to Projects page
   - Click "Create New Project"
   - Fill project details
   - Save

2. **Create Meeting**
   - Go to Meetings page
   - Click "Schedule Meeting"
   - Select the project
   - Set date and time
   - Save

3. **Upload Document**
   - Go to Documents page
   - Click "Upload Document"
   - Select document type
   - Upload file URL
   - Save

4. **View Project Details**
   - Go to Projects
   - Click on a project
   - View overview, details, team info

## API Testing with Postman

### Import Collection

1. Open Postman
2. Create new collection: "Architect Office System"
3. Add requests:

**Register**
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Architect",
  "email": "john@test.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "architect"
}
```

**Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@test.com",
  "password": "password123"
}
```

Response includes token:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

**Add to Header for Protected Routes**
- Key: Authorization
- Value: Bearer {token}

**Create Project**
```
POST http://localhost:5000/api/projects
Headers: Authorization: Bearer {token}
Body (JSON):
{
  "title": "Downtown Office Building",
  "description": "Modern office complex",
  "clientId": "client_user_id",
  "budget": 500000,
  "location": "Downtown District",
  "startDate": "2024-01-15",
  "endDate": "2025-12-31"
}
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Try: `mongosh` command to verify

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000               # macOS/Linux

# Kill process
taskkill /PID {PID} /F      # Windows
kill -9 {PID}              # macOS/Linux
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Verify CLIENT_URL in server `.env` matches frontend URL
- Restart backend server

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
cd server
npm install
npm list  # Verify all packages installed
```

### Token Expired
```
Error: jwt expired
```
**Solution:**
- Backend automatically refreshes token on API calls
- Login again if error persists
- Check JWT_EXPIRE in `.env`

## Deployment Checklist

### Backend Deployment (Heroku/Render)
- [ ] Change JWT_SECRET to strong value
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas
- [ ] Set CLIENT_URL to production frontend URL
- [ ] Test all API endpoints
- [ ] Enable HTTPS

### Frontend Deployment (Vercel/Netlify)
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Run `npm run build`
- [ ] Configure environment variables
- [ ] Test authentication flow
- [ ] Verify API calls work

### Pre-Deployment Testing
```bash
# Backend
npm test

# Frontend
npm run build
npm test
```

## Development Best Practices

### Code Style
- Use ES6+ syntax
- Follow naming conventions (camelCase for variables, PascalCase for components)
- Add comments for complex logic

### Git Workflow
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create Pull Request
```

### Database Backups
```bash
# Backup MongoDB
mongodump --out ./backup

# Restore MongoDB
mongorestore ./backup
```

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Docs](https://mui.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/)

## Support

For issues:
1. Check error message carefully
2. Review troubleshooting section
3. Check console logs (browser DevTools, server terminal)
4. Verify `.env` configuration
5. Create GitHub issue with error details

## Performance Tips

- Use MongoDB indexes for frequently queried fields
- Implement pagination for large datasets
- Cache API responses when appropriate
- Optimize React component renders with React.memo
- Use lazy loading for routes

## Security Considerations

- Never commit `.env` files
- Use strong JWT_SECRET
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Regular security audits
