# 🧪 Testing Guide - CCS Membership v2.0

## ✅ Pre-Testing Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Seed Database

```bash
npm run seed
```

**Created Test Accounts:**

- **Admin:** admin@ccs.edu / password123
- **Regular User:** student1@ccs.edu / password123
- **Another User:** student2@ccs.edu / password123

**Test Students Created:**

- 8 sample students with various majors and GPAs

### 3. Start Development Server

```bash
npm run dev
```

**Server will run at:** http://localhost:3000

---

## 🧪 Test Scenarios

### TEST 1: Authentication Flow ✅

#### 1.1 Test Registration

```
1. Navigate to: http://localhost:3000/auth/signup
2. Fill form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123
3. Click "Sign Up"
4. Expected: Should redirect to home, see toast success
5. Verify: Can see user name in header
```

#### 1.2 Test Login

```
1. Navigate to: http://localhost:3000/auth/login
2. Login as admin:
   - Email: admin@ccs.edu
   - Password: password123
3. Click "Login"
4. Expected: Redirect to home, see success toast
5. Verify: Can see "admin" in header, "Admin" link appears
```

#### 1.3 Test Logout

```
1. While logged in, click profile name in header
2. Should show navigation options
3. Click "Logout" (or refresh to see logout in menu)
4. Expected: Redirect to home, logged out state
5. Verify: Can no longer access protected routes
```

#### 1.4 Test Protected Routes (Not Logged In)

```
1. Make sure you're logged out
2. Try to navigate: http://localhost:3000/students/create
3. Expected: Redirect to login page
4. Try: http://localhost:3000/profile
5. Expected: Redirect to login page
6. Try: http://localhost:3000/admin/dashboard
7. Expected: Redirect to login page
```

---

### TEST 2: User Profile ✅

#### 2.1 View Profile

```
1. Login as admin@ccs.edu
2. Click username in header
3. Navigate to: http://localhost:3000/profile
4. Expected: See profile page with current name and email
5. Verify: "admin@ccs.edu" displayed
```

#### 2.2 Edit Profile

```
1. On profile page, edit name:
   - Old: Admin User
   - New: Admin Dashboard User
2. Click "Save Changes"
3. Expected: Success toast appears
4. Verify: Name persists after refresh
5. Edit email:
   - Try new email: admin.updated@ccs.edu
6. Click "Save Changes"
7. Expected: Success toast, email updated
```

#### 2.3 Change Password Link

```
1. On profile page, click "Change Password"
2. Expected: Navigate to /auth/forgot-password
3. See password reset form
```

---

### TEST 3: Password Reset ✅

#### 3.1 Forgot Password Request

```
1. Navigate to: http://localhost:3000/auth/forgot-password
2. Enter email: admin@ccs.edu
3. Click "Send Reset Link"
4. Expected: Success message appears
5. Check: Browser console for reset link (demo mode)
6. Copy the token from console
```

#### 3.2 Reset Password with Token

```
1. From console output, copy the full reset URL
2. Paste into browser: http://localhost:3000/auth/reset-password?token=...
3. Enter new password: NewPassword123
4. Confirm: NewPassword123
5. Click "Reset Password"
6. Expected: Success, redirect to login
7. Verify: Can login with new password
```

#### 3.3 Invalid Token

```
1. Try: http://localhost:3000/auth/reset-password?token=invalid
2. Expected: Error message "Invalid or expired reset link"
```

#### 3.4 Expired Token

```
1. Database field: resetTokenExpires (1 hour)
2. If > 1 hour old, should show error
```

---

### TEST 4: Student Management ✅

#### 4.1 View Student List

```
1. Login as admin@ccs.edu
2. Click "Students" in header
3. Navigate to: http://localhost:3000/students
4. Expected: See 8 test students listed
5. Verify: Each student shows name, email, major, GPA
```

#### 4.2 Create New Student

```
1. On students page, click "Add New Student" or go to /students/create
2. Fill form:
   - Name: New Test Student
   - Email: newstudent@example.com
   - Major: Computer Science
   - GPA: 3.85
   - Year: 2024
3. Click "Create Student"
4. Expected: Success toast, redirect to students list
5. Verify: New student appears in list
```

