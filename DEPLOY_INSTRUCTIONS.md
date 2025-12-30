# Friends Juice Bar — cPanel Deployment

## 🌍 Target Hosting

| Item             | Value                                         |
| ---------------- | --------------------------------------------- |
| Domain           | `juicebar.hasanalicollege.com`                |
| cPanel user      | `hasanali`                                    |
| Application root | `/home/hasanali/juicebar.hasanalicollege.com` |
| MySQL database   | `hasanali_juice_bar_db`                       |
| MySQL user       | `hasanali_juice_bar_user`                     |
| Node.js version  | 22.18.0 (সর্বোচ্চ উপলব্ধ)                     |
| Startup file     | `server.js`                                   |

> **Tip:** প্রথমে লোকাল মেশিনে সব পরিবর্তন টেস্ট করুন, তারপর নিচের ধাপগুলো অনুসরণ করুন।

---

## 1️⃣ লোকাল প্রিপারেশন

```bash
npm install
npm run db:migrate     # ডাটাবেস স্কিমা নিশ্চিত করুন
npm run db:seed        # প্রথমবার deploy করার আগে sample data
npm run package:cpanel # dist/deploy/ তে ZIP তৈরি হবে
```

স্ক্রিপ্টটি `.next`, `src`, `public`, `scripts`, কনফিগ ফাইল ইত্যাদি প্যাক করে `dist/deploy/juice-bar-frontend-cpanel-*.zip` তৈরি করবে। প্রয়োজন হলে আগে `npm run build` আলাদা করে চালাতে পারেন; স্ক্রিপ্ট নিজেও build রান করে।

---

## 2️⃣ ফাইল আপলোড

1. cPanel → **File Manager**
2. ডিরেক্টরি: `/home/hasanali/juicebar.hasanalicollege.com`
3. `dist/deploy/` থেকে তৈরি ZIP আপলোড করুন
4. ডিরেক্টরির ভিতরে ZIP extract করুন (existing ফাইলগুলোর ব্যাকআপ থাকলে ভালো)

Extract হলে স্ট্রাকচার এমন দেখাবে:

```
juicebar.hasanalicollege.com/
 ├─ .next/
 ├─ public/
 ├─ src/
 ├─ scripts/
 ├─ node_modules/        (zip এ নেই, cPanel এ install করবেন)
 ├─ package.json
 ├─ package-lock.json
 ├─ server.js
 ├─ drizzle.config.ts
 └─ ...
```

---

## 3️⃣ Environment Variables

### Option A: `.env.production` ফাইল

ফাইল পাথ: `/home/hasanali/juicebar.hasanalicollege.com/.env.production`

```env
DATABASE_URL="mysql://hasanali_juice_bar_user:4uZtNf0gFRGzVR8u@localhost:3306/hasanali_juice_bar_db"
NEXTAUTH_URL="https://juicebar.hasanalicollege.com"
NEXTAUTH_SECRET="generate-a-strong-secret"
NEXTAUTH_TRUST_HOST=true
NODE_ENV=production
PORT=3010  # চাইলে পরিবর্তন করুন
```

### Option B: Node.js App Manager → Environment Variables

উপরের প্রতিটি key/value আলাদাভাবে add করুন। Password ও অন্যান্য বিশেষ ক্যারেক্টার থাকলে URL encode করুন।

---

## 4️⃣ cPanel Terminal Commands

cPanel → **Terminal** এ যান এবং নিচের কমান্ডগুলো চালান:

```bash
cd ~/juicebar.hasanalicollege.com

# Dependency install (dev deps সহ, কারণ আমরা tsx ব্যবহার করি)
npm install

# ডাটাবেস স্কিমা (Drizzle)
npm run db:migrate

# প্রথম deploy হলে seed চালান (একবারই)
npm run db:seed

# Build (যদি লোকাল build সহ জিপ না করে থাকেন)
npm run build
```

`public/uploads` ডিরেক্টরিতে প্রয়োজনীয় ফাইল/পারমিশন সেট করুন:

```bash
mkdir -p public/uploads/{banners,products,profiles}
chmod -R 755 public/uploads
```

---

## 5️⃣ Node.js Application Setup

1. cPanel → **Software → Setup Node.js App**
2. **Create Application** নির্বাচন করুন (অথবা পূর্বের অ্যাপ এডিট করুন)
3. কনফিগারেশন:
   - **Node.js version:** 22.18.0 (অথবা নিকটবর্তী সমর্থিত)
   - **Application mode:** Production
   - **Application root:** `juicebar.hasanalicollege.com`
   - **Application URL:** `https://juicebar.hasanalicollege.com`
   - **Application startup file:** `server.js`
   - **Environment variables:** `.env.production` বা UI তে যুক্ত করা মান অনুযায়ী
4. Save করে **Restart App** চাপুন

`server.js` ফাইলটি Next.js production server bootstrap করে এবং `PORT` env ব্যবহার করে লিসেন করে। Node.js App Manager নিজে থেকে সঠিক পোর্ট অ্যাসাইন করলে সেটাই ব্যবহার হবে।

---

## 6️⃣ Smoke Test

1. ব্রাউজারে যান → `https://juicebar.hasanalicollege.com`
2. `/admin` রুটে গিয়ে seed data থেকে দেওয়া অ্যাডমিন দিয়ে লগইন করে টেস্ট করুন
3. যদি Error দেখা যায়:
   - Node.js App Manager → Logs চেক করুন
   - `.env.production` এ DATABASE_URL ও NEXTAUTH_SECRET ঠিক আছে কিনা যাচাই করুন
   - `npm run db:migrate` এবং `npm run build` পুনরায় চালান

---

## 🐛 Troubleshooting

| সমস্যা                             | সমাধান                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| App start হয় না                    | Node.js App Manager → Logs দেখুন, `.env.production` আপডেট করুন                |
| Database সংযোগ ব্যর্থ              | DATABASE_URL এর username/password সঠিক কিনা, প্রয়োজন হলে URL encode করুন      |
| 502 / Bad Gateway                  | সার্ভার restart করুন, `npm run build` চালানো হয়েছে কিনা নিশ্চিত করুন         |
| Seed চলেনি কিন্তু rerun করতে চান   | `npm run db:seed` পুনরায় চালাতে পারেন (upsert ভিত্তিক হওয়ায় safe)          |
| Port conflict                      | `.env.production` এ `PORT` পরিবর্তন করুন এবং Node.js App Manager এ আপডেট করুন |
| File permission সমস্যা (`uploads`) | উপরের `chmod` কমান্ড পুনরায় চালান                                            |

---

## 📎 রেফারেন্স ডক

- `README.md` – ওভারভিউ + কুইক রেফারেন্স
- `README_SETUP.md` – লোকাল সেটআপ + টেক স্ট্যাক বিস্তারিত
- `QUICK_DEPLOY.md` – বাংলা দ্রুত গাইড / চিটশিট

---

**Deployment complete! 🚀**  
যদি নতুন কোন কনফিগ যুক্ত করেন (নতুন env var, রাউট ইত্যাদি) অবশ্যই উপরোক্ত ডকগুলো আপডেট রাখতে ভুলবেন না।
