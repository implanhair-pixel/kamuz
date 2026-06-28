# کوردآموز (KurdAmuz)

A free, modern Kurdish language learning platform with Sorani, Kalhori & Kurmanji dialect support.

## Features

- 📚 **Interactive lessons** — structured learning paths with vocabulary, flashcards, quizzes and matching games
- 🔁 **Spaced repetition (SRS)** — Leitner-box algorithm surfaces words right before you forget them
- 🌐 **Dialect-aware vocabulary** — Sorani, Kalhori and Kurmanji variants side-by-side
- 🎙️ **Community voices** — users record pronunciations of vocabulary words; community likes/dislikes them
- 👍 **Like/Dislike voting** — sign in to vote; toggle your vote; top voices rise to the podium
- 🏆 **Gamification** — XP, streaks, levels and achievements
- 🌍 **i18n** — English / فارسی / کوردی with full RTL support
- 🌙 **Dark glassmorphism UI** — customizable accent color, font size, theme
- 🔐 **Email/password auth** + optional Google OAuth
- 🛡️ **Admin panel** — moderate voice recordings

## Tech stack

- Next.js 16 (App Router) + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Prisma ORM + SQLite
- NextAuth.js v4 (Credentials + Google providers)
- Framer Motion, Zustand, TanStack Query

## Quick start

```bash
# 1. Install dependencies
bun install   # or: npm install / pnpm install

# 2. Generate Prisma client + sync DB schema
bunx prisma generate
bunx prisma db push

# 3. Start the dev server
bun run dev   # http://localhost:3000
```

## Environment variables

Create a `.env` file at the project root:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kurdamuz@admin2024
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Optional — leave empty to disable Google sign-in
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Admin access

```
URL:      /?view=admin  (or click "Admin" in the mobile menu)
Username: admin
Password: kurdamuz@admin2024
```

## Voice recording rules

- Users must **select a vocabulary word** from the dictionary before recording.
- The title is auto-generated from the selected word + dialect.
- Like/dislike voting **requires authentication** (email/password or Google).
- Users cannot vote on their own recordings.
- Voices are visible to everyone; only signed-in users can vote.

## Project structure

```
prisma/
  schema.prisma           # User, VoiceRecording, VoiceRating, RateLimit, AdminLog
src/
  app/
    api/
      auth/               # NextAuth routes + /register + /status
      voices/             # GET/POST voices, /top, /:id/rate
      admin/              # /login, /voices
      user/profile        # GET profile
    page.tsx              # Single-page app with view-switching
    layout.tsx
  components/             # All UI components
    ui/                   # shadcn/ui primitives
  contexts/AppContext.tsx # i18n + gamification + theme
  data/                   # Static vocabulary, lessons, paths, dialects
  i18n/                   # en.ts / fa.ts / ku.ts
  lib/                    # auth.ts, db.ts, utils.ts, rate-limit.ts
  types/                  # Canonical TypeScript types
public/                   # Static assets + voice uploads
```

## Scripts

```bash
bun run dev          # Start dev server on port 3000
bun run build        # Production build (standalone)
bun run lint         # ESLint
bun run db:push      # Sync Prisma schema → SQLite
bun run db:generate  # Regenerate Prisma client
```

## License

Free & open learning for everyone.
