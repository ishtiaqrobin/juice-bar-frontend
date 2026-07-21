# 🧃 Friends Juice Bar — Frontend

**Version:** 0.1.0<br/>
**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4<br/>
**Auth:** Better Auth (Email/Password, OTP, Google OAuth)<br/>
**Deployment:** Vercel, cPanel

---

## Features

| Feature | Description |
|---|---|
| **Authentication & Authorization** | Login, registration, email OTP verification, password reset, Google OAuth, role-based routing (Admin/User) |
| **Public Storefront** | Homepage with hero carousel, product categories, menu browsing, promotions, rewards, contact form |
| **Shopping Cart** | Add/remove items, quantity controls, order summary |
| **Admin Dashboard** | Stats overview, product CRUD, category CRUD, banner CRUD, featured options CRUD, user management, analytics, reports |
| **User Dashboard** | Profile management, password change, account deletion, order history |
| **Responsive Design** | Mobile-first layout with bottom tab bar, side drawer, responsive navbar and footer |
| **Dark/Light Mode** | Theme toggle with `next-themes` |
| **Image Upload** | Client-side compression (Canvas → WebP), preview before upload |
| **Server Actions** | Next.js Server Actions for data mutations with cache revalidation |
| **Form Validation** | Zod schemas validated on both client (react-hook-form) and server (actions) |
| **Parallel Routing** | Role-based dashboard slots (`@admin` / `@user`) |

---

## Tech Stack

### Framework & Runtime

| Technology | Purpose |
|---|---|
| **Next.js** ^16.1.6 | React framework (App Router) |
| **React** ^19.2.4 | UI library |
| **TypeScript** ^5.x | Language |
| **Node.js** | Custom server (`server.js`) for cPanel |

### Authentication

| Technology | Purpose |
|---|---|
| **Better Auth** ^1.4.18 | Auth client (email/password, OTP, Google OAuth, session) |
| **@t3-oss/env-nextjs** | Runtime environment variable validation |

### UI & Styling

| Technology | Purpose |
|---|---|
| **Tailwind CSS** ^4 | Utility-first CSS |
| **tw-animate-css** | CSS animations |
| **shadcn/ui** (Radix primitives) | Accessible UI components (32+ components) |
| **Lucide React** ^0.545.0 | Icon library |
| **@tabler/icons-react** ^3.44.0 | Icon library |
| **Embla Carousel** ^8.6.0 | Hero/slider carousel |
| **next-themes** ^0.4.6 | Dark/light theme switching |
| **Geist** | Font family |

### Forms & Validation

| Technology | Purpose |
|---|---|
| **react-hook-form** ^7.71.1 | Form state management |
| **@hookform/resolvers** ^5.2.2 | Zod integration for react-hook-form |
| **Zod** ^4.3.6 | Schema validation |

### Data Fetching & Charts

| Technology | Purpose |
|---|---|
| **SWR** ^2.3.6 | Client-side data fetching (stale-while-revalidate) |
| **Recharts** ^3.7.0 | Dashboard charts and graphs |

### Utilities

| Technology | Purpose |
|---|---|
| **Sonner** ^2.0.7 | Toast notifications |
| **date-fns** ^4.1.0 | Date formatting |
| **next-safe-action** | Type-safe server actions |
| **class-variance-authority** | Component variant system |
| **clsx** + **tailwind-merge** | Conditional class merging |

---

## Project Structure