#### 4.3 View Student Details

```
1. On students list, click any student
2. Navigate to: http://localhost:3000/students/[id]
3. Expected: See full student profile
4. Verify: All details displayed correctly
5. Check: Edit and Delete buttons available
```

#### 4.4 Edit Student

```
1. On student detail page, click "Edit"
2. Modify:
   - Name: Updated Name
   - GPA: 3.90
3. Click "Update Student"
4. Expected: Success toast, changes saved
5. Verify: Changes persist on student list
```

#### 4.5 Delete Student

```
1. On student detail page, click "Delete"
2. Confirm: Click "Delete" in confirmation
3. Expected: Success toast, redirect to list
4. Verify: Student removed from list
5. Try to access deleted student URL: http://localhost:3000/students/[old-id]
6. Expected: Error or redirect
```

---

### TEST 5: Admin Dashboard ✅

#### 5.1 Access Admin Dashboard

```
1. Login as admin@ccs.edu
2. Click "Admin" link in header
3. Navigate to: http://localhost:3000/admin/dashboard
4. Expected: Admin dashboard loads
5. Verify: Sidebar navigation visible
```

#### 5.2 View Dashboard Statistics

```
1. On admin dashboard, verify cards display:
   - Total Users: (e.g., 3)
   - Total Students: (e.g., 8)
   - Total Admins: (e.g., 1)
   - Average GPA: (e.g., 3.81)
2. Expected: All stats loaded from API
3. Check: Recent users table (shows last 5)
4. Check: Recent students table (shows last 5)
5. Verify: Major distribution shown
```

#### 5.3 Test Admin Navigation

```
1. On dashboard, click "Dashboard" in sidebar
2. Expected: Stay on dashboard (or refresh)
3. Click "Users" in sidebar
4. Expected: Navigate to /admin/users
5. Click "Students" in sidebar
6. Expected: Navigate to /admin/students
7. Click "Back to App" link
8. Expected: Navigate back to home
```

---

### TEST 6: Admin User Management ✅

#### 6.1 View All Users

```
1. Login as admin, navigate to: http://localhost:3000/admin/users
2. Expected: See all users (pagination, 10 per page)
3. Verify: Each user shows email, name, role badge
4. Check: Pagination controls at bottom
```

#### 6.2 Create New User

```
1. On admin users page, click "Create User" button
2. Fill form:
   - Name: New Admin
   - Email: newadmin@ccs.edu
   - Password: AdminPass123
   - Check "Admin Role"
3. Click "Create"
4. Expected: Success toast, new user appears in list
5. Verify: User has "Admin" badge
```

#### 6.3 Edit User

```
1. On users list, click "Edit" on any user
2. Modify:
   - Name: Updated Name
   - Check/Uncheck admin checkbox
3. Click "Update"
4. Expected: Success toast, changes saved
5. Verify: Changes visible in list
```

#### 6.4 Toggle Admin Role

```
1. Find a non-admin user in list
2. Click "Edit"
3. Check "Admin Role"
4. Click "Update"
5. Expected: User now shows "Admin" badge
6. Edit again and uncheck to demote
```

#### 6.5 Delete User

```
1. Click "Delete" on a user (not yourself!)
2. Confirm deletion
3. Expected: User removed from list
4. Try to delete admin@ccs.edu
5. Expected: Error - "Cannot delete yourself"
6. Verify: Self-deletion prevented
```

#### 6.6 Pagination

```
1. Create 12+ new users (or use existing)
2. List should show 10 per page
3. Click "Next" button
4. Expected: Show next 10 users
5. Click "Previous" button
6. Expected: Show first 10 users
```

---

### TEST 7: Admin Student Management ✅

#### 7.1 View All Students

```
1. Login as admin, navigate to: /admin/students
2. Expected: See all students in paginated list
3. Verify: Each shows name, email, major, GPA
4. Check: Action buttons (View, Delete)
```

#### 7.2 Search Students by Name

