# Vercel Migration - Quick Checklist

## ✅ Before Starting

- [ ] Vercel Account সেট করা আছে
- [ ] GitHub Account আছে এবং কানেক্ট করা আছে
- [ ] Domain Registrar (cPanel) এ এক্সেস আছে
- [ ] Domain: `friendsjuicebar.com` ম্যানেজ করতে পারেন

---

## 📝 Configuration Files (ইতিমধ্যে আপডেট করা হয়েছে)

### ✅ Backend - Updated

**File:** `Backend/src/app.ts`

- [x] CORS যোগ করা: `https://www.friendsjuicebar.com`
- [x] CORS যোগ করা: `https://friendsjuicebar.vercel.app`
- [x] Backend URL রয়েছে

**File:** `Backend/.env.production`

- [x] `FRONTEND_URL=https://friendsjuicebar.com`
- [x] `BETTER_AUTH_URL=https://backend.friendsjuicebar.com`

**Status:** ✅ **Backend তৈরি**

### ✅ Frontend - Updated

**File:** `Frontend/.env.production`

- [x] `NEXT_PUBLIC_API_URL=https://backend.friendsjuicebar.com/api/v1`
- [x] `NEXT_PUBLIC_AUTH_URL=https://backend.friendsjuicebar.com/api/auth`
- [x] `NEXT_PUBLIC_APP_URL=https://friendsjuicebar.com`

**File:** `Frontend/next.config.mjs`

- [x] `remotePatterns` সঠিক (ইতিমধ্যে \*\*)

**Status:** ✅ **Frontend তৈরি**

---

## 🚀 Deployment Steps

### Step 1: GitHub এ কোড আপলোড করুন

```bash
cd Frontend
git add .
git commit -m "Frontend: Prepare for Vercel deployment"
git push origin main
```

- [ ] Complete

### Step 2: Vercel এ Sync করুন

1. https://vercel.com/dashboard খুলুন
2. "Add New" → "Project"
3. GitHub রিপো সিলেক্ট করুন: `friends-juice-bar-frontend`
4. Framework: `Next.js` (ডিফল্ট)
5. Environment Variables যোগ করুন:
   - `NEXT_PUBLIC_API_URL=https://backend.friendsjuicebar.com/api/v1`
   - `NEXT_PUBLIC_AUTH_URL=https://backend.friendsjuicebar.com/api/auth`
   - `NEXT_PUBLIC_APP_URL=https://friendsjuicebar.com`
6. "Deploy" এ ক্লিক করুন

- [ ] Complete

**বিল্ড ৫-১০ মিনিট সময় নেয়**

---

### Step 3: Custom Domain যোগ করুন

#### 3.1 Main Domain: `friendsjuicebar.com`

1. Vercel Dashboard > প্রজেক্ট খুলুন
2. "Settings" → "Domains"
3. "Add Domain" → `friendsjuicebar.com`
4. Vercel DNS ইন্সট্রাকশন অনুসরণ করুন

- [ ] Vercel এ যোগ করা হয়েছে

#### 3.2 cPanel এ DNS আপডেট করুন

1. cPanel লগইন করুন
2. **Zone Editor** বা **DNS** এ যান
3. `friendsjuicebar.com` খুঁজুন

**A রেকর্ড যোগ করুন:**

```
Name: @
Type: A
Value: [Vercel IP Address]
TTL: 3600
```

**CNAME রেকর্ড যোগ করুন:**

```
Name: www
Type: CNAME
Value: cname.vercel-dns.com
TTL: 3600
```

- [ ] cPanel DNS আপডেট করা হয়েছে

#### 3.3 Backend Subdomain সেটআপ করুন

```
Name: backend
Type: A
Value: [Your cPanel Server IP]
TTL: 3600
```

- [ ] Backend সাবডোমেইন সেটআপ করা হয়েছে

---

### Step 4: Backend আপডেট ও ডেপ্লয় করুন

```bash
# Option A: GitHub এর মাধ্যমে
cd /home/friendsj/backend.friendsjuicebar
git pull origin main
npm install
npm run build
pm2 restart backend-api

# Option B: ম্যানুয়াল
cd /home/friendsj/backend.friendsjuicebar
npm install
npm run build
# অ্যাপ রিস্টার্ট করুন
```

- [ ] Backend ডেপ্লয় করা হয়েছে

---

### Step 5: DNS Propagation অপেক্ষা করুন

**সাধারণত সময়:** ১৫ মিনিট - ১ ঘণ্টা

**চেক করুন:**

```bash
# Windows PowerShell বা Linux Terminal
nslookup friendsjuicebar.com
nslookup www.friendsjuicebar.com
nslookup backend.friendsjuicebar.com
```

- [ ] DNS প্রপাগেশন সম্পন্ন

---

## ✅ Verification

### Frontend

- [ ] `https://friendsjuicebar.com` এ যান - সাইট দেখা যাচ্ছে?
- [ ] `https://www.friendsjuicebar.com` কাজ করছে?
- [ ] Browser Console এ কোনো CORS এরর নেই?

### Backend

- [ ] `https://backend.friendsjuicebar.com/api/v1` অ্যাক্সেসযোগ্য?
- [ ] Postman এ API কল কাজ করছে?
- [ ] Authentication টেস্ট করেছেন?

### Images & Assets

- [ ] ছবিগুলি লোড হচ্ছে?
- [ ] CSS/JavaScript সঠিক প্রয়োগ হচ্ছে?

---

## 🔄 Future Updates (GitHub থেকে স্বয়ংক্রিয় ডেপ্লয়)

এখন থেকে যেকোনো আপডেটের জন্য:

```bash
cd Frontend
# কোড পরিবর্তন করুন...
git add .
git commit -m "Describe your changes"
git push origin main
```

✅ Vercel স্বয়ংক্রিয়ভাবে:

1. কোড টানবে
2. বিল্ড করবে
3. ডেপ্লয় করবে
4. লাইভ করবে

---

## 📞 Troubleshooting

| সমস্যা                     | সমাধান                                                |
| -------------------------- | ----------------------------------------------------- |
| Domain verification failed | DNS রেকর্ড চেক করুন, ১৫ মিনিট অপেক্ষা করুন            |
| CORS এরর                   | Backend CORS লিস্টে আপনার ডোমেইন যুক্ত করুন           |
| 500 এরর                    | Backend সার্ভার চলছে? Environment Variables সঠিক?     |
| ছবি না দেখা যাচ্ছে         | next.config.mjs remotePatterns চেক করুন               |
| Build ব্যর্থ               | Vercel Logs দেখুন, লোকালে `npm run build` চেষ্টা করুন |

---

## 📚 সম্পূর্ণ গাইড

বিস্তারিত জানতে দেখুন: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

**আপডেট তারিখ:** May 25, 2026  
**স্ট্যাটাস:** ✅ সম্পূর্ণ প্রস্তুত
