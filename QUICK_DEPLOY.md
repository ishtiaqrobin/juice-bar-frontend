# Quick Deploy Guide (বাংলা)

## 🚀 দ্রুত ডিপ্লয় করার ধাপগুলো

### ১. লোকাল কমান্ড

```bash
npm install
npm run db:migrate   # Drizzle schema push
npm run db:seed      # প্রথমবারের জন্য admin + sample data
npm run package:cpanel
```

`dist/deploy/` ফোল্ডারে `juice-bar-frontend-cpanel-*.zip` তৈরি হবে।

### ২. ZIP আপলোড + Extract

1. cPanel → File Manager → `/home/hasanali/juicebar.hasanalicollege.com`
2. ZIP আপলোড করে "Extract" করুন
3. পুরোনো ফাইল থাকলে আগে ব্যাকআপ নিন

```
juicebar.hasanalicollege.com/
 ├─ .next/
 ├─ public/
 ├─ src/
 ├─ scripts/
 ├─ package.json
 ├─ server.js
 └─ ...
```

### ৩. Environment Variables

`.env.production` ফাইল তৈরি করুন অথবা Node.js App Manager থেকে add করুন:

```env
DATABASE_URL="mysql://hasanali_juice_bar_user:YOUR_DB_PASSWORD@localhost:3306/hasanali_juice_bar_db"
NEXTAUTH_URL="https://juicebar.hasanalicollege.com"
NEXTAUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_TRUST_HOST=true
NODE_ENV=production
PORT=3010
```

### ৪. cPanel Terminal

```bash
cd ~/juicebar.hasanalicollege.com
npm install           # dev deps সহ
npm run db:migrate
npm run db:seed       # (optional, প্রথম deploy এ চালান)
npm run build         # যদি লোকাল build সহ জিপ না করেন
```

### ৫. Node.js App Setup

1. cPanel → Software → Node.js App
2. Node.js version: **22.x** (available maximum)
3. Application root: `juicebar.hasanalicollege.com`
4. Startup file: `server.js`
5. Environment variables add করুন
6. "Restart App" চাপুন

### ৬. টেস্ট

ব্রাউজারে যান → `https://juicebar.hasanalicollege.com`  
Seed admin দিয়ে `/admin` রুটে লগইন করে দেখুন।

---

## ⚡ দ্রুত কমান্ডসমূহ

| কাজ                | কমান্ড                           |
| ------------------ | -------------------------------- |
| লোকাল ডেভ          | `npm run dev`                    |
| ডাটাবেস মাইগ্রেট   | `npm run db:migrate`             |
| সিড চালানো         | `npm run db:seed`                |
| প্রোডাকশন বিল্ড    | `npm run build && npm run start` |
| cPanel এর জন্য ZIP | `npm run package:cpanel`         |

---

## 🐛 ঝামেলা হলে

| ইস্যু       | সমাধান                                                                |
| ----------- | --------------------------------------------------------------------- |
| Build error | `rm -rf .next node_modules && npm install && npm run build`           |
| DB error    | DATABASE_URL ঠিক আছে কিনা দেখুন → `npm run db:migrate`                |
| Port issue  | `.env.production` এ `PORT` পরিবর্তন করুন এবং Node.js App এ আপডেট করুন |
| Seed rerun  | `npm run db:seed` (idempotent – বারবার চালাতে পারবেন)                 |

---

## 📚 বিস্তারিত গাইড

- পূর্ণ ডক: `DEPLOY_INSTRUCTIONS.md`
- টেক/লোকাল সেটআপ: `README_SETUP.md`
- ওভারভিউ: `README.md`

সফল ডিপ্লয়! 🚀
