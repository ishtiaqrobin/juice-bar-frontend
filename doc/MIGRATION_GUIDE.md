# Admin Pages Service Migration Guide

এই গাইড অনুসরণ করে সব admin pages এ নতুন service layer ব্যবহার করুন।

## ✅ Created Services

নিচের services তৈরি করা হয়েছে `Frontend/src/services/` এ:

1. **admin.service.ts** - User management (CRUD)
2. **product.service.ts** - Product management (CRUD)
3. **banner.service.ts** - Banner management (CRUD)
4. **category.service.ts** - Category management (CRUD)
5. **featured.service.ts** - Featured options management (CRUD)

## 📝 Migration Pattern

### Before (Old Code):

```javascript
import { api } from "@/lib/api-client";

// Fetch data
const response = await api.users.getAll(params);
setUsers(response.data.data || []);

// Update
await api.users.update(userId, data);

// Delete
await api.users.delete(userId);
```

### After (New Code):

```javascript
import { adminService } from "@/services";

// Fetch data
const users = await adminService.getUsers();
setUsers(users);

// Update
await adminService.updateUser(userId, data);

// Delete
await adminService.deleteUser(userId);
```

## 🔄 Pages to Update

### 1. **Users Page** (`/admin/users/page.js`)

- Replace: `api.users.getAll()` → `adminService.getUsers()`
- Replace: `api.users.update()` → `adminService.updateUser()`
- Replace: `api.users.delete()` → `adminService.deleteUser()`
- Remove: `import { api } from '@/lib/api-client'`
- Add: `import { adminService } from '@/services'`

### 2. **Products Page** (`/admin/products/page.jsx`)

- Replace: Old API calls → `productService.getProducts()`
- Replace: Create → `productService.createProduct(data)`
- Replace: Update → `productService.updateProduct(id, data)`
- Replace: Delete → `productService.deleteProduct(id)`
- Add: `import { productService } from '@/services'`

### 3. **Banners Page** (`/admin/banners/page.jsx`)

- Replace: Old API calls → `bannerService.getBanners()`
- Replace: Create → `bannerService.createBanner(data)`
- Replace: Update → `bannerService.updateBanner(id, data)`
- Replace: Delete → `bannerService.deleteBanner(id)`
- Add: `import { bannerService } from '@/services'`

### 4. **Categories Page** (`/admin/categories/page.jsx`)

- Replace: Old API calls → `categoryService.getCategories()`
- Replace: Create → `categoryService.createCategory(data)`
- Replace: Update → `categoryService.updateCategory(id, data)`
- Replace: Delete → `categoryService.deleteCategory(id)`
- Add: `import { categoryService } from '@/services'`

### 5. **Featured Page** (`/admin/featured/page.jsx`)

- Replace: Old API calls → `featuredService.getFeaturedOptions()`
- Replace: Create → `featuredService.createFeaturedOption(data)`
- Replace: Update → `featuredService.updateFeaturedOption(id, data)`
- Replace: Delete → `featuredService.deleteFeaturedOption(id)`
- Add: `import { featuredService } from '@/services'`

## 🎯 Key Changes

### Response Structure

**Old:**

```javascript
const response = await api.users.getAll();
const data = response.data.data; // Nested structure
```

**New:**

```javascript
const data = await adminService.getUsers(); // Direct data
```

### Error Handling

Services throw errors automatically, so keep try-catch blocks:

```javascript
try {
  await adminService.updateUser(id, data);
  toast.success("Updated successfully");
} catch (error) {
  toast.error(error.message);
}
```

### TypeScript Types

All services export TypeScript interfaces:

```typescript
import { Product, CreateProductData, UpdateProductData } from "@/services";
```

## ⚠️ Important Notes

1. **Remove `api-client` imports** from all admin pages
2. **Update API endpoints** - Already done in `api-endpoints.ts` with `/v1` prefix
3. **Response structure changed** - No more nested `response.data.data`
4. **All services use `credentials: 'include'`** for authentication
5. **Error messages** are automatically extracted from API responses

## 🚀 Next Steps

1. Update each admin page one by one
2. Test CRUD operations for each module
3. Remove old `api-client.ts` file when all pages are migrated
4. Verify authentication works with new services

## 📦 Service Methods Reference

### Admin Service

- `getUsers()` - Get all users
- `getUser(id)` - Get single user
- `updateUser(id, data)` - Update user
- `deleteUser(id)` - Delete user
- `updateRole(id, data)` - Update user role

### Product Service

- `getProducts()` - Get all products
- `getProduct(id)` - Get single product
- `getProductsByCategory(categoryId)` - Get by category
- `getFeaturedProducts(type)` - Get featured products
- `createProduct(data)` - Create product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

### Banner Service

- `getBanners()` - Get all banners
- `getBanner(id)` - Get single banner
- `createBanner(data)` - Create banner
- `updateBanner(id, data)` - Update banner
- `deleteBanner(id)` - Delete banner

### Category Service

- `getCategories()` - Get all categories
- `getCategory(id)` - Get single category
- `createCategory(data)` - Create category
- `updateCategory(id, data)` - Update category
- `deleteCategory(id)` - Delete category

### Featured Service

- `getFeaturedOptions()` - Get all featured options
- `getFeaturedOption(id)` - Get single option
- `createFeaturedOption(data)` - Create option
- `updateFeaturedOption(id, data)` - Update option
- `deleteFeaturedOption(id)` - Delete option
