# Frontend Tests

## 📝 Test Structure

### Unit Tests
- **Location:** `*.test.js`
- **Framework:** Jest + React Testing Library
- **Coverage:** Components, Hooks, Utilities

### Integration Tests
- **Location:** `*.integration.test.js`
- **Framework:** Jest + React Testing Library
- **Coverage:** Page flows, User interactions

### E2E Tests
- **Location:** Not in this folder (Cypress)
- **Framework:** Cypress
- **Coverage:** Complete user workflows

## 🧪 What to Test

1. **Components**
   - Rendering
   - Props validation
   - Event handling
   - Conditional rendering

2. **Hooks**
   - useAuth
   - Custom hooks

3. **Utilities**
   - Date formatting
   - Email validation
   - Text manipulation

4. **Pages**
   - User flows
   - Navigation
   - Data loading

## 🏃 Test Commands

```bash
# Run tests in watch mode
npm test

# Generate coverage report
npm test -- --coverage

# Run Cypress E2E tests
npm run cypress:open
```

## 📊 Current Coverage
- To be updated as tests are created
