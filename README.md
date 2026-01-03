## Friends Juice Bar Frontend

Next.js 15 (App Router) based admin + customer experience for Friends Juice Bar. The project now uses:

- **Database access:** Drizzle ORM + mysql2
- **Authentication:** NextAuth (Credentials provider)
- **UI:** Tailwind-based design system with Radix primitives
- **Deployment targets:** Local (XAMPP), cPanel Node.js hosting, and Vercel

All Prisma dependencies and schema files have been removed in favour of Drizzle to keep the runtime lightweight for shared hosting.

---

## Local Development

```bash
npm install

# Environment (create .env.local)
DATABASE_URL="mysql://root:@localhost:3306/juice_bar"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="set-a-strong-secret"

# Database schema + seed (against your local MySQL / XAMPP)
npm run db:migrate
npm run db:seed

# Start dev server
npm run dev
```

Drizzle migrations are configured in `drizzle.config.ts`. `npm run db:migrate` uses `drizzle-kit push` so it is safe to run repeatedly on development and staging databases.

---

## Key NPM Scripts

| Script                   | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `npm run dev`            | Run Next.js dev server                                        |
| `npm run build`          | Create production build (`.next/`)                            |
| `npm run start`          | Start custom Next.js server (uses `server.js`)                |
| `npm run lint`           | ESLint                                                        |
| `npm run db:migrate`     | Apply schema changes using Drizzle                            |
| `npm run db:seed`        | Seed essential data (admin user, sample products, etc.)       |
| `npm run package:cpanel` | Build and create a deployment ZIP for cPanel (`dist/deploy/`) |

---

## Deployment Docs

The following markdown files contain detailed deployment instructions (Bangla + English mix tailored for this project):

- `README_SETUP.md` – Tech stack, environment variables, and local setup guide
- `DEPLOY_INSTRUCTIONS.md` – Step-by-step cPanel deployment walkthrough
- `QUICK_DEPLOY.md` – Bangla quick-reference for repeating deployments
- `VERCEL_DEPLOY.md` – **Vercel deployment guide (Bangla)** 🚀

Always review and keep those files updated when the deployment process changes.

---

## cPanel Quick Reference

- **Domain:** `juicebar.hasanalicollege.com`
- **Application Root:** `/home/hasanali/juicebar.hasanalicollege.com`
- **MySQL Database:** `hasanali_juice_bar_db`
- **MySQL User:** `hasanali_juice_bar_user`
- **Node.js Startup File:** `server.js`

Use `npm run package:cpanel` to generate `dist/deploy/juice-bar-frontend-cpanel-*.zip`. Upload and extract that archive in the application root, then follow the commands and environment setup described in `DEPLOY_INSTRUCTIONS.md`.

---

## Support

If you run into build or deployment issues:

1. Confirm `.env` / `.env.production` values match the target database and domain.
2. Re-run `npm run db:migrate` to ensure schema is current.
3. Check cPanel Node.js App Manager logs after restarting the app.
4. Refer to the troubleshooting notes in `DEPLOY_INSTRUCTIONS.md` and `QUICK_DEPLOY.md`.

Happy deploying! 🚀

# juice-bar-frontend
