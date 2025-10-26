# Friends Juice Bar - Sidebar Implementation

## Overview

এই প্রজেক্টে `/admin` এবং `/dashboard` রুটের জন্য দুটি আলাদা সাইডবার কম্পোনেন্ট তৈরি করা হয়েছে যা ইমেজে দেখানো সাইডবারের মতো দেখতে।

## Features

### Admin Sidebar (`/admin`)

- **Organization Header**: Friends Juice Bar এর লোগো এবং নাম
- **Platform Navigation**: Dashboard, Products, Users, Analytics, Reports, Settings
- **Quick Actions**: Add Product, Generate Report
- **User Profile**: Admin user এর প্রোফাইল এবং sign out option

### Dashboard Sidebar (`/dashboard`)

- **Organization Header**: Friends Juice Bar এর লোগো এবং নাম
- **Platform Navigation**: Dashboard, Orders, Rewards, Profile, Payment, History
- **Quick Actions**: New Order, My Rewards
- **User Profile**: Customer user এর প্রোফাইল এবং sign out option

## File Structure

```
src/
├── components/
│   ├── admin/
│   │   └── AdminSidebar.tsx          # Admin panel sidebar
│   ├── dashboard/
│   │   └── DashboardSidebar.tsx       # Customer dashboard sidebar
│   └── ui/
│       └── sidebar.tsx                # Base sidebar components
├── app/
│   ├── admin/
│   │   ├── layout.js                  # Admin layout with sidebar
│   │   └── page.js                    # Admin dashboard page
│   └── dashboard/
│       ├── layout.js                  # Dashboard layout with sidebar
│       └── page.tsx                   # Customer dashboard page
```

## Key Components

### 1. AdminSidebar.tsx

- Admin panel এর জন্য সাইডবার
- Product management, user management, analytics এর জন্য navigation
- Admin-specific quick actions

### 2. DashboardSidebar.tsx

- Customer dashboard এর জন্য সাইডবার
- Order management, rewards, profile এর জন্য navigation
- Customer-specific quick actions

### 3. Layout Files

- `src/app/admin/layout.js`: Admin layout with sidebar integration
- `src/app/dashboard/layout.js`: Dashboard layout with sidebar integration

## Usage

### Admin Panel

```bash
# Admin panel এ যেতে হলে
http://localhost:3000/admin
```

### Customer Dashboard

```bash
# Customer dashboard এ যেতে হলে
http://localhost:3000/dashboard
```

## Features Implemented

✅ **Responsive Design**: Mobile এবং desktop এর জন্য responsive
✅ **Collapsible Sidebar**: Sidebar collapse/expand functionality
✅ **Active State**: Current page highlight
✅ **Breadcrumb Navigation**: Header এ breadcrumb navigation
✅ **User Profile**: Sidebar footer এ user profile
✅ **Quick Actions**: Common tasks এর জন্য quick access
✅ **Modern UI**: shadcn/ui components ব্যবহার করে modern design

## Customization

### Navigation Items পরিবর্তন করতে হলে:

1. `AdminSidebar.tsx` বা `DashboardSidebar.tsx` ফাইলে `adminNavItems` বা `dashboardNavItems` array edit করুন
2. নতুন icon যোগ করতে হলে `lucide-react` থেকে import করুন
3. URL এবং title update করুন

### User Information পরিবর্তন করতে হলে:

1. `user` object এ name, email, avatar update করুন
2. Organization information পরিবর্তন করতে হলে `organization` object edit করুন

### Styling পরিবর্তন করতে হলে:

1. `className` props ব্যবহার করে custom styling যোগ করুন
2. Tailwind CSS classes ব্যবহার করে design customize করুন

## Dependencies

- `@radix-ui/react-slot`
- `class-variance-authority`
- `lucide-react`
- `next/link`
- `next/navigation`
- `@/components/ui/*` (shadcn/ui components)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Notes

- Sidebar automatically responsive হয় mobile এবং desktop এর জন্য
- Keyboard shortcut (Ctrl/Cmd + B) দিয়ে sidebar toggle করা যায়
- Sidebar state cookie এ save হয়
- Mobile এ sidebar sheet হিসেবে open হয়
