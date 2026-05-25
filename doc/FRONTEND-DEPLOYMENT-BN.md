# ফ্রন্টএন্ড ডেপ্লয়মেন্ট গাইড (cPanel)

আপনার ফ্রন্টএন্ড অ্যাপ্লিকেশনটি একটি Next.js প্রজেক্ট। cPanel-এ এটি চালানোর জন্য একটি কাস্টম `server.js` ফাইল ব্যবহার করা হয়েছে। নিচের গাইডটি অনুসরণ করে ডেপ্লয় করুন।

## ১. প্রয়োজনীয় ফাইল সমূহ (যা জিপ করতে হবে)

আপনার লোকাল কম্পিউটার থেকে `npm run build` করার পর নিচের ফাইল ও ফোল্ডারগুলো নিয়ে একটি জিপ ফাইল তৈরি করুন:

- `.next/` (বিল্ড আউটপুট ফোল্ডার)
- `public/` (স্ট্যাটিক ইমেজ ও আইকন)
- `server.js` (cPanel এর স্টার্টআপ ফাইল যা Next.js সার্ভার রান করে)
- `next.config.mjs` (কনফিগারেশন ফাইল, বিশেষ করে ইমেজ ফিিক্সের জন্য এটি জরুরি)
- `.env.production` (প্রোডাকশন এনভায়রনমেন্ট ভেরিয়েবল)
- `package.json`
- `package-lock.json`
- `.htaccess` (HTTPS এবং প্রক্সি সেটআপের জন্য)

**❌ যা জিপে নেবেন না:**

- `node_modules/` (সার্ভারে নতুন করে ইনস্টল করতে হবে)
- `src/` (বিল্ড হয়ে গেলে আর দরকার নেই)
- `.git/`

---

## ২. cPanel Node.js সেটআপ

- **Node.js version:** **20.x** অথবা **22.x** (LTS version ব্যবহারের পরামর্শ দিচ্ছি)।
- **Application mode:** `production`
- **Application root:** `frontend.friendsjuicebar`
- **Application URL:** `https://friendsjuicebar.com`
- **Application startup file:** `server.js`

---

## ৩. Environment Variables

আপনি `.env.production` ফাইলটি আপলোড করছেন। Next.js বিল্ড করার সময় অধিকাংশ ভেরিয়েবল নিয়ে নেয়। তবে সার্ভারে রান করার জন্য cPanel UI তে নিচের ভেরিয়েবলগুলো চেক করে নিতে পারেন:

- `NODE_ENV`: `production`
- `PORT`: `3000` (অথবা আপনার পছন্দমতো)

---

## ৪. ডেপ্লয়মেন্ট ধাপসমূহ (সঠিক ক্রম)

১. **বিল্ড করুন:** লোকালে `npm run build` রান করুন। এটি `.next` ফোল্ডার তৈরি করে।
২. **জিপ ও আপলোড:** উপরের তালিকা অনুযায়ী ফাইলগুলো জিপ করে `frontend.friendsjuicebar` ফোল্ডারে আপলোড এবং আনজিপ করুন।

- **গুরুত্বপূর্ণ:** `.next` ফোল্ডার অবশ্যই আপলোড করতে হবে - এটি ছাড়া অ্যাপ চলবে না।
  ３. **Node.js অ্যাপ সেটআপ:** cPanel থেকে Node.js এপ্লিকেশন সেটআপ সম্পন্ন করুন।
  ４. **ডিপেন্ডেন্সি ইনস্টল:** টার্মিনাল থেকে `npm install` দিন (অথবা cPanel থেকে "Run NPM Install")।
  ५. **অডিট ফিক্স:** টার্মিনাল থেকে `npm audit fix` দিন (ভালনারেবিলিটি সমাধানের জন্য)।
  ६. **রিস্টার্ট:** অ্যাপটি cPanel থেকে **Restart** করুন এবং ৩০ সেকেন্ড অপেক্ষা করুন।

---

## ৫. সিপ্যানেল টার্মিনাল কমান্ড

যদি টার্মিনাল ব্যবহার করতে চান:

```bash
# প্রজেক্ট ডিরেক্টরিতে যান
cd frontend.friendsjuicebar

# ডিপেন্ডেন্সি ইনস্টল করুন (সব ডিপেন্ডেন্সি সহ)
npm install

# Security ভালনারেবিলিটি ঠিক করুন
npm audit fix
```

⚠️ **গুরুত্বপূর্ণ:** `npm install --production` ব্যবহার করবেন না - এটি `next` মডিউল মিস করতে পারে। সব ডিপেন্ডেন্সি ইনস্টল করুন।

---

## ৬. ট্রাবলশুটিং (503 Service Unavailable)

যদি 503 এরর দেখেন, তাহলে:

### ১. `.next` ফোল্ডার আছে কিনা চেক করুন

```bash
ls -la /home/friendsj/frontend.friendsjuicebar/ | grep .next
```

**যদি `.next` না থাকে:**

- লোকালে এই কমান্ড দিন: `npm run build`
- তারপর `.next` ফোল্ডার সার্ভারে আপলোড করুন

### ২. `server.js` চেক করুন

```bash
cat /home/friendsj/frontend.friendsjuicebar/server.js
```

### ৩. Node.js মডিউল সঠিক আছে কিনা চেক করুন

```bash
ls -la /home/friendsj/frontend.friendsjuicebar/node_modules | grep next
```

### ৪. অ্যাপ রিস্টার্ট করুন

cPanel > Node.js Applications > Restart বাটনে ক্লিক করুন।
তারপর ৩০ সেকেন্ড অপেক্ষা করুন এবং আবার চেষ্টা করুন।

### ৫. stderr.log চেক করুন

```bash
tail -50 /home/friendsj/frontend.friendsjuicebar/stderr.log
```

---

## ৭. ইমেজ সমস্যা সমাধান (গুরুত্বপূর্ণ)

যদি ইমেজ না দেখা যায়, তবে নিশ্চিত করুন যে:

- `next.config.mjs` ফাইলে `http` এবং `https` উভয়ই `backend.friendsjuicebar.com` এর জন্য এলাউ করা আছে।
- ব্যাকএন্ড সার্ভার চালু আছে এবং `https://backend.friendsjuicebar.com` থেকে ডেটা আসছে।

---

### ⚠️ গুরুত্বপূর্ণ টিপস:

- **প্রতিবার আপডেট:**
  1. লোকালে `npm run build` দিন
  2. `.next` ফোল্ডার সার্ভারে আপলোড করুন
  3. শুধু পরিবর্তিত ফাইলগুলো (যেমন `server.js`, config ইত্যাদি) আপডেট করুন
  4. cPanel থেকে অ্যাপ Restart করুন

- **কখনো করবেন না:**
  - `npm install --production` - এটি মডিউল মিস করতে পারে
  - `npm audit fix --force` - এটি প্যাকেজ ভেরশন ভেঙে দিতে পারে
  - লোকাল থেকে `.env.production` ছাড়া ডেপ্লয় করবেন না

- **ক্যাশ ক্লিয়ার:** ব্রাউজারে `Ctrl + F5` চাপুন।
