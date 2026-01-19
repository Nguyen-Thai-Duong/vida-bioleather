# TechQuality E-Commerce Platform - Complete with Authentication

A complete e-commerce website built with Next.js, MongoDB Atlas, featuring comprehensive authentication and role-based access control. Deployed on Vercel.

## 🌟 Features

### Core E-Commerce Features
- **Product Catalog**: Browse premium products with images, descriptions, and prices
- **Product Details**: Detailed product pages with full information
- **Shopping Cart**: Add, remove, and update product quantities with persistence
- **Secure Checkout**: Complete order placement (requires authentication)
- **Search Functionality**: Search products by name or description

### 🔐 Authentication System
- **User Registration**: New customer account creation
- **Secure Login**: JWT-based authentication with httpOnly cookies
- **Password Security**: Bcrypt hashing with salt rounds
- **Role-Based Access Control**: Three user roles (Admin, Customer, Guest)
- **Protected Routes**: Client and server-side route protection
- **Session Management**: 7-day token expiration

### 👥 User Roles

#### Admin
- **Default Account**: `admin@techquality.com` / `admin123`
- **Capabilities**:
  - Manage all products (create, edit, delete)
  - Generate QR codes for products
  - View and manage all orders
  - Approve/reject orders
  - Update order status workflow
  - View all user accounts
  - Block/unblock users
  - Admin dashboard with statistics

#### Customer  
- **Demo Account**: `customer@example.com` / `customer123`
- **Capabilities**:
  - Register and login
  - Browse and purchase products
  - Manage shopping cart
  - Place orders
  - View order history
  - Cancel pending orders
  - Edit profile information

#### Guest
- **Capabilities**:
  - Browse products
  - View product details
  - Search products
  - Must register to purchase

### QR Code System
- **Unique QR Codes**: Each product has a unique QR code
- **QR Code Generation**: API endpoint to generate QR codes for products
- **QR Search**: Search for product metadata using QR code values
- **Product Verification**: Verify product authenticity by scanning QR codes

### Team Page
- Team member profiles with photos and roles
- Company mission and vision statements
- Core values display
- Contact information for team members
- Embedded project video

### Additional Features
- Responsive design (mobile, tablet, desktop)
- Modern UI with Tailwind CSS
- Contact form for customer support
- Logo in header and footer
- Social media links

## 📁 Project Structure

```
back-end/
├── components/             # React components
│   ├── Header.js          # Navigation header with auth status
│   ├── Footer.js          # Footer with contact info
│   ├── Layout.js          # Main layout wrapper
│   ├── ProductCard.js     # Reusable product card
│   └── TeamMemberCard.js  # Team member component
├── lib/                   # Utilities and database
│   ├── mongodb.js         # MongoDB connection
│   └── auth.js            # Auth utilities & middleware
├── store/                 # State management (Zustand)
│   ├── cartStore.js       # Shopping cart state
│   └── authStore.js       # Authentication state
├── pages/                 # Next.js pages (routes)
│   ├── api/              # API endpoints (backend)
│   │   ├── auth/
│   │   │   ├── register.js   # User registration
│   │   │   ├── login.js      # User login
│   │   │   ├── logout.js     # User logout
│   │   │   └── me.js         # Get current user
│   │   ├── admin/
│   │   │   ├── users.js      # User management (admin)
│   │   │   └── products.js   # Product management (admin)
│   │   ├── products.js       # Get products
│   │   ├── orders.js         # Order management
│   │   ├── profile.js        # Customer profile
│   │   ├── team.js           # Team API
│   │   ├── contact.js        # Contact form
│   │   ├── qr-search.js      # QR code search
│   │   └── init.js           # Database initialization
│   ├── admin/
│   │   ├── dashboard.js      # Admin overview
│   │   ├── products.js       # Product management UI
│   │   ├── orders.js         # Order management UI
│   │   └── users.js          # User management UI
│   ├── login.js              # Login page
│   ├── register.js           # Registration page
│   ├── profile.js            # Customer profile page
│   ├── index.js              # Home page
│   ├── products.js           # Products catalog
│   ├── cart.js               # Shopping cart
│   ├── checkout.js           # Checkout page
│   ├── team.js               # Team information
│   ├── contact.js            # Contact form
│   └── qr-search.js          # QR code search
├── styles/                   # Global styles
│   └── globals.css           # Tailwind CSS and custom styles
├── .env.local                # Environment variables
├── .gitignore                # Git ignore file
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── vercel.json               # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (free tier works)
- Git

### Installation

1. **Navigate to the project directory**
   ```bash
   cd e:\ky_8_2026\EXE\back-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

