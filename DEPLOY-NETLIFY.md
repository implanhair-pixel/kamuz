# راه‌اندازی رایگان کوردآموز روی Netlify — فقط با جیمیل (بدون کارت بانکی)

| سرویس | کاربرد | رایگان؟ |
|---|---|---|
| **Turso** | دیتابیس (سازگار با SQLite) | ✅ تا ۵ گیگ |
| **Cloudinary** | ذخیره‌ی فایل صدا | ✅ ماهی ۲۵ کریدیت |
| **Netlify** | هاست سایت | ✅ بدون محدودیت شخصی |

همه‌شون با دکمه‌ی **"Continue with Google"** ساخته می‌شن — صفر کارت بانکی.

---

## بخش ۱ — ساخت دیتابیس در Turso

1. برو به **[app.turso.tech/signup](https://app.turso.tech/signup)** → دکمه‌ی **Google**
2. توی داشبورد، یک دیتابیس جدید بساز (Create Database) → اسمش رو بگذار مثلاً `kurdamuz`
3. داخل صفحه‌ی دیتابیس، بخش **Connect** یا **Settings** رو پیدا کن:
   - مقدار **URL** (با `libsql://` شروع می‌شه) → کپی کن
   - دکمه‌ی ساخت **Token** → بزن و کپی کن
4. توی بخش **SQL Console** (یا Shell/Studio) این کد رو paste کن و اجرا کن:

```sql
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "VoiceRecording" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dialect" TEXT NOT NULL DEFAULT 'sorani',
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "duration" REAL NOT NULL DEFAULT 0,
    "ipHash" TEXT NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT 'ناشناس',
    "userId" TEXT,
    "vocabId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "avgRating" REAL NOT NULL DEFAULT 0,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalScore" REAL NOT NULL DEFAULT 0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VoiceRecording_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "VoiceRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "voiceId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'like',
    "userId" TEXT,
    "ipHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VoiceRating_voiceId_fkey" FOREIGN KEY ("voiceId") REFERENCES "VoiceRecording" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipHash" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "VoiceRating_voiceId_userId_key" ON "VoiceRating"("voiceId", "userId");
CREATE UNIQUE INDEX "RateLimit_ipHash_action_key" ON "RateLimit"("ipHash", "action");
```

5. اگه SQL Console نداری، از ترمینال:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   turso auth login
   turso db shell kurdamuz
   ```
   کد SQL بالا رو paste کن، Enter بزن، بعد `.quit` برای خروج.

✅ **یادداشت کن:** مقادیر `URL` و `Token` — بخش ۴ لازمت می‌شن.

---

## بخش ۲ — ساخت Cloudinary

1. برو به **[cloudinary.com](https://cloudinary.com)** → Sign Up → **Continue with Google**
2. توی داشبورد (صفحه‌ی اول) بخش **Product Environment Credentials** رو پیدا کن:
   - `Cloud name`
   - `API Key`
   - `API Secret` (روی "Show" کلیک کن)

✅ **یادداشت کن:** این سه مقدار — بخش ۴ لازمت می‌شن.

---

## بخش ۳ — دیپلوی روی Netlify (بدون نیاز به GitHub)

### ۳.۱ — نصب پیش‌نیازها

روی کامپیوترت **Node.js** نصب کن اگه نداری: [nodejs.org](https://nodejs.org) (نسخه‌ی LTS)

```bash
# بررسی نصب بودن Node
node --version   # باید v18 یا بالاتر نشون بده
npm --version
```

### ۳.۲ — نصب وابستگی‌های پروژه

فایل zip رو از حالت فشرده خارج کن (Extract)، بعد در ترمینال:

```bash
cd مسیر/پوشه‌ی/پروژه
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` به‌خاطر سازگاری بین چند کتابخانه لازمه — نگران نباش.

### ۳.۳ — ساخت اکانت Netlify و لاگین

```bash
npm install -g netlify-cli
netlify login
```

مرورگر باز می‌شه → **Continue with Google** → اکانت Netlify ساخته می‌شه.

### ۳.۴ — اولین دیپلوی

```bash
netlify deploy
```

چندتا سوال می‌پرسه:
- `Create & configure a new site` → Enter
- `Team` → Enter (تیم پیش‌فرضت)
- `Site name` → اسم دلخواه بنویس (مثلاً `kurdamuz`) یا Enter برای رندوم

در پایان یک **Draft URL** بهت می‌ده — این فقط یه پیش‌نمایشه، هنوز متغیرها رو نگذاشتیم.

---

## بخش ۴ — تنظیم متغیرهای محیطی در Netlify

1. برو به **[app.netlify.com](https://app.netlify.com)** → پروژه‌ات رو باز کن
2. **Site configuration → Environment variables → Add a variable**
3. این مقادیر رو یکی‌یکی اضافه کن:

| Key | Value |
|---|---|
| `TURSO_DATABASE_URL` | از Turso (شروع با `libsql://`) |
| `TURSO_AUTH_TOKEN` | از Turso |
| `DATABASE_URL` | `file:./dev.db` (دستش نزن) |
| `CLOUDINARY_CLOUD_NAME` | از Cloudinary |
| `CLOUDINARY_API_KEY` | از Cloudinary |
| `CLOUDINARY_API_SECRET` | از Cloudinary |
| `ADMIN_USERNAME` | `admin` یا هرچی خودت خواستی |
| `ADMIN_PASSWORD` | یک پسورد قوی و جدید |
| `NEXTAUTH_SECRET` | یک رشته‌ی رندوم بلند (ببین زیر) |
| `NEXTAUTH_URL` | آدرس سایتت (ببین زیر) |

**برای `NEXTAUTH_SECRET`:** توی ترمینال این دستور رو بزن و خروجیش رو کپی کن:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**برای `NEXTAUTH_URL`:** آدرسی که Netlify بهت داد (مثلاً `https://kurdamuz.netlify.app`) — بعد از اولین دیپلوی توی داشبورد Netlify می‌بینیش.

---

## بخش ۵ — دیپلوی نهایی

```bash
netlify deploy --prod
```

این دستور build کامل می‌کنه و سایت رو زنده می‌کنه.

---

## بخش ۶ — تست نهایی

آدرس نهایی‌ات رو باز کن و چک کن:

- [ ] صفحه‌ی اصلی لود می‌شه
- [ ] ثبت‌نام یک کاربر تستی
- [ ] لاگین ادمین از `/?view=admin` با یوزر/پسوردی که گذاشتی
- [ ] ضبط یک صدا و آپلودش (باید توی Cloudinary هم ظاهر شه)
- [ ] رای دادن به یک صدا
- [ ] تغییر زبان و چک کردن RTL

---

## آپدیت کد در آینده

هر بار که کد رو عوض کردی، فقط همین یه دستور کافیه:

```bash
netlify deploy --prod
```

---

## عیب‌یابی رایج

### ❌ خطای build هنگام `npm install`
```bash
npm install --legacy-peer-deps
```
اگه هنوز خطا داد، Node.js رو به نسخه‌ی ۲۰ ارتقا بده.

### ❌ سایت باز می‌شه ولی API کار نمی‌کنه (خطای 500)
→ متغیرهای محیطی رو چک کن. احتمالاً `TURSO_DATABASE_URL` یا `TURSO_AUTH_TOKEN` خالیه.

### ❌ لاگین کار نمی‌کنه
→ `NEXTAUTH_URL` رو دقیقاً با `https://` و بدون `/` آخر بگذار.
→ `NEXTAUTH_SECRET` رو چک کن — نباید خالی باشه.

### ❌ آپلود صدا کار نمی‌کنه
→ مقادیر Cloudinary رو دوباره چک کن. از Cloudinary داشبورد وارد شو و مطمئن شو درسته.

---

## محدودیت‌های پلن رایگان

- **Netlify:** ماهی ۱۰۰ گیگابایت bandwidth و ۳۰۰ دقیقه build — برای استفاده‌ی شخصی کافیه.
- **Turso:** تا ۵ گیگ فضا، ۵۰۰ میلیون خوندن در ماه.
- **Cloudinary:** ماهی ۲۵ کریدیت (هر صدای چند ثانیه‌ای چند صدم کریدیت می‌خوره).
- هیچ کارت بانکی‌ای ثبت نکردی → هیچ‌وقت چیزی کم نمی‌شه.