```
1. On admin students page, find "Search" input
2. Type student name: "Test" or partial name
3. Expected: List filters in real-time
4. Verify: Only matching students shown
5. Clear search: Delete text
6. Expected: All students shown again
```

#### 7.3 Search Students by Email

```
1. Search input, type email: "example.com"
2. Expected: Students with that email shown
3. Try full email: "student1@ccs.edu"
4. Expected: Shows specific student
5. Clear search
```

#### 7.4 Filter by Major

```
1. Find "Filter by Major" dropdown
2. Select a major (e.g., "Computer Science")
3. Expected: Only students with that major shown
4. Try different major
5. Expected: List updates
6. Select "All Majors"
7. Expected: All students shown again
```

#### 7.5 Combined Search + Filter

```
1. Select major: "Computer Science"
2. Search name: "student"
3. Expected: Shows CS majors with "student" in name
4. Clear search: Shows all CS majors
5. Change filter: Shows all students with name match
```

#### 7.6 Export to CSV

```
1. On admin students page, click "Export to CSV"
2. Expected: File downloads as "students_YYYY-MM-DD.csv"
3. Open CSV in Excel/Sheets
4. Verify: Columns include (Name, Email, Major, GPA, Year)
5. Verify: All students included
```

#### 7.7 View Student Details

```
1. Click "View" on a student
2. Expected: Navigate to student detail page
3. Verify: All info displayed
```

#### 7.8 Delete Student

```
1. On admin students, click "Delete" on a student
2. Confirm: Click "Delete" in confirmation
3. Expected: Student removed from list
4. Verify: Cannot see deleted student in search/filter
```

---

### TEST 8: Toast Notifications ✅

#### 8.1 Success Notifications

```
Trigger success toasts:
1. Login successfully
2. Create student → Success toast (green)
3. Update profile → Success toast (green)
4. Verify: Toast appears bottom-right, auto-dismisses in 3 seconds
```

#### 8.2 Error Notifications

```
Trigger error toasts:
1. Try login with wrong password → Error toast (red)
2. Try register with duplicate email → Error toast (red)
3. Try invalid form inputs → Error toast (red)
4. Verify: Toast shows error message
```

#### 8.3 Warning Notifications

```
Look for warning toasts:
1. Incomplete form fields → May show warning
2. Verify: Yellow/warning color
```

#### 8.4 Info Notifications

```
Look for info toasts:
1. Navigation or info messages → Blue toast
```

#### 8.5 Toast Duration

```
1. Trigger any toast
2. Count 3 seconds
3. Expected: Toast automatically disappears
4. Can manually close: Click toast or X button
```

---

### TEST 9: Authorization & Security ✅

#### 9.1 Non-Admin Access to Admin Pages

```
1. Login as student1@ccs.edu (regular user, not admin)
2. Try to navigate: http://localhost:3000/admin/dashboard
3. Expected: Redirect to login or home (access denied)
4. Try: http://localhost:3000/admin/users
5. Expected: Denied
6. Try: http://localhost:3000/admin/students
7. Expected: Denied
```

#### 9.2 Admin-Only API Endpoints

```
Using Postman or curl:

1. Get user token (non-admin):
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@ccs.edu","password":"password123"}'

2. Try to access admin endpoint:
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <token>"

3. Expected: 403 Forbidden response

4. Try with admin token:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ccs.edu","password":"password123"}'

5. Use admin token on admin endpoint:
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <admin_token>"

6. Expected: 200 OK with stats data
```

#### 9.3 Protected Routes

```
1. Logout completely
2. Try to access: http://localhost:3000/students/create
3. Expected: Redirect to login page
4. Try: http://localhost:3000/profile
5. Expected: Redirect to login page
6. Check header - should show login/signup links (no profile name)
```

#### 9.4 Password Security

```
1. Check database (MongoDB):
   - Passwords should be hashed (bcryptjs)
   - Should NOT be plain text
   - Should start with $2a$ or $2b$ (bcrypt prefix)

2. Check local storage (Browser DevTools):
   - Token stored: Yes
   - Password stored: No (should never be stored)

3. Check network (Browser Network tab):
   - Passwords transmitted with HTTPS ready: Yes
   - Tokens in Authorization header: Yes
```