4. **Configure environment variables**
   
   Create/edit the `.env.local` file:
   ```env
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   
   # JWT Secret (use a long, random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   # JWT Secret (use a long, random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Initialize the database**
   
   Visit http://localhost:3000/api/init to populate the database with:
   - Sample products with QR codes
   - Team members and company goals
   - **Default admin account**: admin@techquality.com / admin123
   - **Demo customer account**: customer@example.com / customer123
   
   You should see a success message.

7. **Open the website**
   
   Visit http://localhost:3000

## 🔐 Authentication

### Login as Admin
1. Navigate to http://localhost:3000/login
2. Use credentials: `admin@techquality.com` / `admin123`
3. You'll be redirected to the admin dashboard

### Login as Customer
1. Navigate to http://localhost:3000/login
2. Use credentials: `customer@example.com` / `customer123`
3. You'll be redirected to the home page

### Register New Customer
1. Navigate to http://localhost:3000/register
2. Fill out the registration form
3. Account will be created with 'customer' role
4. You'll be automatically logged in

**⚠️ Important**: Change default passwords in production!

## 📊 Database Collections

The application uses the following MongoDB collections:

- **users**: User accounts with hashed passwords and roles
- **products**: Product information including QR codes
- **orders**: Customer orders with status tracking
- **team**: Team member profiles
- **teamGoals**: Company mission, vision, and values
- **contacts**: Contact form submissions
- **qrCodes**: QR code mappings to products

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products?search=xxx` - Search products
- `POST /api/contact` - Submit contact form
- `GET /api/qr-search?code=xxx` - Search by QR code
- `GET /api/team` - Get team information

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Customer Endpoints (Protected)
- `GET /api/profile` - Get customer profile
- `PUT /api/profile` - Update customer profile
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `PATCH /api/orders` - Cancel pending order

### Admin Endpoints (Admin Only)
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users` - Block/unblock user
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products` - Update product
- `DELETE /api/admin/products` - Delete product
- `GET /api/orders` (admin view) - Get all orders
- `PATCH /api/orders` (admin) - Update order status

### Initialization
- `GET /api/init` - Initialize database with sample data

## 🌐 Deployment on Vercel

### Step 1: Prepare for Deployment

1. Make sure all code is committed to Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub (create a new repository first):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up or log in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or specify if different)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel deployment URL (e.g., https://your-app.vercel.app)

7. Click "Deploy"

### Step 3: Initialize Production Database

After deployment:
1. Visit `https://your-app.vercel.app/api/init`
2. This will populate your production database with sample data

### Step 4: Update QR Code URLs (if needed)

If your Vercel URL is different, update the `NEXT_PUBLIC_SITE_URL` environment variable in Vercel settings and redeploy.

## 🎨 Customization

### Adding New Products

1. Add products directly to MongoDB or through the API
2. Each product should have:
   ```javascript
   {
     id: 'prod-xxx',
     name: 'Product Name',
     description: 'Product description',
     price: 99.99,
     image: 'https://image-url.com/image.jpg',
     category: 'Category',
     stock: 100,
     qrCode: 'QR-PROD-XXX',
     metadata: {
       productionDate: 'YYYY-MM-DD',
       manufacturer: 'Company Name',
       warranty: 'X years',
       purpose: 'Product purpose'
     }
   }
   ```

### Changing Logo

1. Update the logo component in `components/Header.js` and `components/Footer.js`
2. Replace the gradient div with an actual image or update the text

### Changing Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      secondary: '#YOUR_COLOR',
    },
  },
}
```

### Adding Project Video

Edit `pages/index.js` and replace the YouTube embed URL:
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ...
```

## 📱 Mobile Responsive

The website is fully responsive and tested on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1280px+)

## 🔐 Security Notes

- Never commit `.env.local` to Git
- Use environment variables for sensitive data
- In production, use strong MongoDB credentials
- Implement proper authentication for admin features
- Validate all user inputs
- Use HTTPS in production

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **State Management**: Zustand
- **QR Codes**: qrcode library
- **Deployment**: Vercel
- **Image Hosting**: Unsplash (for demo)

## 📝 Sample Data

The project includes sample data for:
- 3 products (Headphones, Fitness Watch, Bluetooth Speaker)
- 4 team members
- Company mission and vision
- QR codes: QR-PROD-001, QR-PROD-002, QR-PROD-003

## 🐛 Troubleshooting

### Database Connection Issues
- Check your MongoDB Atlas connection string
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify network access settings

### Images Not Loading
- Check if image URLs are accessible
- Update `next.config.js` to add image domains

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18.x+)

## 📞 Support

For issues or questions:
- Check the code comments
- Review the API documentation
- Contact the development team

## 📄 License

This project is for educational purposes.

## 🎯 Next Steps

To enhance the project:
1. Add user authentication
2. Implement order tracking
3. Add payment gateway integration
4. Create admin dashboard
5. Add product reviews and ratings
6. Implement email notifications
7. Add more products and categories
8. Implement inventory management

---

**Built with ❤️ using Next.js, MongoDB, and Vercel**