```
Frontend/
├── public/                          # Static assets (images, fonts)
├── doc/                             # Deployment & migration docs
│   ├── FRONTEND-DEPLOYMENT-BN.md
│   ├── MIGRATION_GUIDE.md
│   ├── PRODUCT_SERVICE_CACHE_GUIDE.md
│   ├── VERCEL_CHECKLIST.md
│   ├── VERCEL_DEPLOYMENT_GUIDE.md
│   └── VERCEL_QUICK_START.md
│
├── src/
│   ├── actions/                     # Next.js Server Actions
│   │   ├── admin.action.ts          # Admin user management
│   │   ├── banner.action.ts         # Banner CRUD
│   │   ├── category.action.ts       # Category CRUD
│   │   ├── featured.action.ts       # Featured option CRUD
│   │   └── product.action.ts        # Product CRUD
│   │
│   ├── app/                         # App Router pages
│   │   ├── (commonLayout)/          # Public pages (navbar + footer)
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── menu/page.tsx        # Menu with products
│   │   │   ├── cart/page.tsx        # Shopping cart
│   │   │   ├── orders/page.tsx      # Order history
│   │   │   ├── contact/page.tsx     # Contact form
│   │   │   ├── promotions/page.tsx  # Promotions
│   │   │   ├── rewards/page.tsx     # Loyalty rewards
│   │   │   ├── privacy-policy/page.tsx
│   │   │   └── terms-and-conditions/page.tsx
│   │   │
│   │   ├── (authLayout)/            # Authentication pages
│   │   │   ├── login/page.tsx
│   │   │   ├── registration/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   │
│   │   ├── (dashboardLayout)/       # Dashboard (parallel routing)
│   │   │   ├── @admin/              # Admin slot
│   │   │   │   └── admin-dashboard/
│   │   │   │       ├── page.jsx                 # Overview (stats, analytics, activity)
│   │   │   │       ├── analytics/page.tsx        # Advanced analytics
│   │   │   │       ├── banners/page.tsx          # Banner management
│   │   │   │       ├── categories/page.tsx       # Category management
│   │   │   │       ├── featured/page.tsx         # Featured options
│   │   │   │       ├── products/page.tsx         # Product list
│   │   │   │       ├── products/new/page.tsx     # Add product
│   │   │   │       ├── products/[id]/page.tsx    # Edit product
│   │   │   │       ├── reports/page.tsx          # Reports
│   │   │   │       ├── settings/page.js          # Admin settings
│   │   │   │       └── users/page.tsx            # User management
│   │   │   │
│   │   │   ├── @user/               # User slot
│   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx                 # User dashboard
│   │   │   │       └── settings/page.js          # User settings
│   │   │   │
│   │   │   ├── layout.tsx           # Dashboard layout (slot selector)
│   │   │   └── default.tsx          # Default slot content
│   │   │
│   │   ├── layout.tsx               # Root layout (fonts, providers)
│   │   ├── not-found.tsx            # 404 page
│   │   └── globals.css              # Global styles + Tailwind
│   │
│   ├── assets/                      # Static resources
│   │   ├── icon/                    # Google icons
│   │   ├── images/                  # Logo variants
│   │   ├── svg/                     # UI SVG icons
│   │   └── webp/                    # App store, Google play badges
│   │
│   ├── components/                  # React components
│   │   ├── admin/                   # Admin-specific components
│   │   │   ├── AdminAnalyticsCharts.jsx
│   │   │   ├── AdminDashboardStats.jsx
│   │   │   ├── AdminRecentActivity.jsx
│   │   │   └── AdminReportingCenter.jsx
│   │   │
│   │   ├── dashboard/               # User dashboard components
│   │   │   ├── ChangePassword.tsx
│   │   │   ├── DeleteAccount.tsx
│   │   │   ├── UserDashboardStats.jsx
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserProfileWithTabs.tsx
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── HomeLayoutShell.jsx
│   │   │   ├── ModeToggle.tsx
│   │   │   ├── desktop/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   ├── home/
│   │   │   │   ├── AppFooter.tsx
│   │   │   │   ├── BreadcrumbWithCustomSeparator.tsx
│   │   │   │   ├── CategoryCard.tsx
│   │   │   │   ├── HeroCarousel.tsx
│   │   │   │   ├── HeroCarouselClient.tsx
│   │   │   │   ├── ProductHighlightCard.tsx
│   │   │   │   └── StartOrder.jsx
│   │   │   └── mobile/
│   │   │       ├── BottomTabBar.tsx
│   │   │       ├── MobileFilterDropdown.jsx
│   │   │       ├── MobileFooter.tsx
│   │   │       ├── MobileNavbar.jsx
│   │   │       └── MobileSideDrawer.tsx
│   │   │
│   │   ├── modules/                 # Feature-specific components
│   │   │   ├── admin/banner/        # BannerDialog, BannersClient, BannerTable
│   │   │   ├── admin/category/      # CategoriesClient, CategoryDialog, CategoryTable
│   │   │   ├── admin/featured/      # FeaturedClient, FeaturedDialog, FeaturedTable
│   │   │   ├── admin/product/       # ProductForm, ProductFormClient, ProductList, ProductsClient
│   │   │   ├── admin/user/          # UserDialog, UsersClient, UserTable
│   │   │   ├── auth/                # GoogleAuthButton, LoginForm, LogoutButton, RegisterForm, ResetPasswordForm, VerifyEmailForm
│   │   │   ├── cart/                # CartContent
│   │   │   ├── contact/             # ContactForm
│   │   │   ├── menu/                # CategoryTabs, DesktopMenu, MenuClient, ProductGrid
│   │   │   ├── orders/              # OrderContent
│   │   │   ├── promotions/          # PromotionsContent
│   │   │   ├── rewards/             # RewardsContent
│   │   │   └── shared/              # BrandingIcon, DeleteDialog, TablePagination
│   │   │
│   │   └── ui/                      # shadcn/ui primitives (32+ components)
│   │       ├── accordion.tsx, alert.tsx, alert-dialog.tsx, avatar.tsx
│   │       ├── badge.tsx, breadcrumb.tsx, button.tsx, card.tsx
│   │       ├── carousel.tsx, checkbox.tsx, dialog.tsx, drawer.tsx
│   │       ├── dropdown-menu.tsx, field.tsx, form.tsx, hover-card.tsx
│   │       ├── input.tsx, input-otp.tsx, label.tsx, navigation-menu.tsx
│   │       ├── progress.tsx, scroll-area.tsx, select.tsx, separator.tsx
│   │       ├── sheet.tsx, sidebar.tsx, skeleton.tsx, sonner.tsx
│   │       ├── spinner.tsx, switch.tsx, table.tsx, tabs.tsx
│   │       ├── textarea.tsx, tooltip.tsx
│   │
│   ├── constants/
│   │   ├── imageUpload.ts           # Upload constraints (types, size, quality)
│   │   └── roles.ts                 # Role constants (ADMIN, USER)
│   │
│   ├── context/
│   │   └── MenuFilterContext.jsx    # Mobile filter state + availability toggle
│   │
│   ├── fonts/
│   │   ├── National2-Bold.otf
│   │   └── National2-Regular.otf
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth operations (login, register, logout, session)
│   │   ├── useImageUpload.ts       # Image compression + preview + upload
│   │   └── use-mobile.ts           # Mobile device detection
│   │
│   ├── lib/
│   │   ├── api-endpoints.ts        # All API endpoint URL constants
│   │   ├── auth-client.ts          # Better Auth client configuration
│   │   ├── imageCompressor.ts      # Canvas-based WebP image compression
│   │   ├── upload-image.ts         # Upload utility with validation
│   │   ├── utils.ts                # cn(), formatPrice(), formatCurrency()
│   │   └── validation.ts           # Auth form Zod schemas
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx       # next-themes provider wrapper
│   │
│   ├── proxy.ts                    # Edge middleware (session + role-based redirect)
│   │
│   ├── routes/
│   │   ├── adminRoutes.tsx         # Admin sidebar navigation items
│   │   └── userRoutes.tsx          # User sidebar navigation items
│   │
│   ├── services/                   # Data service layer (API calls)
│   │   ├── index.ts                # Re-exports
│   │   ├── admin.service.ts        # Admin dashboard stats, analytics, reports, users
│   │   ├── banner.service.ts       # Banner CRUD
│   │   ├── category.service.ts     # Category CRUD
│   │   ├── featured.service.ts     # Featured option CRUD
│   │   ├── product.service.ts      # Product CRUD with filters & pagination
│   │   ├── session.service.ts      # Server-side session fetching
│   │   └── user.service.ts         # User profile, update, delete, password
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── index.ts                # Re-exports
│   │   ├── admin.type.ts           # Admin dashboard types
│   │   ├── banner.type.ts          # Banner types
│   │   ├── better-auth.d.ts        # Better Auth User augmentation
│   │   ├── category.type.ts        # Category types
│   │   ├── common.type.ts          # ApiResponse<T>, pagination
│   │   ├── enums.ts                # Role, OrderStatus, UnitType
│   │   ├── feature.type.ts         # FeaturedOption types
│   │   ├── product-form.type.ts    # Product form types
│   │   ├── product.type.ts         # Product types, filters, pagination
│   │   ├── routes.type.ts          # Navigation route types
│   │   └── user.type.ts            # User/Session types
│   │
│   └── validations/                # Zod validation schemas (synced with backend)
│       ├── banner.validation.ts
│       ├── category.validation.ts
│       ├── featured.validation.ts
│       └── product.validation.ts
│
├── .env                            # Local environment variables
├── .env.example                    # Environment variable template
├── .env.production                 # Production environment variables
├── .htaccess                       # Apache rewrite rules (cPanel)
├── .cpanel.yml                     # cPanel deployment config
├── vercel.json                     # Vercel deployment config
├── next.config.mjs                 # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint flat configuration
├── components.json                 # shadcn/ui configuration
├── server.js                       # Custom Node.js server (cPanel)
└── app.js                          # Passenger entry point (cPanel)
```

