# Backend Tests

## 📝 Test Structure

### Unit Tests
- **Location:** `*.test.js`
- **Framework:** Jest
- **Coverage:** Controllers, Validators, Utilities

### Integration Tests
- **Location:** `*.integration.test.js`
- **Framework:** Jest + Supertest
- **Coverage:** API Endpoints, Middleware

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🧪 What to Test

1. **Authentication**
   - User login/logout
   - JWT token validation
   - Password hashing

2. **Authorization**
   - Role-based access control
   - Project permissions
   - Document access

3. **Project Management**
   - CRUD operations
   - Status transitions
   - Data validation

4. **Meetings**
   - Scheduling
   - Participant management
   - Status updates

5. **Documents**
   - File upload
   - Access control
   - Deletion

## 📊 Current Coverage
- To be updated as tests are created
