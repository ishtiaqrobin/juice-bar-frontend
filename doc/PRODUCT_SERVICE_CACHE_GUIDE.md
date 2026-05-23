# Product Service - Cache & Revalidate Usage Guide

## 📚 Overview

Product service এখন Next.js এর caching এবং revalidation সাপোর্ট করে। আপনি ৩টি ভিন্ন rendering strategy ব্যবহার করতে পারবেন।

---

## 🎯 Usage Examples

### 1️⃣ **SSG (Static Site Generation)** - Default

Build time এ একবার generate হয়, CDN থেকে serve হয়। সবচেয়ে fast।

```typescript
// No options = SSG
const { data: products } = await productService.getProducts();
```

**কখন ব্যবহার করবেন:**

- যে ডেটা কম পরিবর্তন হয় (যেমন: product catalog)
- Maximum performance চাইলে
- Static content এর জন্য

---

### 2️⃣ **SSR (Server Side Rendering)** - Always Fresh

প্রতিটি request এ server run হয়, সবসময় fresh data।

```typescript
// { cache: "no-store" } = SSR
const { data: products } = await productService.getProducts({
  cache: "no-store",
});
```

**কখন ব্যবহার করবেন:**

- Real-time data দরকার (যেমন: stock availability)
- User-specific data (যেমন: cart, wishlist)
- Admin dashboard

---

### 3️⃣ **ISR (Incremental Static Regeneration)** - Best of Both

First build এ static, তারপর নির্দিষ্ট সময় পর background এ re-generate।

```typescript
// { next: { revalidate: 60 } } = ISR (60 seconds)
const { data: products } = await productService.getProducts({
  revalidate: 60, // 60 seconds পর re-generate
});
```

**কখন ব্যবহার করবেন:**

- যে ডেটা মাঝে মাঝে পরিবর্তন হয় (যেমন: product prices)
- Performance + freshness দুটোই চাইলে
- Blog posts, product listings

---

## 📝 All Methods Support

### getProducts()

```typescript
// SSG
await productService.getProducts();

// SSR
await productService.getProducts({ cache: "no-store" });

// ISR - 30 seconds
await productService.getProducts({ revalidate: 30 });
```

### getProduct(id)

```typescript
// SSG
await productService.getProduct("product-id");

// SSR
await productService.getProduct("product-id", { cache: "no-store" });

// ISR - 60 seconds
await productService.getProduct("product-id", { revalidate: 60 });
```

### getProductsByCategory(categoryId)

```typescript
// SSG
await productService.getProductsByCategory("category-id");

// SSR
await productService.getProductsByCategory("category-id", {
  cache: "no-store",
});

// ISR - 120 seconds
await productService.getProductsByCategory("category-id", { revalidate: 120 });
```

### getFeaturedProducts(type)

```typescript
// SSG
await productService.getFeaturedProducts("new-arrivals");

// SSR
await productService.getFeaturedProducts("new-arrivals", { cache: "no-store" });

// ISR - 300 seconds (5 minutes)
await productService.getFeaturedProducts("new-arrivals", { revalidate: 300 });
```

---

## ⚠️ Important Notes

### These FORCE SSR automatically:

```typescript
// ❌ এগুলো ব্যবহার করলে SSR হবেই
import { cookies, headers } from "next/headers";

export default async function Page({ searchParams }) {
  const cookieStore = await cookies(); // Forces SSR
  const headersList = await headers(); // Forces SSR
  const query = searchParams.q; // Forces SSR
}
```

### Force Dynamic

```typescript
// Page level এ force করতে চাইলে
export const dynamic = "force-dynamic"; // SSR
export const dynamic = "force-static"; // SSG
```

---

## 🎨 Real-World Example

```typescript
// app/products/page.tsx
import { productService } from "@/services";

export default async function ProductsPage() {
  // ISR with 60 seconds revalidation
  const { data: products } = await productService.getProducts({
    revalidate: 60
  });

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// app/products/[id]/page.tsx
import { productService } from "@/services";

export default async function ProductDetailPage({ params }) {
  // SSR for real-time stock info
  const { data: product } = await productService.getProduct(params.id, {
    cache: "no-store"
  });

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Stock: {product.stock}</p>
    </div>
  );
}
```

---

## 📊 Performance Comparison

| Strategy | Speed          | Freshness          | Server Load | Use Case       |
| -------- | -------------- | ------------------ | ----------- | -------------- |
| **SSG**  | ⚡⚡⚡ Fastest | ❌ Stale           | ✅ Minimal  | Static content |
| **ISR**  | ⚡⚡ Fast      | ✅ Fresh (delayed) | ✅ Low      | Semi-dynamic   |
| **SSR**  | ⚡ Slower      | ✅✅ Always fresh  | ❌ High     | Real-time data |

---

## 🔧 Recommended Settings

```typescript
// Homepage - ISR 60s
await productService.getFeaturedProducts("featured", { revalidate: 60 });

// Product List - ISR 120s
await productService.getProducts({ revalidate: 120 });

// Product Detail - SSR (for stock)
await productService.getProduct(id, { cache: "no-store" });

// Category Page - ISR 180s
await productService.getProductsByCategory(categoryId, { revalidate: 180 });
```