---

## Environment Variables

```env
# ── Backend URLs ──
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api/v1
AUTH_URL=http://localhost:5000/api/auth

# ── Public (client-side) URLs ──
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:5000/api/auth
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Variables are validated at runtime via `@t3-oss/env-nextjs`. The `NEXT_PUBLIC_*` prefix makes them available to client-side code.

---

## Installation & Setup

### Prerequisites

- Node.js >= 18
- Backend API running (see Backend/README.md)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your backend URL

# 3. Start development server
npm run dev
```

### NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Create production build (`.next/`) |
| `npm run start` | Start custom Next.js server (`server.js`) |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | (Legacy — Drizzle migration, not currently used) |
| `npm run db:seed` | (Legacy — Drizzle seed, not currently used) |
| `npm run package:cpanel` | Build + create deployment ZIP for cPanel |

---

## Application Routes

### Public Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero carousel, categories, highlights |
| `/menu` | Full menu with category tabs, product grid, filters |
| `/cart` | Shopping cart with quantity controls |
| `/orders` | Order tracking and history |
| `/contact` | Contact form |
| `/promotions` | Promotions and deals |
| `/rewards` | Loyalty rewards program |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms & conditions |

### Auth Pages

| Route | Description |
|---|---|
| `/login` | Email/password login + Google OAuth |
| `/registration` | New user registration |
| `/verify-email` | Email OTP verification |
| `/forgot-password` | Request password reset OTP |
| `/reset-password` | Reset password with OTP |

