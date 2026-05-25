# Vercel Deployment Guide - Friends Juice Bar

এই গাইডটি আপনার **Next.js Frontend** কে Vercel এ ডেপ্লয় করতে সাহায্য করবে এবং আপনার মূল ডোমেইন (`https://friendsjuicebar.com`) সংযুক্ত করবে।

---

## **Overview**

| কম্পোনেন্ট      | স্থান        | URL                                   |
| --------------- | ------------ | ------------------------------------- |
| **Frontend**    | Vercel       | `https://friendsjuicebar.com`         |
| **Backend API** | cPanel       | `https://backend.friendsjuicebar.com` |
| **Database**    | cPanel MySQL | -                                     |

---

## **প্রয়োজনীয় প্রজেক্ট**

- ✅ Vercel Account (ইতিমধ্যে আছে)
- ✅ GitHub Account (Frontend রিপো)
- ✅ Domain Registrar (cPanel সংযুক্ত)
- ✅ Domain: `friendsjuicebar.com`

---

## **ধাপ ১: GitHub এ কোড আপলোড করুন**

আপনার Frontend কোড GitHub এ থাকতে হবে (Vercel এর জন্য)।

### **যদি ইতিমধ্যে GitHub এ আছে:**

```bash
cd Frontend
git add .
git commit -m "Frontend: Prepare for Vercel deployment"
git push origin main
```

### **যদি GitHub এ না থাকে:**

1. GitHub এ নতুন রিপো তৈরি করুন: `friends-juice-bar-frontend`
2. লোকালে:

```bash
cd Frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/friends-juice-bar-frontend.git
git push -u origin main
```

---

## **ধাপ ২: Vercel এ প্রজেক্ট ইমপোর্ট করুন**

### **২.১ Vercel ড্যাশবোর্ড খুলুন:**

https://vercel.com/dashboard

### **२.२ "Add New" → "Project" এ ক্লিক করুন:**

- "Import Git Repository" সিলেক্ট করুন
- আপনার GitHub অ্যাকাউন্ট কানেক্ট করুন
- `friends-juice-bar-frontend` রিপো সিলেক্ট করুন

### **२.३ প্রজেক্ট সেটিংস (গুরুত্বপূর্ণ):**

**Framework Preset:** `Next.js`

**Build & Development Settings:**

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Environment Variables:** (সবচেয়ে গুরুত্বপূর্ণ ⚠️)

এই ভেরিয়েবলগুলি যোগ করুন:

```
NEXT_PUBLIC_API_URL=https://backend.friendsjuicebar.com/api/v1
NEXT_PUBLIC_AUTH_URL=https://backend.friendsjuicebar.com/api/auth
NEXT_PUBLIC_APP_URL=https://friendsjuicebar.com
```

**Root Directory:** `.` (ডিফল্ট)

### **२.४ "Deploy" এ ক্লিক করুন**

✅ Vercel স্বয়ংক্রিয়ভাবে বিল্ড করবে এবং ডেপ্লয় করবে।

---

## **ধাপ ३: Custom Domain সংযুক্ত করুন**

### **३.१ Vercel ড্যাশবোর্ডে প্রজেক্ট খুলুন:**

আপনার প্রজেক্ট নাম ক্লিক করুন

### **३.२ "Settings" → "Domains" এ যান:**

### **३.३ Custom Domain যোগ করুন:**

- "Add Domain" এ ক্লিক করুন
- Domain নাম: `friendsjuicebar.com` লিখুন
- "Add" ক্লিক করুন

### **३.४ DNS রেকর্ড কনফিগার করুন:**

Vercel দুটি অপশন দেয়:

1. **Nameserver পরিবর্তন** (সহজ কিন্তু সমস্ত সেবা Vercel এ চলবে)
2. **CNAME রেকর্ড যোগ করুন** (আমাদের পরিস্থিতির জন্য উপযুক্ত)

**আমরা CNAME ব্যবহার করব** কারণ আপনার ব্যাকএন্ড cPanel এ আছে।

### **३.५ cPanel এ DNS রেকর্ড আপডেট করুন:**

1. cPanel লগইন করুন
2. **Zone Editor** বা **DNS** সেকশনে যান
3. আপনার ডোমেইন খুঁজুন: `friendsjuicebar.com`

**নিচের রেকর্ড যোগ করুন:**

| Type  | Name  | Value                            | TTL  |
| ----- | ----- | -------------------------------- | ---- |
| CNAME | `www` | `cname.vercel-dns.com`           | 3600 |
| A     | `@`   | Vercel এর IP (ড্যাশবোর্ডে দেখুন) | 3600 |
| A     | `api` | আপনার cPanel এর IP               | 3600 |

**অথবা সহজ পদ্ধতি (Vercel দ্বারা নির্দিষ্ট):**

Vercel ড্যাশবোর্ডে এটি দেবে:

```
Name: friendsjuicebar.com
Type: A
Value: [Vercel IP]
```

```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
```

### **३.६ DNS প্রসেস হতে অপেক্ষা করুন:**

- সাধারণত ১৫ মিনিট থেকে ১ ঘণ্টা সময় লাগে
- Vercel ড্যাশবোর্ডে স্ট্যাটাস দেখুন

---

## **ধাপ ४: Subdomain Setup - `www.friendsjuicebar.com`**

### **४.१ Vercel ড্যাশবোর্ডে "Settings" → "Domains" এ যান:**

### **४.२ আরও একটি Domain যোগ করুন:**

