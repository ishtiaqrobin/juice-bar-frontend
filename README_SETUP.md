# Juice Bar Frontend - Tech Stack Setup

এই ডকুমেন্টটি লোকাল (XAMPP) এবং প্রোডাকশন (cPanel) উভয় পরিবেশের জন্য আপডেটেড সেটআপ গাইড।

## 🧱 টেক স্ট্যাক

| লেয়ার           | টুল / প্রযুক্তি                 | বর্ণনা                                                       |
| ---------------- | ------------------------------- | ------------------------------------------------------------ |
| Frontend (UI)    | Next.js 15 (App Router)         | SSR/ISR সহ গ্রাহক ও অ্যাডমিন UI                              |
| Backend (API)    | Next.js API Routes              | Auth, Products, Categories, Orders CRUD                      |
| Database ORM     | Drizzle ORM + mysql2            | Lightweight, prisma-free MySQL access                        |
| Authentication   | NextAuth (Credentials provider) | JWT session strategy                                         |
| Storage / Assets | `public/uploads`                | cPanel ফাইল ম্যানেজারে আপলোড করা ইমেজ                        |
| Hosting          | cPanel Node.js Application      | `juicebar.hasanalicollege.com` সাবডোমেইনে রান হবে            |
| DB (Production)  | MySQL (cPanel)                  | DB: `hasanali_juice_bar_db`, User: `hasanali_juice_bar_user` |

## 🚀 Environment Variables

লোকাল ডেভেলপমেন্টের জন্য `.env.local` ব্যবহার করুন, প্রোডাকশনের জন্য `.env.production` বা cPanel environment variables ব্যবহার করুন।

```env
# Common
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:3000"            # Production এ update দিন
NEXTAUTH_SECRET="generate-a-long-secret"
NEXTAUTH_TRUST_HOST=true
```

**Production (cPanel) উদাহরণ:**  
`DATABASE_URL="mysql://hasanali_juice_bar_user:YOUR_PASSWORD@localhost:3306/hasanali_juice_bar_db"`  
`NEXTAUTH_URL="https://juicebar.hasanalicollege.com"`

## 💻 লোকাল (XAMPP) সেটআপ

1. **XAMPP চালু করুন** – Apache + MySQL start করুন
2. **Database তৈরি করুন**
   - phpMyAdmin → নতুন DB `juice_bar` (UTF8MB4)
3. **Environment ফাইল**
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/juice_bar"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="local-secret"
   ```
4. **Dependency + DB + Seed**
   ```bash
   npm install
   npm run db:migrate   # drizzle-kit push
   npm run db:seed      # admin user + sample data
   ```
5. **ডেভ সার্ভার চালু করুন**
   ```bash
   npm run dev
   ```

## 📁 আপডেটেড ফাইল স্ট্রাকচার

```
scripts/
 ├─ seed.ts                   # Drizzle-based seed script
 └─ create-cpanel-archive.ts  # Deployment ZIP generator
src/
 ├─ app/                      # App Router pages + API routes
 ├─ db/schema.ts              # Drizzle schema
 └─ lib/db.ts                 # mysql2 + drizzle client
drizzle.config.ts             # Drizzle configuration
server.js                     # Custom Next server for cPanel
```

## 🧪 অ্যাডমিন অ্যাক্সেস (Seed ডেটা থেকে)

- **Email:** `admin@juicebar.com`
- **Password:** `admin123`
- লগইন করার পরে `/admin` রুট থেকে অ্যাডমিন প্যানেল পাওয়া যাবে।

## 📦 Deployment Overview (সংক্ষেপে)

1. `npm run package:cpanel` চালিয়ে `dist/deploy/` ফোল্ডারে ZIP তৈরি করুন
2. ZIP ফাইলটি cPanel এ `/home/hasanali/juicebar.hasanalicollege.com` ডিরেক্টরিতে আপলোড করে extract করুন
3. `.env.production` বা cPanel Environment variables সেট করুন
4. cPanel টার্মিনাল:
   ```bash
   cd ~/juicebar.hasanalicollege.com
   npm install
   npm run db:migrate         # Drizzle schema apply
   npm run db:seed            # প্রথমবারের জন্য
   npm run build              # যদি ZIP এ build না থাকে
   ```
5. Node.js অ্যাপ সেটআপ (startup file `server.js`)
6. App restart করে ডোমেইনে গিয়ে টেস্ট করুন

## 🔧 সাধারণ কমান্ডসমূহ

| কাজ                        | কমান্ড                   |
| -------------------------- | ------------------------ |
| Dependency install         | `npm install`            |
| Dev server                 | `npm run dev`            |
| Production build           | `npm run build`          |
| Start server (production)  | `npm run start`          |
| Drizzle migrate (prod/dev) | `npm run db:migrate`     |
| Seed data                  | `npm run db:seed`        |
| Create cPanel ZIP          | `npm run package:cpanel` |

## 🛠️ Troubleshooting (XAMPP)

- **MySQL connection error:** DATABASE_URL ঠিক আছে কিনা দেখুন, MySQL চালু আছে কিনা দেখুন
- **Migration ব্যর্থ:** `npm run db:migrate -- --force` (প্রয়োজনে), লগ দেখা দরকার হলে `drizzle` আউটপুট দেখুন
- **Seed ব্যর্থ:** DB schema আপডেট আছে কিনা যাচাই করুন, duplicate data থাকলে পুরোনো রেকর্ড মুছে দিন
- **Port conflict:** `server.js` এ `PORT` env দিয়ে নতুন port সেট করুন

## ✅ চেকলিস্ট

- [x] `.env.local` সেট করা
- [x] `npm run db:migrate` চালানো
- [x] `npm run db:seed` (প্রথমবার)
- [x] `npm run dev` অথবা `npm run build && npm run start`
- [x] Deployment এর আগে `npm run package:cpanel` চালিয়ে আর্কাইভ প্রস্তুত করা

সবকিছু ঠিক থাকলে আপনি লোকাল ও প্রোডাকশন—দুই জায়গাতেই স্মুথলি কাজ করতে পারবেন। শুভকামনা! 🚀
