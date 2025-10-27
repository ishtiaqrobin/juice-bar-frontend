# Quick Deploy Guide (বাংলা)

## 🚀 দ্রুত ডিপ্লয় করার ধাপ সমূহ

### ১. লোকে বিল্ড করুন

```bash
# Windows এ এই command চালান
build-production.bat

# অথবা manually
npm install
npx prisma generate
npm run build
```

### ২. cPanel এ Upload করুন

- cPanel → File Manager → `public_html` বা আপনার domain folder
- এই ফোল্ডারগুলো upload করুন:
  - `.next/` (পুরো ফোল্ডার)
  - `public/` (পুরো ফোল্ডার)
  - `server.js`
  - `package.json`
  - `package-lock.json`
  - `next.config.ts`

### ৩. Terminal এ Dependencies Install করুন

cPanel এর SSH/Terminal এ:

```bash
cd public_html  # আপনার folder path
npm install --production
npx prisma generate
```

### ৪. Environment Variables সেটাপ করুন

cPanel → File Manager → `.env` file তৈরি করুন:

```env
DATABASE_URL="mysql://ezbitlyc_juice_bar_user:Wk%24Y%28OwEPInC%29N%5E%25@localhost:3306/ezbitlyc_juice_bar_db"
NEXTAUTH_URL="https://friendsjuicebar.ezbitly.com"
NEXTAUTH_SECRET="sdfn23kLx8asdS09asdlk23n8asdflkjQWEr234asdfjkl="
NODE_ENV=production
```

**⚠️ গুরুত্বপূর্ণ:** Special characters escape করতে হবে:

- `$` → `%24`
- `(` → `%28`
- `)` → `%29`
- `^` → `%5E`
- `%` → `%25`

### ৫. Node.js App Setup করুন

1. cPanel → Software → Node.js App
2. "Create Application" click করুন
3. Settings:

   - **Node.js version:** 18.x বা 20.x
   - **Application mode:** Production
   - **Application root:** `/home/ezbitlyc/public_html`
   - **Application URL:** friendsjuicebar.ezbitly.com
   - **Application startup file:** `server.js`
   - **Port:** 1296

4. Environment Variables add করুন (উপরের .env এর values)

### ৬. Database Setup করুন

```bash
# Prisma migrations run করুন
npm run db:migrate

# Database seed করুন (optional)
npm run db:seed
```

### ৭. App Start করুন

Node.js App Manager এ "Restart App" click করুন

### ৮. Test করুন

আপনার domain এ visit করুন: `https://friendsjuicebar.ezbitly.com`

---

## ⚡ দ্রুত Commands

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Database Commands

```bash
npm run db:migrate    # Deploy migrations
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed database
```

---

## 🐛 সমস্যা হলে

### Build Error

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Database Error

```bash
npx prisma db push
npx prisma generate
```

### Port Error

`server.js` এ port পরিবর্তন করুন:

```javascript
const port = process.env.PORT || 3000; // Different port
```

---

## 📞 সাহায্যের জন্য

সম্পূর্ণ গাইড দেখুন: `CPANEL_DEPLOYMENT.md`