### Admin Dashboard (`/admin-dashboard/...`)

| Route | Description |
|---|---|
| `/admin-dashboard` | Overview with stats, analytics charts, recent activity |
| `/admin-dashboard/products` | Product list (paginated table) |
| `/admin-dashboard/products/new` | Add new product form |
| `/admin-dashboard/products/[id]` | Edit product form |
| `/admin-dashboard/categories` | Category management (table + dialogs) |
| `/admin-dashboard/banners` | Banner management (table + dialogs) |
| `/admin-dashboard/featured` | Featured options management (table + dialogs) |
| `/admin-dashboard/users` | User management (list, edit, delete) |
| `/admin-dashboard/analytics` | Advanced analytics charts |
| `/admin-dashboard/reports` | Report generation (CSV) |
| `/admin-dashboard/settings` | Admin profile & settings |

### User Dashboard (`/dashboard/...`)

| Route | Description |
|---|---|
| `/dashboard` | User dashboard with stats |
| `/dashboard/settings` | Profile, change password, delete account |

---

## Architecture

### Authentication Flow

1. **Better Auth Client** (`src/lib/auth-client.ts`) handles all auth operations
2. Next.js **rewrites** `/api/auth/*` → `NEXT_PUBLIC_AUTH_URL` (backend) for same-origin cookies
3. **Edge Middleware** (`src/proxy.ts`) checks session on protected routes and redirects based on role
4. **Server Actions** and **Services** pass the session cookie to backend API calls
5. Role-based parallel routing: `@admin` and `@user` slots in the dashboard layout

### Data Flow

```
Page → Server Action (src/actions/) → Service (src/services/) → Backend API
         ↕                                ↕
    revalidateTag()                  fetch() with credentials
```

- **Server Actions** handle mutations (create, update, delete) with `"use server"`
- **Services** call the backend API using `fetch` with `credentials: "include"`
- Cache is invalidated via `revalidateTag()` with tags: `products`, `categories`, `banners`, `featured`, `users`
- Service options support `cache` (RequestCache) and `revalidate` (ISR seconds)

### Dashboard Parallel Routing

The `(dashboardLayout)` route group uses Next.js parallel route slots:
- `@admin` — rendered when the user has ADMIN role
- `@user` — rendered when the user has USER role
- The layout selects the appropriate slot based on session role

---

## Services & API Integration

Each service in `src/services/` mirrors a backend module:

| Service | Backend Module | Key Methods |
|---|---|---|
| `product.service.ts` | Products | `getProducts()`, `createProduct()`, `updateProduct()`, `deleteProduct()` |
| `category.service.ts` | Categories | `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()` |
| `banner.service.ts` | Banners | `getBanners()`, `createBanner()`, `updateBanner()`, `deleteBanner()` |
| `featured.service.ts` | Featured | `getFeaturedOptions()`, `createFeaturedOption()`, `updateFeaturedOption()`, `deleteFeaturedOption()` |
| `admin.service.ts` | Admin | `getUsers()`, `getDashboardStats()`, `getAnalytics()`, `getActivities()`, `generateReport()` |
| `user.service.ts` | Users | `getProfile()`, `updateProfile()`, `deleteAccount()`, `changePassword()`, `getDashboardStats()` |
| `session.service.ts` | Auth | `getSession()` (server-side) |

