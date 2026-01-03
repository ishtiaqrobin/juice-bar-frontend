# Friends Juice Bar - Vercel Deployment Guide

## 🚀 Vercel এ ডিপ্লয় করার ধাপসমূহ

এই গাইড আপনাকে Friends Juice Bar ফ্রন্টএন্ড অ্যাপ্লিকেশন Vercel এ ডিপ্লয় করতে সাহায্য করবে।

---

## ১. প্রয়োজনীয় প্রস্তুতি

### GitHub Repository তৈরি করুন (যদি না থাকে)

```bash
cd "e:\Mission404\NextJs\Friends Juice Bar\Frontend"
git init
git add .
git commit -m "Initial commit for Vercel deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## ২. Vercel Account Setup

1. [Vercel](https://vercel.com) এ যান এবং GitHub দিয়ে সাইন ইন করুন
2. Dashboard এ যান

---

## ৩. Project Import করুন

### ধাপ ১: New Project তৈরি করুন

1. Vercel Dashboard → **Add New** → **Project**
2. আপনার GitHub repository খুঁজুন এবং **Import** করুন

### ধাপ ২: Configure Project

**Framework Preset:** Next.js (automatically detected)

**Root Directory:** `./` (default)

**Build Settings:**

- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

---

## ৪. Environment Variables সেটআপ

Vercel Dashboard এ **Environment Variables** সেকশনে যান এবং নিচের variables যুক্ত করুন:

### Required Variables:

| Variable Name         | Value                                                              | Description               |
| --------------------- | ------------------------------------------------------------------ | ------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://backend.juicebar.hasanalicollege.com/api/v1`              | Backend API URL           |
| `REVALIDATE_SECRET`   | `ea22ff23119686dd29248a70853c1d469e5b48a05c6cb82b2df300a42057c03f` | Cache revalidation secret |

> **নোট:** সব environment variables এর জন্য **Production**, **Preview**, এবং **Development** তিনটি environment-ই সিলেক্ট করুন।

---

## ৫. Deploy করুন

1. সব কনফিগারেশন শেষ হলে **Deploy** বাটনে ক্লিক করুন
2. Vercel automatically build এবং deploy করবে
3. Deploy সম্পন্ন হলে আপনি একটি URL পাবেন (যেমন: `your-app.vercel.app`)

---

## ৬. Custom Domain যুক্ত করুন (Optional)

### Vercel Dashboard থেকে:

1. আপনার project → **Settings** → **Domains**
2. আপনার custom domain যুক্ত করুন
3. DNS settings অনুযায়ী configure করুন

---

## ৭. Deployment যাচাই করুন

### Homepage Test

- Deployed URL এ যান
- Homepage সঠিকভাবে লোড হচ্ছে কিনা দেখুন
- Images লোড হচ্ছে কিনা চেক করুন

### Menu Page Test

- `/menu` পেজে যান
- Products সঠিকভাবে লোড হচ্ছে কিনা দেখুন
- Categories এবং filters কাজ করছে কিনা চেক করুন

### Admin Panel Test

- `/admin` পেজে যান
- Login করে দেখুন
- Dashboard সঠিকভাবে কাজ করছে কিনা যাচাই করুন

---

## 🔄 পরবর্তী Deployment

একবার setup হয়ে গেলে, পরবর্তীতে যেকোনো পরিবর্তন GitHub এ push করলেই Vercel automatically deploy করবে:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🐛 সমস্যা সমাধান (Troubleshooting)

### Build Failed

**সমস্যা:** Build process ব্যর্থ হয়েছে

**সমাধান:**

1. Vercel Dashboard → Deployments → Failed deployment → View Build Logs
2. Error message দেখুন এবং সেই অনুযায়ী ঠিক করুন
3. লোকালে `npm run build` চালিয়ে দেখুন build হচ্ছে কিনা

### API Connection Failed

**সমস্যা:** Frontend backend এর সাথে connect করতে পারছে না

**সমাধান:**

1. Environment Variables সঠিক আছে কিনা চেক করুন
2. `NEXT_PUBLIC_API_URL` সঠিক backend URL দিয়ে set করা আছে কিনা দেখুন
3. Backend server running আছে কিনা নিশ্চিত করুন

### Images Not Loading

**সমস্যা:** Product/banner images লোড হচ্ছে না

**সমাধান:**

1. `next.config.mjs` এ backend hostname যুক্ত আছে কিনা চেক করুন
2. Backend server থেকে images সঠিকভাবে serve হচ্ছে কিনা যাচাই করুন
3. Image URLs সঠিক আছে কিনা দেখুন

### Environment Variables Not Working

**সমস্যা:** Environment variables কাজ করছে না

**সমাধান:**

1. Variable names সঠিক আছে কিনা দেখুন (case-sensitive)
2. `NEXT_PUBLIC_` prefix দিয়ে শুরু হয়েছে কিনা চেক করুন (client-side variables এর জন্য)
3. Vercel Dashboard এ redeploy করুন

---

## 📊 Performance Optimization

### Vercel Analytics (Optional)

1. Project Settings → Analytics
2. Enable Analytics
3. Real-time performance metrics দেখুন

### Edge Functions

Vercel automatically Next.js এর Edge Runtime ব্যবহার করে optimal performance দেয়।

---

## 🔐 Security Best Practices

1. **Environment Variables:** কখনো sensitive data GitHub এ push করবেন না
2. **API Keys:** সব secret keys Vercel Environment Variables এ রাখুন
3. **CORS:** Backend এ Vercel domain whitelist করুন

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Deployment Checklist

- [ ] GitHub repository তৈরি এবং code push করা হয়েছে
- [ ] Vercel account তৈরি করা হয়েছে
- [ ] Project import করা হয়েছে
- [ ] Environment variables সেট করা হয়েছে
- [ ] First deployment সফল হয়েছে
- [ ] Homepage test করা হয়েছে
- [ ] Menu page test করা হয়েছে
- [ ] Admin panel test করা হয়েছে
- [ ] Custom domain যুক্ত করা হয়েছে (optional)

---

**Deployment সফল! 🎉**

যেকোনো সমস্যার জন্য Vercel Dashboard এর Build Logs চেক করুন অথবা [Vercel Support](https://vercel.com/support) এ যোগাযোগ করুন।
