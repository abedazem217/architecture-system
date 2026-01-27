# Testing Checklist - Role-Based Access Control

## Automated Test Cases

### ✅ Frontend Tests

#### 1. Register Page
- [ ] Register page loads without errors
- [ ] Admin code field is visible
- [ ] Role selector is removed
- [ ] Admin code validation works (reject invalid code)
- [ ] Successful registration creates admin account
- [ ] Redirect to dashboard after registration

#### 2. Login Page
- [ ] Login with admin credentials works
- [ ] Redirect to dashboard after login
- [ ] User info shown in navbar

#### 3. Navbar
- [ ] Admin link appears for admin users
- [ ] Admin link has Shield icon
- [ ] Regular users don't see admin link
- [ ] Navigation works correctly

#### 4. Admin Dashboard
- [ ] Only admin users can access `/admin`
- [ ] Non-admin users redirected to dashboard
- [ ] Architects table displays correctly
- [ ] Add Architect button opens dialog
- [ ] Dialog form validates inputs correctly
- [ ] New architect appears in table after creation
- [ ] Success message displays
- [ ] Error handling for duplicate emails

### ✅ Backend Tests

#### 1. Register Endpoint
- [ ] `POST /api/auth/register` with correct admin code creates admin
- [ ] `POST /api/auth/register` with wrong admin code fails
- [ ] Duplicate email validation works
- [ ] Password hashing works

#### 2. Add Architect Endpoint
- [ ] `POST /api/auth/add-architect` creates architect account
- [ ] Only admin can call this endpoint
- [ ] Non-admin gets 403 error
- [ ] Input validation works
- [ ] Duplicate email check works
- [ ] Returns architect data without password

#### 3. Get Architects Endpoint
- [ ] `GET /api/auth/architects` returns list of all architects
- [ ] Only admin can access
- [ ] Non-admin gets 403 error
- [ ] Passwords not included in response

#### 4. Add Client Endpoint
- [ ] `POST /api/auth/add-client` creates client account
- [ ] Only architect can call this endpoint
- [ ] Non-architect gets 403 error
- [ ] Input validation works
- [ ] Creates user with client role

---

## Manual Testing Steps

### Test 1: Complete Admin Setup
```
1. Start servers (backend on 5000, frontend on 3001)
2. Navigate to http://localhost:3001/register
3. Fill in admin registration form:
   - Name: "Test Admin"
   - Email: "testadmin@test.com"
   - Phone: "+970123456789"
   - Admin Code: "ADMIN123"
   - Password: "testadmin123"
4. Submit form
5. Verify: Redirected to dashboard
6. Verify: Logged in as admin
```

### Test 2: Access Admin Dashboard
```
1. Stay logged in as admin
2. Click "Admin" link in navbar (or navigate to /admin)
3. Verify: Admin Dashboard loads
4. Verify: Architects table is visible and empty
```

### Test 3: Create Architect
```
1. In Admin Dashboard, click "Add Architect" button
2. Fill in architect form:
   - Name: "John Architect"
   - Email: "john@test.com"
   - Phone: "+970111111111"
   - Password: "john123"
3. Click "Create Architect"
4. Verify: Success message appears
5. Verify: John Architect appears in table
```

### Test 4: Verify Authorization
```
1. Logout from admin account
2. Try to access /admin directly in URL
3. Verify: Redirected to /dashboard
4. Verify: Admin link not visible in navbar
```

### Test 5: Verify Admin Code
```
1. Logout and go to register
2. Try registering with wrong admin code
3. Verify: Error message "Invalid admin code"
4. Try with correct code "ADMIN123"
5. Verify: Registration succeeds
```

---

## API Testing with Curl/Postman

### Test Register as Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "testadmin@test.com",
    "phone": "+970123456789",
    "password": "testadmin123",
    "role": "admin"
  }'
```

### Test Add Architect (needs admin token)
```bash
curl -X POST http://localhost:5000/api/auth/add-architect \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "John Architect",
    "email": "john@test.com",
    "phone": "+970111111111",
    "password": "john123"
  }'
```

### Test Get Architects (needs admin token)
```bash
curl -X GET http://localhost:5000/api/auth/architects \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Test Add Client (needs architect token)
```bash
curl -X POST http://localhost:5000/api/auth/add-client \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ARCHITECT_TOKEN" \
  -d '{
    "name": "Client Name",
    "email": "client@test.com",
    "phone": "+970222222222",
    "password": "client123"
  }'
```

---

## Browser Developer Tools Checks

### Network Tab
- [ ] Register request succeeds with 201 status
- [ ] Login request succeeds with 200 status
- [ ] Add Architect request succeeds with 201 status
- [ ] Token is included in Authorization header
- [ ] No 401/403 errors for authorized requests

### Console Tab
- [ ] No JavaScript errors
- [ ] No unhandled promise rejections
- [ ] AuthContext logs show correct user info
- [ ] No CORS errors

### Application Tab
- [ ] JWT token stored in localStorage
- [ ] Token includes user ID and role
- [ ] Token can be decoded (use jwt.io to verify)

---

## Expected Test Results

### Successful Flow
- Admin registers → Creates admin account ✅
- Admin logs in → Redirected to dashboard ✅
- Admin clicks Admin link → Goes to admin dashboard ✅
- Admin creates architect → Architect appears in list ✅
- Admin logs out → Cannot access admin features ✅

### Error Handling
- Wrong admin code → Error alert ✅
- Duplicate email → Error alert ✅
- Non-admin accessing admin → Redirected to dashboard ✅
- Non-architect creating client → 403 error ✅

---

## Performance Checks

- [ ] Page loads in < 3 seconds
- [ ] No unnecessary API calls
- [ ] Table renders smoothly with data
- [ ] Dialog opens/closes smoothly
- [ ] No console errors related to performance

---

## Security Checks

- [ ] Passwords are hashed (not visible in DB)
- [ ] Tokens expire correctly
- [ ] Cannot access admin features without admin role
- [ ] Email validation works
- [ ] SQL injection not possible (using Mongoose)
- [ ] XSS protection via React escaping
- [ ] CSRF tokens not needed (stateless JWT)

---

## Known Issues & Limitations

1. **Admin code is hardcoded** - Currently "ADMIN123" in code
   - Future: Move to environment variable

2. **No password reset** - Will need to implement later
   - Users must remember password after creation

3. **No email verification** - Any email can be used
   - Future: Add email verification for security

4. **Limited audit logging** - No log of who created accounts
   - Future: Add audit trail for compliance

5. **No rate limiting** - Could be abused for spam
   - Future: Add rate limiting to endpoints

---

## Browser Compatibility

- [ ] Chrome (v90+) - Tested ✅
- [ ] Firefox (v88+) - Should work ✅
- [ ] Safari (v14+) - Should work ✅
- [ ] Edge (v90+) - Should work ✅

---

## Rollback Plan (if needed)

If critical issues found:
1. Revert Register.jsx to old version
2. Revert App.js routing changes
3. Remove AdminDashboard.jsx
4. Remove new auth controller functions
5. Remove new routes from authRoutes.js
6. Revert auth middleware changes

---

Generated: 2024
Last Updated: Implementation Complete
Status: ✅ Ready for Testing