---

### TEST 10: Responsive Design ✅

#### 10.1 Mobile Layout (320px)

```
1. Open DevTools: F12
2. Click device toggle: Ctrl+Shift+M
3. Select: iPhone SE (375px)
4. Navigate to home: http://localhost:3000
5. Verify:
   - Header responsive
   - Hero section stacks vertically
   - Features stack vertically
   - Footer readable
6. Check: No horizontal scrolling
```

#### 10.2 Tablet Layout (768px)

```
1. Select iPad (768px) in DevTools
2. Navigate to /students
3. Verify:
   - Table reformats nicely
   - Buttons accessible
   - Forms readable
4. Navigate to /admin/dashboard
5. Verify: Cards stack appropriately
```

#### 10.3 Desktop Layout (1024px+)

```
1. Full window, normal desktop
2. Navigate to /admin/users
3. Verify: Sidebar + main content visible
4. Check: All information accessible
```

#### 10.4 Form Responsiveness

```
1. On mobile: /auth/login
2. Verify: Form fills width with padding
3. Verify: Buttons full width or stacked
4. Verify: Input fields large enough to tap
```

---

### TEST 11: API Testing (Advanced)

#### 11.1 Test Login Endpoint

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ccs.edu",
    "password": "password123"
  }'

Expected Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "_id": "...",
    "email": "admin@ccs.edu",
    "name": "Admin User",
    "isAdmin": true
  }
}
```

#### 11.2 Test Register Endpoint

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "name": "New User",
    "password": "TestPass123"
  }'

Expected: 201 Created with user data
```

#### 11.3 Test Protected Endpoint

```bash
TOKEN="<from_login_response>"

curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"

Expected: User profile data
```

#### 11.4 Test Admin Endpoint

```bash
ADMIN_TOKEN="<admin_token_from_login>"

curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer $ADMIN_TOKEN"

Expected: Dashboard statistics
```

#### 11.5 Test Student Endpoints

```bash
# Get all students
curl http://localhost:3000/api/students

# Create student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Student",
    "email": "test@example.com",
    "major": "Computer Science",
    "gpa": 3.9,
    "enrollmentYear": 2024
  }'

# Get specific student
curl http://localhost:3000/api/students/[id]

# Update student
curl -X PUT http://localhost:3000/api/students/[id] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Updated Name"}'

# Delete student
curl -X DELETE http://localhost:3000/api/students/[id] \
  -H "Authorization: Bearer $TOKEN"
```

---

### TEST 12: Error Handling ✅

#### 12.1 Invalid Login

```
1. Navigate to: http://localhost:3000/auth/login
2. Enter: admin@ccs.edu / wrongpassword
3. Click Login
4. Expected: Error message "Invalid credentials"
5. Toast shows error in red
```

#### 12.2 Duplicate Email Registration

```
1. Try to register with: admin@ccs.edu
2. Click Sign Up
3. Expected: Error "Email already in use"
```

#### 12.3 Missing Form Fields

```
1. Try login without password
2. Expected: Validation error or disabled button
3. Try register without name
4. Expected: Error message
```

#### 12.4 Database Connection Error

```
1. Stop MongoDB (or disconnect)
2. Try login
3. Expected: Server error message
4. Restart MongoDB
5. Should work again
```

#### 12.5 Invalid API Request

```
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Missing email"
  }'

Expected: 400 Bad Request with validation errors
```

---

## 📊 Test Summary Checklist

### Authentication ✅

- [ ] Registration works
- [ ] Login works
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Tokens stored in localStorage

### User Features ✅

- [ ] Profile view works
- [ ] Profile edit works
- [ ] Name update persists
- [ ] Email update persists
- [ ] Change password flow works

### Password Reset ✅

- [ ] Forgot password form works
- [ ] Token generated and logged
- [ ] Reset password with token works
- [ ] Invalid token shows error
- [ ] Can login with new password

### Student Management ✅

- [ ] View all students
- [ ] Create student works
- [ ] View student details
- [ ] Edit student works
- [ ] Delete student works
- [ ] Changes persist