- "Add Domain" এ ক্লিক করুন
- Domain: `www.friendsjuicebar.com`
- Vercel স্বয়ংক্রিয়ভাবে CNAME সাজেস্ট করবে

### **४.३ cPanel এ CNAME রেকর্ড যোগ করুন:**

```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
TTL: 3600
```

---

## **ধাপ ५: Backend ডোমেইন - `backend.friendsjuicebar.com`**

### **५.१ এটি cPanel এ ইতিমধ্যে সংযুক্ত:**

cPanel Zone Editor এ চেক করুন:

```
Name: backend
Type: A
Value: [আপনার cPanel Server IP]
TTL: 3600
```

### **५.२ যদি না থাকে, যোগ করুন:**

cPanel > Zone Editor > Add DNS Record:

```
Name: backend.friendsjuicebar.com
Type: A
Value: [Your cPanel Server IP]
TTL: 3600
```

---

## **ধাপ ६: Backend Environment Variables আপডেট করুন**

আপনার Backend `.env.production` ফাইলে এটি ইতিমধ্যে সেট করা আছে:

```env
APP_URL=https://friendsjuicebar.com
FRONTEND_URL=https://friendsjuicebar.com
BETTER_AUTH_URL=https://backend.friendsjuicebar.com
```

### **६.१ Backend CORS সেটিংস (ইতিমধ্যে আপডেট করা হয়েছে):**

File: `Backend/src/app.ts`

```typescript
cors({
  origin: [
    env.FRONTEND_URL, // https://friendsjuicebar.com
    "https://www.friendsjuicebar.com", // www subdomain
    "https://friendsjuicebar.vercel.app", // Vercel backup URL
    env.BETTER_AUTH_URL, // https://backend.friendsjuicebar.com
    "http://localhost:3000",
    "http://localhost:5000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

### **६.२ Backend ডেপ্লয় করুন:**

সার্ভারে নতুন কোড আপলোড করুন এবং রিস্টার্ট করুন:

```bash
cd /home/friendsj/backend.friendsjuicebar
git pull origin main  # যদি GitHub থেকে থাকে
npm install
npm run build
pm2 restart backend-api  # অথবা আপনার অ্যাপ রিস্টার্ট কমান্ড
```

---

## **ধাপ ७: Git Push করলে স্বয়ংক্রিয় ডেপ্লয়**

এখন থেকে যখনই আপনি GitHub এ কোড পুশ করবেন:

```bash
cd Frontend
git add .
git commit -m "Your change message"
git push origin main
```

✅ **Vercel স্বয়ংক্রিয়ভাবে:**

1. কোড টেনে নেবে
2. বিল্ড করবে
3. ডেপ্লয় করবে
4. `https://friendsjuicebar.com` এ লাইভ করবে

---

## **ধাপ ८: Verification চেকলিস্ট**

✅ Frontend ডেপ্লয় হয়েছে:

```bash
curl https://friendsjuicebar.com
```

✅ Backend CORS কাজ করছে:

```bash
curl -H "Origin: https://friendsjuicebar.com" \
  -H "Access-Control-Request-Method: GET" \
  https://backend.friendsjuicebar.com/api/v1/health
```

✅ Environment Variables সেট আছে:

- Frontend: Vercel Dashboard > Settings > Environment Variables

✅ DNS রেকর্ড সঠিক:

```bash
nslookup friendsjuicebar.com
nslookup www.friendsjuicebar.com
nslookup backend.friendsjuicebar.com
```

---

## **সমস্যা সমাধান**

### **১. "Domain verification failed"**

- DNS রেকর্ড সঠিক আছে কিনা চেক করুন
- ১৫ মিনিট অপেক্ষা করুন
- cPanel Zone Editor রিফ্রেশ করুন

### **२. "CORS এরর - Origin not allowed"**

- Backend `src/app.ts` এ আপনার ডোমেইন যুক্ত করেছেন কিনা চেক করুন
- Backend সার্ভার রিস্টার্ট করুন

### **३. "500 এরর - API কানেক্ট করতে পারছে না"**

- Backend সার্ভার চলছে কিনা চেক করুন
- NEXT_PUBLIC_API_URL সঠিক কিনা চেক করুন
- Browser Console এর Network ট্যাবে দেখুন

### **४. "Vercel ডেপ্লয় ব্যর্থ"**

- Build logs চেক করুন: Vercel Dashboard > Deployments
- `npm run build` লোকালে চেষ্টা করুন
- Environment Variables সেট আছে কিনা চেক করুন

---

## **পরবর্তী পদক্ষেপ**

1. ✅ Frontend ভেরিফাই করুন
2. ✅ Backend টেস্ট করুন (Postman এ API কল)
3. ✅ DNS প্রসেস হওয়ার পর ব্রাউজারে পরীক্ষা করুন
4. ✅ SSL সার্টিফিকেট স্বয়ংক্রিয় (Vercel + Let's Encrypt)

---

## **Backend সেটআপ (cPanel তে ইতিমধ্যে চলছে)**

Backend CORS তালিকা:

```javascript
origin: [
  "https://friendsjuicebar.com", // Frontend
  "https://www.friendsjuicebar.com", // www
  "https://friendsjuicebar.vercel.app", // Vercel backup
  "https://backend.friendsjuicebar.com", // Better Auth
  "http://localhost:3000",
  "http://localhost:5000",
];
```

---

**সমস্যা হলে জানান!** 🚀
