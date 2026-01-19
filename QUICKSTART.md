# TechQuality E-Commerce - Quick Start Guide with Authentication

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure MongoDB Atlas

**Option A: Create New Database (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Option B: Use Existing Database**
- Just use your existing MongoDB Atlas connection string

### 3. Set Environment Variables

Edit `.env.local` and add:
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_in_production
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Initialize Database
Open your browser and visit: http://localhost:3000/api/init

You should see success message. This creates:
- ✅ Sample products with QR codes
- ✅ Team members and goals
- ✅ **Admin account**: admin@techquality.com / admin123
- ✅ **Customer account**: customer@example.com / customer123

### 6. Explore the Platform

#### As Guest (not logged in):
1. **Homepage**: http://localhost:3000
2. **Browse Products**: View products, search
3. **Try to checkout**: You'll be asked to login first

#### As Customer:
1. **Login**: http://localhost:3000/login
   - Email: customer@example.com
   - Password: customer123
2. **Add to cart** and complete checkout
3. **View profile**: http://localhost:3000/profile
4. **See your orders** and order history

#### As Admin:
1. **Login**: http://localhost:3000/login
   - Email: admin@techquality.com
   - Password: admin123
2. **Admin Dashboard**: http://localhost:3000/admin/dashboard
3. **Manage Products**: Create, edit, delete products
4. **Manage Orders**: Approve/reject customer orders
5. **Manage Users**: Block/unblock user accounts
7. **Contact Form**: Fill out the contact form

## 🌐 Deploy to Vercel (10 Minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "E-commerce website"
git branch -M main
# Create a repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_SITE_URL`: Will be `https://your-project.vercel.app`
6. Click "Deploy"

### 3. Initialize Production Database
After deployment, visit: `https://your-project.vercel.app/api/init`

## 🎯 Sample QR Codes to Test

- `QR-PROD-001` - Premium Wireless Headphones
- `QR-PROD-002` - Smart Fitness Watch
- `QR-PROD-003` - Portable Bluetooth Speaker

## 📝 Customize Your Site

### Change Logo
Edit: `components/Header.js` and `components/Footer.js`

### Change Colors
Edit: `tailwind.config.js`

### Add Products
Visit: `/api/products` (POST request) or add directly to MongoDB

### Update Team Members
Edit: `lib/sampleData.js` and reinitialize database

### Change Project Video
Edit: `pages/index.js` - Replace YouTube embed URL

## ❓ Common Issues

**Database connection fails:**
- Check MongoDB Atlas network access (whitelist 0.0.0.0/0 for development)
- Verify connection string is correct

**Images not loading:**
- Check internet connection
- Images use Unsplash URLs (require internet)

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📞 Need Help?

Check:
1. README.md - Full documentation
2. Code comments - Detailed explanations
3. Console errors - Check browser and terminal

## 🎉 You're Ready!

Your complete e-commerce website with QR code system is now running!

**Next steps:**
- Customize the design
- Add more products
- Deploy to production
- Share with your team
