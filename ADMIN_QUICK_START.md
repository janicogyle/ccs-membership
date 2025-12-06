# 🔐 Admin Dashboard Quick Start

Get started with the admin panel in 2 minutes.

---

## 📍 Where to Access

After logging in as admin, click **"Admin"** in the header navigation, or navigate directly to:

```
http://localhost:3000/admin/dashboard
```

---

## 🔑 Admin Credentials

After running `npm run seed`:

```
Email:    admin@ccs.edu
Password: password123
```

---

## 🎯 Main Features

### 1️⃣ Dashboard (`/admin/dashboard`)

**View:** System statistics and overview

- Total users, students, admins
- Average student GPA
- Recent signups
- Student distribution by major
- Recent student additions

**Quick Access:** Click "📊 Dashboard" in sidebar

### 2️⃣ Users Management (`/admin/users`)

**Manage:** All system users

**Actions:**

- ➕ Create new user
- ✏️ Edit user details
- 👑 Promote/demote admin role
- 🗑️ Delete user
- 📄 View paginated list

**Pagination:** 10 users per page

### 3️⃣ Students Management (`/admin/students`)

**Manage:** All student records

**Features:**

- 🔍 Search by name/email
- 🎯 Filter by major
- 📥 Export to CSV
- 🗑️ Delete records
- 👁️ View student details

---

## 🚀 Quick Actions

### Create New Admin User

```
1. Go to /admin/users
2. Click "+ Add User"
3. Fill form:
   - Name: John Admin
   - Email: john@ccs.edu
   - Password: secure123
   - Check "Admin User"
4. Click "Create"
```

### Search for Student

```
1. Go to /admin/students
2. Type in search box: "Alice"
3. See filtered results
4. Click "View" to see details
```

### Export Student List

```
1. Go to /admin/students
2. Click "📥 Export CSV"
3. File downloads: students-2024-12-04.csv
```

---

## 🔄 Admin Workflows

### Make User an Admin

```
Dashboard → Users → Find User → Edit → Check Admin → Update
```

### Delete Problematic User

```
Dashboard → Users → Find User → Delete → Confirm
```

### Monitor System Health

```
Dashboard → Review Stats → Check Recent Activity
```

### Manage Student Records

```
Dashboard → Students → Search/Filter → View/Delete
```

---

## 💡 Tips & Tricks

- **Search is Real-time** - Type while viewing results
- **Filters Work Together** - Search + filter work simultaneously
- **CSV Export Includes Everything** - All student fields included
- **Can't Delete Yourself** - Prevents accidental self-deletion
- **Pagination Persists** - Page number stays when editing

---

## ⚠️ Important Notes

- ✅ Only admins can access `/admin/*` pages
- ✅ Non-admins redirected to login
- ✅ Admin pages require valid JWT token
- ✅ All changes logged (in production)
- ✅ Passwords are hashed automatically

---

## 🧪 Test Scenarios

### Scenario 1: Create & Manage User

```
1. Login as admin@ccs.edu
2. Go to /admin/users
3. Create user "test@example.com"
4. Edit and make admin
5. Verify in list
6. Delete user
```

### Scenario 2: Monitor Students

```
1. Go to /admin/dashboard
2. Check student stats
3. Go to /admin/students
4. Filter by "Computer Science"
5. Export to CSV
6. Open CSV in spreadsheet
```

### Scenario 3: System Overview

```
1. Open /admin/dashboard
2. Note total counts
3. Review recent activity
4. Check GPA statistics
5. See major distribution
```

---

## 🆘 Troubleshooting

**Can't access admin panel?**

- Make sure you're logged in
- Check if your account is admin (ask another admin to verify)
- Try `/admin/dashboard` directly

**Changes not saving?**

- Check browser console for errors
- Verify database connection
- Ensure JWT token is valid

**Search not working?**

- Press Enter after typing
- Check spelling
- Try different search terms

---

## 📞 Next Steps

After exploring admin:

1. Create additional admin users
2. Review student data
3. Set up email for password reset
4. Configure user roles as needed
5. Monitor system statistics

---

**Happy administrating! 🎉**
