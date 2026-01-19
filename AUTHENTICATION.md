# Authentication System Guide

## Quick Start

### Default Accounts

After running the database initialization (`/api/init`), these accounts will be available:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Admin | admin@techquality.com | admin123 | Full system access |
| Customer | customer@example.com | customer123 | Customer features |

**⚠️ CRITICAL**: Change these credentials before deploying to production!

## User Roles Overview

### 1. Guest (Unauthenticated)
- **Default state**: Any visitor not logged in
- **Access**:
  ✅ Browse all products
  ✅ View product details
  ✅ Search products
  ✅ View team page
  ✅ Use contact form
  ✅ Search with QR codes
  ❌ Cannot add items to cart (will show login prompt)
  ❌ Cannot checkout
  ❌ Cannot view orders
  
- **Navigation**: Shows "Login" and "Register" buttons in header

### 2. Customer
- **How to become**: Register at `/register` or login at `/login`
- **Access**:
  ✅ All Guest features
  ✅ Add products to shopping cart
  ✅ Place orders
  ✅ View order history
  ✅ Cancel pending orders
  ✅ Edit profile (name, phone, address)
  ❌ Cannot access admin features
  
- **Navigation**: Header shows name with "Profile" link and "Logout" button
- **Profile Page**: `/profile` - view/edit info and order history

### 3. Admin
- **How to become**: Pre-configured account only (cannot register as admin)
- **Access**:
  ✅ All Customer features
  ✅ Admin dashboard with statistics
  ✅ Create/edit/delete products
  ✅ Generate QR codes for products
  ✅ View all orders from all customers
  ✅ Approve/reject orders
  ✅ Update order status
  ✅ Add notes to orders
  ✅ View all user accounts
  ✅ Block/unblock user accounts
  
- **Navigation**: Header shows name with red "ADMIN" badge and link to admin dashboard
- **Admin Dashboard**: `/admin/dashboard` - system overview
- **Management Pages**:
  - `/admin/products` - Product management
  - `/admin/orders` - Order management
  - `/admin/users` - User management

## Authentication Flow

### Registration (New Customer)

1. **Navigate** to `/register` or click "Register" in header
2. **Fill form** with:
   - Name (required)
   - Email (required, must be valid format)
   - Password (required, min 6 characters)
   - Confirm Password (must match password)
   - Phone (optional)
   - Address (optional)
3. **Submit** - Account created with role: 'customer'
4. **Auto-login** - Automatically logged in after registration
5. **Redirect** to home page

#### Registration Validation
- Email must be unique (not already registered)
- Email must be valid format
- Password must be at least 6 characters
- Password confirmation must match
- Name must be provided

### Login

1. **Navigate** to `/login` or click "Login" in header
2. **Enter credentials**:
   - Email
   - Password
3. **Submit**
4. **Backend validates**:
   - User exists
   - Account is not blocked
   - Password is correct
5. **JWT token generated** and stored in httpOnly cookie
6. **Redirect** based on role:
   - Admin → `/admin/dashboard`
   - Customer → `/` (home page)

#### Login Errors
- "Invalid credentials" - Wrong email or password
- "Account is blocked" - Admin has blocked this account
- "User not found" - Email not registered

### Logout

1. **Click** "Logout" button in header (visible when logged in)
2. **Token cleared** - httpOnly cookie removed
3. **State reset** - Client auth state cleared
4. **Redirect** to home page

### Session Management

- **Token Lifespan**: 7 days
- **Storage**: httpOnly cookie (name: "token")
- **Auto-check**: App checks auth status on every page load
- **Expiration**: After 7 days, user must login again
- **Security**: Token is not accessible via JavaScript (httpOnly flag)

## Protected Routes

### Client-Side Protection

Pages that require authentication:
- `/checkout` - Redirects to `/login?redirect=/checkout`
- `/profile` - Redirects to `/login`
- `/admin/*` - Redirects to `/login` (admin only)

