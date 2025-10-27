# cPanel Deployment Instructions - Friends Juice Bar

## 🎯 Your cPanel Information

- **Domain:** friendsjuicebar.ezbitly.com
- **cPanel Username:** ezbitlyc
- **Port:** 3000
- **Application Root:** /home/ezbitlyc/public_html

## ✅ Already Configured

All files have been updated with your specific cPanel information:

- ✅ Domain set to `friendsjuicebar.ezbitly.com`
- ✅ Port set to `3000`
- ✅ Username set to `ezbitlyc`
- ✅ Database credentials configured

## 🚀 Quick Deployment Steps

### Step 1: Build Locally

```bash
build-production.bat
```

Or manually:

```bash
npm install
npx prisma generate
npm run build
```

### Step 2: Upload to cPanel

Via cPanel File Manager, upload these to `/home/ezbitlyc/public_html`:

- `.next/` folder (build output)
- `public/` folder
- `server.js`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `prisma/` folder

### Step 3: Create .env File in cPanel

Create `.env` file in `/home/ezbitlyc/public_html/`:

```env
DATABASE_URL="mysql://ezbitlyc_juice_bar_user:Wk%24Y%28OwEPInC%29N%5E%25@localhost:3306/ezbitlyc_juice_bar_db"
NEXTAUTH_URL="https://friendsjuicebar.ezbitly.com"
NEXTAUTH_SECRET="sdfn23kLx8asdS09asdlk23n8asdflkjQWEr234asdfjkl="
NODE_ENV=production
PORT=1296
```

### Step 4: SSH/Terminal Commands

```bash
cd /home/ezbitlyc/public_html
npm install --production
npx prisma generate
npm run db:migrate
```

### Step 5: Setup Node.js App in cPanel

1. Go to **cPanel → Software → Setup Node.js App**
2. Click **Create Application**
3. Configure:

   - **Node.js version:** 18.x or 20.x
   - **Application mode:** Production
   - **Application root:** `/home/ezbitlyc/public_html`
   - **Application URL:** friendsjuicebar.ezbitly.com
   - **Application startup file:** `server.js`
   - **Load balancer or port:** 1296

4. **Add Environment Variables:**

   - Click "Show All Environment Variables"
   - Add each variable from your `.env` file
   - Click "Save Environment Variables"

5. **Run Application:**
   - Click "Restart App"

### Step 6: Test

Visit: **https://friendsjuicebar.ezbitly.com**

## 📋 Database Information

```
Database Name: ezbitlyc_juice_bar_db
Database User: ezbitlyc_juice_bar_user
Database Password: Wk$Y(OwEPInC)N^%
Database Host: localhost
Database Port: 3306
```

## 🔧 Important Notes

### Port Configuration

- Default port is **1296** (configured in `server.js`)
- Make sure cPanel Node.js App Manager uses the same port
- Update in cPanel if different

### Environment Variables

All special characters in DATABASE_URL are URL-encoded:

- `$` → `%24`
- `(` → `%28`
- `)` → `%29`
- `^` → `%5E`
- `%` → `%25`

### File Permissions

After upload, set proper permissions:

```bash
chmod -R 755 public/uploads
```

## 🐛 Troubleshooting

### If App Doesn't Start

```bash
# Check logs in cPanel → Node.js App Manager
# Try restarting the app
```

### If Database Connection Fails

```bash
# Verify database credentials in cPanel
# Test connection:
npx prisma db push --skip-generate
```

### If Port Issues

- Verify port 1296 is configured in Node.js App Manager
- Check if port is already in use
- Update server.js port if needed

## 📞 Support Files

For detailed instructions, see:

- `QUICK_DEPLOY.md` - Quick deployment guide (Bangla)
- `CPANEL_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOY_CHECKLIST.md` - Pre-deployment checklist

---

**Ready to Deploy! 🚀**