### Admin Features ✅

- [ ] Admin can access dashboard
- [ ] Non-admin cannot access admin
- [ ] Dashboard stats correct
- [ ] User management CRUD works
- [ ] Student management CRUD works
- [ ] Search functionality works
- [ ] Filter functionality works
- [ ] CSV export works

### Notifications ✅

- [ ] Success toasts appear
- [ ] Error toasts appear
- [ ] Toasts auto-dismiss
- [ ] Toast colors correct

### Security ✅

- [ ] Non-admin denied admin access
- [ ] API endpoints require admin token
- [ ] Passwords hashed
- [ ] Cannot delete yourself
- [ ] Protected routes work

### Responsive Design ✅

- [ ] Mobile layout (320px)
- [ ] Tablet layout (768px)
- [ ] Desktop layout (1024px)
- [ ] No horizontal scroll
- [ ] Forms readable

### Error Handling ✅

- [ ] Invalid login error
- [ ] Duplicate email error
- [ ] Missing field validation
- [ ] Server errors handled
- [ ] Network errors handled

---

## 🐛 Debugging Tips

### Browser Console

```javascript
// Check localStorage
console.log(localStorage.getItem("token"));

// Check user from auth context
console.log(user);

// Check if admin
console.log(isAdmin);
```

### Network Tab

1. Open DevTools → Network
2. Filter by `fetch/XHR`
3. Watch requests and responses
4. Check status codes
5. Verify request headers

### MongoDB Compass

```
1. View users collection
2. Check isAdmin field
3. Verify password hashing
4. Check resetToken field
```

### Server Logs

1. Watch terminal where `npm run dev` is running
2. See incoming requests
3. Check for errors
4. Watch database operations

---

## ✅ Test Results Template

```
=== CCS Membership v2.0 - Test Results ===

Date: _____________
Tester: ___________

Authentication: PASS / FAIL
User Features: PASS / FAIL
Password Reset: PASS / FAIL
Student CRUD: PASS / FAIL
Admin Dashboard: PASS / FAIL
Admin Users: PASS / FAIL
Admin Students: PASS / FAIL
Search/Filter: PASS / FAIL
Notifications: PASS / FAIL
Security: PASS / FAIL
Responsive: PASS / FAIL
Error Handling: PASS / FAIL

Overall: PASS / FAIL

Issues Found:
_____________________________________________

Notes:
_____________________________________________
```

---

## 🎯 Expected Outcomes

### All Tests Should Pass ✅

- No console errors
- No unhandled rejections
- All forms validate correctly
- All API endpoints respond
- All redirects work
- All pages load
- No broken links
- Responsive on all sizes

### Application Should Be

- ✅ User-friendly
- ✅ Responsive
- ✅ Secure
- ✅ Fast
- ✅ Reliable
- ✅ Professional

---

## 📞 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"

**Solution:**

```bash
# Make sure MongoDB is running
mongod

# Or check connection string in .env.local
# Should be: mongodb://localhost:27017/ccs-membership
```

### Issue: "Token is invalid or expired"

**Solution:**

```bash
# Clear localStorage
localStorage.clear()

# Logout and login again
# Or restart browser
```

### Issue: "Admin access required (403)"

**Solution:**

```
1. Make sure logged in as admin@ccs.edu
2. Check if isAdmin in token
3. Verify user is marked as admin in database
```

### Issue: "Pages not loading (404)"

**Solution:**

```bash
# Restart dev server
# Ctrl+C to stop
npm run dev
```

### Issue: "Styles not loading"

**Solution:**

```bash
# Clear browser cache
# Ctrl+Shift+Delete

# Or hard refresh
# Ctrl+Shift+R (Windows)
# Cmd+Shift+R (Mac)
```

---

## 🚀 You're Ready to Test!

**Start with:**

1. `npm run seed`
2. `npm run dev`
3. Follow Test 1: Authentication Flow
4. Then proceed through remaining tests

**Expected Duration:** 30-60 minutes for full test suite

**Good Luck! 🎉**