### Server-Side Protection (API Middleware)

API endpoints are protected with middleware:

```javascript
// Require any authenticated user
requireAuth(handler)

// Require admin role
requireAdmin(handler)

// Require customer or admin role
requireCustomer(handler)
```

Protected endpoints return:
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Wrong role (e.g., customer trying to access admin endpoint)

## Password Security

### Hashing
- **Algorithm**: bcrypt
- **Salt rounds**: 10
- **Process**: Password → bcrypt.hash() → Stored in database
- **Verification**: Input password → bcrypt.compare() → Matches hashed password

### Requirements
- Minimum length: 6 characters
- No maximum length
- Any characters allowed

### Best Practices (for production)
- Increase minimum length to 8-12 characters
- Require mix of uppercase, lowercase, numbers, symbols
- Implement password strength meter
- Add "forgot password" functionality
- Implement password change feature

## Order Management & Roles

### Order Status Workflow

```
PENDING → APPROVED → SHIPPED → DELIVERED
   ↓          ↓
CANCELLED  REJECTED
```

### Customer Capabilities
1. **Create Order**: Checkout process creates order with status "pending"
2. **View Orders**: See own orders only in `/profile`
3. **Cancel Order**: Can cancel orders with status "pending" only
4. **Order History**: View all past orders with status

### Admin Capabilities
1. **View All Orders**: See orders from all customers
2. **Filter Orders**: Filter by status (pending, approved, etc.)
3. **Approve Order**: Change status from "pending" to "approved"
4. **Reject Order**: Change status from "pending" to "rejected"
5. **Mark Shipped**: Change status from "approved" to "shipped"
6. **Mark Delivered**: Change status from "shipped" to "delivered"
7. **Add Notes**: Attach admin notes to any order
8. **View Details**: See full order details including customer info and items

## User Management (Admin Only)

### View Users
- Access: `/admin/users`
- Shows: All user accounts
- Info: Name, email, role, status, join date
- Search: By name or email
- Filter: By role (admin, customer, guest)

### Block User
- Admin can block any customer account
- Blocked users cannot login
- Existing session remains valid until token expires
- Use case: Prevent fraudulent or problematic users

### Unblock User
- Admin can unblock previously blocked users
- User can immediately login again
- All features restored

**Note**: Admin accounts cannot be blocked

## Product Management (Admin Only)

### Create Product
- Access: `/admin/products` → "Add New Product"
- Fields:
  - Name (required)
  - Description (required)
  - Price (required, USD)
  - Stock (required, integer)
  - Image URL (required)
- **QR Code**: Automatically generated on creation

### Edit Product
- Click "Edit" on any product
- Modify any field
- QR code remains unchanged

### Delete Product
- Click "Delete" on any product
- Confirmation required
- Permanently removes product
- Orders referencing product are not affected

## Troubleshooting

### "Unauthorized" Error
**Problem**: API returns 401 Unauthorized
**Solutions**:
1. Check if logged in - try logging out and back in
2. Token may have expired - login again
3. Clear browser cookies and login again
4. Check browser console for errors

### "Forbidden" Error
**Problem**: API returns 403 Forbidden
**Solutions**:
1. Check your role - you may not have permission
2. Admin-only features require admin account
3. Verify you're using the correct account

### Cannot Login
**Problem**: Login fails even with correct credentials
**Solutions**:
1. Check if account is blocked (contact admin)
2. Verify email and password are correct
3. Check for typos or extra spaces
4. Try "forgot password" (if implemented)
5. Check MongoDB connection in backend logs

### Cart Not Working
**Problem**: Cannot add items to cart
**Solutions**:
1. Must be logged in - register or login first
2. Check if product has stock available
3. Clear browser localStorage
4. Try different browser

### Order Not Appearing
**Problem**: Order placed but not showing
**Solutions**:
1. Refresh the page
2. Check `/profile` page for order history
3. Verify checkout completed successfully
4. Check MongoDB for order in database