All service endpoints are defined centrally in `src/lib/api-endpoints.ts`.

---

## Components

### UI Component Library (shadcn/ui)

32+ accessible primitives built on Radix UI, customized with "new-york" style:

`Accordion`, `Alert`, `AlertDialog`, `Avatar`, `Badge`, `Breadcrumb`, `Button`, `Card`, `Carousel`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Field`, `Form`, `HoverCard`, `Input`, `InputOTP`, `Label`, `NavigationMenu`, `Progress`, `ScrollArea`, `Select`, `Separator`, `Sheet`, `Sidebar`, `Skeleton`, `Sonner` (toast), `Spinner`, `Switch`, `Table`, `Tabs`, `Textarea`, `Tooltip`

### Feature Modules

| Module | Key Components |
|---|---|
| **Auth** | `LoginForm`, `RegisterForm`, `VerifyEmailForm`, `ResetPasswordForm`, `GoogleAuthButton`, `LogoutButton` |
| **Menu** | `CategoryTabs`, `DesktopMenu`, `MenuClient`, `ProductGrid` |
| **Cart** | `CartContent` |
| **Orders** | `OrderContent` |
| **Admin Products** | `ProductsClient`, `ProductList`, `ProductForm`, `ProductFormClient` |
| **Admin Categories** | `CategoriesClient`, `CategoryDialog`, `CategoryTable` |
| **Admin Banners** | `BannersClient`, `BannerDialog`, `BannerTable` |
| **Admin Featured** | `FeaturedClient`, `FeaturedDialog`, `FeaturedTable` |
| **Admin Users** | `UsersClient`, `UserDialog`, `UserTable` |
| **Admin Dashboard** | `AdminDashboardStats`, `AdminAnalyticsCharts`, `AdminRecentActivity`, `AdminReportingCenter` |
| **User Dashboard** | `UserDashboardStats`, `UserProfile`, `UserProfileWithTabs`, `ChangePassword`, `DeleteAccount` |

---

## Image Upload

The frontend handles image uploads with client-side preprocessing:

1. **Validation** — Allowed types: `jpeg`, `jpg`, `png`, `webp`; max size: 5MB (absolute limit: 50MB)
2. **Compression** (`src/lib/imageCompressor.ts`) — Canvas-based WebP conversion at quality 0.85
3. **Preview** — Local preview before upload via `useImageUpload` hook
4. **Upload** — Sent to backend via `upload-image.ts` utility

---

## Type System

Types in `src/types/` are aligned with the backend Prisma schema:

| Type | Backend Model |
|---|---|
| `User`, `Session` | `User`, `Session` |
| `Product`, `CreateProductData`, `UpdateProductData` | `Product` |
| `Category`, `CreateCategoryData`, `UpdateCategoryData` | `Category` |
| `Banner`, `CreateBannerData`, `UpdateBannerData` | `Banner` |
| `FeaturedOption`, `CreateFeaturedData`, `UpdateFeaturedData` | `FeaturedOption` |
| `ApiResponse<T>` | Generic response wrapper |
| `PaginationInfo` | Pagination metadata |
| `Role` (`USER` / `ADMIN`), `UnitType`, `OrderStatus` | Backend enums |

---

## Deployment

### Vercel

```bash
# Deploy via Vercel CLI or git integration
vercel --prod
```

Configuration in `vercel.json` (region: `sin1`). Ensure environment variables are set in Vercel dashboard.

### cPanel

```bash
# Build deployment package
npm run package:cpanel
# → Produces dist/deploy/juice-bar-frontend-cpanel-*.zip
```

1. Upload ZIP to server and extract
2. Configure Node.js app with `server.js` as entry point (via `app.js` Passenger wrapper)
3. Set environment variables in cPanel
4. Apache rules are pre-configured in `.htaccess` (HTTPS, proxy, caching, security headers)
5. Restart the Node.js app

### Custom Server

The `server.js` file serves the Next.js production build through a custom Node.js HTTP server, required for cPanel Passenger compatibility.

---

## API Proxy

Next.js rewrites in `next.config.mjs` proxy auth requests to the backend:

```
/api/auth/:path* → ${NEXT_PUBLIC_AUTH_URL}/api/auth/:path*
```

This ensures Better Auth cookies are set on the frontend domain, enabling seamless session handling.

---

## License

MIT
