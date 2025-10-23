# Juice Bar Frontend - Tech Stack Setup

এই প্রজেক্টে নিম্নলিখিত টেক স্ট্যাক ইমপ্লিমেন্ট করা হয়েছে:

## 🧱 টেক স্ট্যাক

| লেয়ার        | টুল / প্রযুক্তি                   | বর্ণনা                                       |
| ------------- | --------------------------------- | -------------------------------------------- |
| Frontend (UI) | Next.js (App Router, SSR/ISR/SSG) | User-facing pages (menu, product view, etc.) |
| Backend (API) | Next.js API Routes (app/api/\*)   | Product CRUD, NextAuth, Admin APIs           |
| Database ORM  | Prisma                            | MySQL এর সাথে strongly typed ORM             |
| Database      | MySQL (cPanel hosted)             | Product data store                           |
| Hosting       | cPanel (NodeJS app setup)         | Same domain বা subdomain থেকে run হবে        |
| Cache Layer   | Next.js ISR + CDN cache + SWR     | Best UX and performance                      |
| Image Storage | /uploads folder in cPanel         | Static public file hosting for images        |

## 🚀 Setup Instructions

### 1. Environment Variables

`.env` file তৈরি করুন এবং নিম্নলিখিত variables add করুন:

```env
# Database - XAMPP Configuration
DATABASE_URL="mysql://root:@localhost:3306/juice_bar_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Upload
UPLOAD_DIR="./public/uploads"
```

### 2. Database Setup (XAMPP)

1. **XAMPP Start করুন:**

   - XAMPP Control Panel খুলুন
   - Apache এবং MySQL start করুন
   - phpMyAdmin এ যান: `http://localhost/phpmyadmin`

2. **Database তৈরি করুন:**

   - phpMyAdmin এ `juice_bar_db` নামে database তৈরি করুন
   - Character set: `utf8mb4_unicode_ci`

3. **Environment Variables:**

   ```env
   DATABASE_URL="mysql://root:@localhost:3306/juice_bar_db"
   ```

4. **Prisma Setup:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Sample Data:**
   ```bash
   npm run db:seed
   ```

### 3. File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js    # NextAuth configuration
│   │   ├── products/route.js              # Products CRUD API
│   │   ├── products/[id]/route.js         # Single product API
│   │   ├── categories/route.js           # Categories API
│   │   └── upload/route.js                # Image upload API
│   ├── admin/                             # Admin dashboard
│   │   └── products/
│   └── (menu)/menu/page.tsx               # Updated menu page
├── components/
│   └── admin/                             # Admin components
│       ├── ProductForm.jsx
│       └── ProductList.jsx
├── hooks/
│   ├── useProducts.js                     # SWR hooks for products
│   └── useCategories.js                   # SWR hooks for categories
└── lib/
    ├── prisma.js                          # Prisma client
    └── prisma.ts
```

### 4. Features Implemented

#### ✅ Database Schema

- User management with NextAuth
- Product and Category models
- Order management system
- Role-based access control

#### ✅ API Routes

- `/api/products` - Product CRUD operations
- `/api/categories` - Category management
- `/api/upload` - Image upload functionality
- `/api/auth/[...nextauth]` - Authentication

#### ✅ Admin Dashboard

- Product management interface
- Category management
- Image upload system
- Role-based access control

#### ✅ Frontend Integration

- SWR for data fetching and caching
- ISR (Incremental Static Regeneration)
- Updated menu page with real API data
- Responsive design maintained

#### ✅ Performance Optimizations

- SWR for client-side caching
- Next.js ISR for server-side caching
- Image optimization
- Lazy loading

### 5. Deployment to cPanel

1. Build the project:

```bash
npm run build
```

2. Upload the following to cPanel:

   - `.next` folder
   - `public` folder
   - `package.json`
   - `next.config.ts`
   - `prisma` folder

3. Set up Node.js app in cPanel with:

   - Start command: `npm start`
   - Node version: 18+

4. Configure environment variables in cPanel

5. Set up MySQL database and update DATABASE_URL

### 6. Database Migration

Production এ deploy করার আগে database migrate করুন:

```bash
npx prisma migrate deploy
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma studio          # Database GUI
npx prisma migrate dev      # Create migration
npx prisma migrate deploy   # Apply migrations
npx prisma generate         # Generate client
```

## 📱 Admin Access

Admin dashboard access করতে:

1. User account তৈরি করুন
2. Database এ user role 'ADMIN' set করুন
3. `/admin` route এ access করুন

## 🎯 Next Steps

1. Environment variables configure করুন
2. Database setup করুন
3. Test locally
4. Deploy to cPanel
5. Add sample data
6. Configure CDN for images

এই setup complete হলে আপনার Juice Bar application fully functional হবে MySQL database, authentication, admin panel এবং optimized performance সহ।

## 🔧 XAMPP Troubleshooting

### Common Issues:

1. **MySQL Connection Error:**

   ```bash
   # Check if MySQL is running in XAMPP
   # Default port: 3306
   # Username: root
   # Password: (empty)
   ```

2. **Database Not Found:**

   - phpMyAdmin এ `juice_bar_db` database তৈরি করুন
   - Character set: `utf8mb4_unicode_ci`

3. **Prisma Connection Issues:**

   ```bash
   # Test connection
   npx prisma db pull

   # If successful, run migrations
   npx prisma migrate dev
   ```

4. **Port Conflicts:**
   - XAMPP MySQL: Port 3306
   - Next.js: Port 3000
   - Make sure both are available

### Quick Setup Commands:

```bash
# 1. Create .env file with XAMPP config
echo 'DATABASE_URL="mysql://root:@localhost:3306/juice_bar_db"' > .env
echo 'NEXTAUTH_URL="http://localhost:3000"' >> .env
echo 'NEXTAUTH_SECRET="your-secret-key-here"' >> .env

# 2. Install dependencies
npm install

# 3. Setup database
npx prisma migrate dev
npx prisma generate

# 4. Add sample data
npm run db:seed

# 5. Start development
npm run dev
```

### Admin Access:

- URL: `http://localhost:3000/admin`
- Email: `admin@juicebar.com`
- Password: `admin123`
