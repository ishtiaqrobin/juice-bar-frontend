# 🚀 Vercel Deploy - Quick Start (সবচেয়ে সহজ ভার্সন)

## **5 মিনিটে শুরু করুন:**

### **1️⃣ GitHub এ কোড পুশ করুন**

```bash
cd Frontend
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

---

### **2️⃣ Vercel এ প্রজেক্ট যোগ করুন**

**https://vercel.com/new** খুলুন

1. "Import Git Repository" এ ক্লিক করুন
2. আপনার **friends-juice-bar-frontend** রিপো সিলেক্ট করুন
3. **Environment Variables যোগ করুন:**
   ```
   NEXT_PUBLIC_API_URL = https://backend.friendsjuicebar.com/api/v1
   NEXT_PUBLIC_AUTH_URL = https://backend.friendsjuicebar.com/api/auth
   NEXT_PUBLIC_APP_URL = https://friendsjuicebar.com
   ```
4. **"Deploy"** বাটন এ ক্লিক করুন

⏳ **৫-১০ মিনিট বিল্ড হবে...**

---

### **3️⃣ Custom Domain যোগ করুন**

Vercel Deploy সম্পন্ন হলে:

1. Vercel Dashboard > আপনার প্রজেক্ট খুলুন
2. **"Settings" → "Domains"** এ যান
3. **"Add Domain"** বাটন এ ক্লিক করুন
4. `friendsjuicebar.com` লিখুন
5. **Vercel এর DNS ইন্সট্রাকশন অনুসরণ করুন**

---

### **4️⃣ cPanel এ DNS আপডেট করুন**

**cPanel লগইন করুন → Zone Editor**

**আপনার ডোমেইন খুঁজুন:** `friendsjuicebar.com`

**এই রেকর্ডগুলি যোগ করুন:**

```
[1] A রেকর্ড
    Name: @
    Value: [Vercel একটি IP দেবে]
    TTL: 3600

[2] CNAME রেকর্ড
    Name: www
    Value: cname.vercel-dns.com
    TTL: 3600

[3] A রেকর্ড (Backend এর জন্য)
    Name: backend
    Value: [আপনার cPanel Server IP]
    TTL: 3600
```

---

### **5️⃣ Backend সার্ভার রিস্টার্ট করুন**

```bash
# সার্ভারে SSH করুন:
ssh friendsj@your_cpanel_ip

# Backend ফোল্ডারে যান:
cd /home/friendsj/backend.friendsjuicebar

# নতুন কোড টানুন (যদি GitHub এ থাকে):
git pull origin main

# নির্ভরতা ইনস্টল করুন:
npm install

# বিল্ড করুন:
npm run build

# রিস্টার্ট করুন (আপনার পদ্ধতি অনুযায়ী):
pm2 restart backend-api
# অথবা cPanel থেকে Node.js অ্যাপ রিস্টার্ট করুন
```

---

## **🎉 সম্পন্ন! এখন চেক করুন:**

### ✅ Frontend চেক করুন:

```
https://friendsjuicebar.com
https://www.friendsjuicebar.com
```

### ✅ Backend চেক করুন (Postman এ):

```
GET https://backend.friendsjuicebar.com/api/v1/health
```

### ✅ Browser Console এ CORS এরর নেই?

---

## **📝 কিছু ভুল হলে:**

| সমস্যা                   | ফিক্স                                       |
| ------------------------ | ------------------------------------------- |
| Domain still not working | 30 মিনিট অপেক্ষা করুন (DNS প্রপাগেশন)       |
| CORS Error               | Backend সার্ভার রিস্টার্ট করুন              |
| Vercel Deploy Failed     | Vercel Dashboard > Deployments > Logs দেখুন |

---

## **🔄 ভবিষ্যতে আপডেট করতে:**

```bash
cd Frontend
# কোড পরিবর্তন করুন...
git add .
git commit -m "Your changes"
git push origin main
```

✅ **Vercel স্বয়ংক্রিয়ভাবে ডেপ্লয় করবে!**

---

**সবাই কাজ করছে? চমৎকার! 🎊**

বিস্তারিত গাইড: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