### Profile Changes Not Saving
**Problem**: Profile edits don't persist
**Solutions**:
1. Ensure all required fields filled
2. Check browser console for errors
3. Verify token hasn't expired - logout/login
4. Check MongoDB connection

## Security Best Practices

### For Development
✅ Use `.env.local` for secrets (already set up)
✅ Never commit `.env.local` to Git (in .gitignore)
✅ Use strong JWT_SECRET (minimum 32 characters)
✅ httpOnly cookies enabled
✅ Password hashing with bcrypt

### For Production
⚠️ Change default admin password
⚠️ Change default customer password
⚠️ Use strong JWT_SECRET (64+ random characters)
⚠️ Enable HTTPS only
⚠️ Set cookie secure flag to true
⚠️ Implement rate limiting on auth endpoints
⚠️ Add CAPTCHA to registration
⚠️ Implement password reset via email
⚠️ Add email verification
⚠️ Set up monitoring and alerts
⚠️ Regular security audits
⚠️ Keep dependencies updated

## API Authentication Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "555-0123",
  "address": "123 Main St"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Get Current User
```bash
GET /api/auth/me
Cookie: token=eyJhbGc...
```

### Create Order (Protected)
```bash
POST /api/orders
Content-Type: application/json
Cookie: token=eyJhbGc...

{
  "items": [...],
  "shippingAddress": {...},
  "totalAmount": 299.99
}
```

### Block User (Admin Only)
```bash
PATCH /api/admin/users
Content-Type: application/json
Cookie: token=eyJhbGc... (admin token)

{
  "userId": "60d5ec49f1b2c8b1f8c9a123",
  "status": "blocked"
}
```

## Testing the Authentication System

### 1. Test Guest Access
1. Open browser in incognito mode
2. Navigate to http://localhost:3000
3. Verify you can browse products
4. Try to checkout - should redirect to login

### 2. Test Customer Registration
1. Go to `/register`
2. Create new account
3. Verify auto-login
4. Check header shows your name
5. Try adding items to cart
6. Complete checkout process
7. View order in `/profile`

### 3. Test Customer Login
1. Logout
2. Go to `/login`
3. Login with demo customer account
4. Verify redirect to home
5. Check cart persistence
6. View profile page

### 4. Test Admin Access
1. Logout
2. Login with admin account
3. Verify redirect to admin dashboard
4. Check dashboard statistics
5. Navigate to product management
6. Create/edit a product
7. Navigate to order management
8. Approve an order
9. Navigate to user management
10. Search for users

### 5. Test Protected Routes
1. While logged out, try accessing:
   - `/profile` - Should redirect to login
   - `/admin/dashboard` - Should redirect to login
   - `/checkout` - Should redirect to login
2. Login as customer, try accessing:
   - `/admin/dashboard` - Should redirect to home
   - `/admin/products` - Should redirect to home

### 6. Test Order Workflow
1. Login as customer
2. Add products to cart
3. Checkout and create order
4. View order in profile (status: pending)
5. Logout, login as admin
6. Find the order in admin panel
7. Approve the order
8. Update status to shipped
9. Update status to delivered
10. Logout, login as customer
11. Verify order status updated

### 7. Test User Blocking
1. Login as admin
2. Go to user management
3. Block a customer account
4. Logout
5. Try to login with blocked account
6. Verify login fails with "Account is blocked"
7. Login as admin
8. Unblock the account
9. Verify customer can now login

## Conclusion

The authentication system is now fully integrated with:
- ✅ User registration and login
- ✅ Role-based access control
- ✅ Protected routes and APIs
- ✅ Admin dashboard
- ✅ Customer profile
- ✅ Order management
- ✅ User management
- ✅ Secure password handling
- ✅ JWT token authentication

The system is ready for development use. Remember to follow security best practices when deploying to production!
