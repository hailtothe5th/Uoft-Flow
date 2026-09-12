# UofT Flow — Supabase Setup Guide

This guide explains how to connect the UofT Flow app to your Supabase backend.

## ✅ What's Already Done

The following have been configured in this project:

1. **Packages installed** — `@supabase/supabase-js` and `@supabase/ssr`
2. **Supabase client** — `src/lib/supabase.ts` uses `@supabase/ssr`'s `createBrowserClient`
3. **Environment variables** — `.env` contains your Supabase URL and publishable key
4. **Auth integration** — `src/context/AuthContext.tsx` uses Supabase Auth (with localStorage fallback)
5. **Data integration** — `src/context/DataContext.tsx` reads/writes to Supabase tables (with localStorage fallback)
6. **Database schema** — `supabase/schema.sql` contains all tables, indexes, RLS policies, and triggers

## 🔧 Setup Steps

### Step 1: Run the Database Schema

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/wzjvdwgocqzgdrxjvfir)
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the contents of `supabase/schema.sql` and paste it
5. Click **Run** to execute

This creates:
- `profiles` table (user display names)
- `facilities` table (toilets & fountains)
- `reviews` table (student reviews)
- Row Level Security (RLS) policies
- Auto-profile creation trigger on signup

### Step 2: Configure Auth

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Enable **Email** provider
3. Optionally disable "Confirm email" for testing (Authentication → Providers → Email → Settings)
4. For production, keep email confirmation enabled

### Step 3: Seed Data (Optional)

You can either:
- **Option A**: Run the app — it will use localStorage fallback with seed data
- **Option B**: Insert seed data directly into Supabase using the SQL in `supabase/schema.sql` (uncomment the seed section)

### Step 4: Verify

1. Run `npm run dev`
2. Open the app in your browser
3. Sign in with your email
4. Try submitting a review — it should appear in the Supabase `reviews` table

## 🔑 Environment Variables

The app uses these environment variables (in `.env`):

```
VITE_SUPABASE_URL=https://wzjvdwgocqzgdrxjvfir.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
```

**Note:** Vite requires the `VITE_` prefix for client-side environment variables.

## 📊 Database Tables

### `profiles`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | References auth.users |
| email | TEXT | User's email |
| display_name | TEXT | Public display name |

### `facilities`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| type | TEXT | 'toilet' or 'fountain' |
| name | TEXT | Facility name |
| building | TEXT | Building name |
| floor_note | TEXT | Floor/location description |
| gender_designation | TEXT | Men's/Women's/All-gender (toilets only) |
| accessible | BOOLEAN | Wheelchair accessible |
| lat | DOUBLE | Latitude |
| lng | DOUBLE | Longitude |
| has_bottle_filler | BOOLEAN | Fountain has bottle filler |
| has_chilled | BOOLEAN | Fountain has chilled water |
| created_by | TEXT | User who added it |

### `reviews`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| facility_id | UUID | References facilities |
| user_id | TEXT | Author's user ID |
| user_name | TEXT | Author's display name |
| overall_rating | INT | 1-5 |
| cleanliness_rating | INT | 1-5 |
| condition | TEXT | Excellent/Good/Needs attention/Out of order |
| comment | TEXT | Optional review text |

## 🔒 Security (RLS Policies)

- **profiles**: Public read, users can only insert/update their own
- **facilities**: Public read, authenticated users can insert
- **reviews**: Public read, authenticated users can insert, authors can delete their own

## 🔄 Fallback Behavior

The app gracefully falls back to localStorage if:
- Supabase is unreachable
- The user isn't authenticated
- Tables are empty

This means the app works even without Supabase configured — it just won't persist data across devices.

## 📝 Architecture Notes

### Why `@supabase/ssr` in a Vite app?

The `@supabase/ssr` package provides `createBrowserClient`, which is the recommended way to create a Supabase client in browser-based apps (Vite, React, etc.). It offers better session management than plain `@supabase/supabase-js`.

### Why no server.ts or middleware.ts?

The Next.js-specific files (`utils/supabase/server.ts` and `utils/supabase/middleware.ts`) use Next.js features like:
- Server Components
- `cookies()` from `next/headers`
- `NextRequest` / `NextResponse`

These don't exist in Vite + React. For this project, we only need the browser client, which handles all authentication and data operations client-side.

### If you migrate to Next.js later:

You can add the server client and middleware files from the Next.js Supabase guide. The database schema and RLS policies remain the same.

## 🔐 Note on API Keys

The `SUPABASE_SECRET_KEY` provided is masked (`sb_secret_8EY00•••...`). This key is only needed for **server-side** operations (Edge Functions, backend APIs). For this frontend app, only the publishable key is required.

If you need to build server-side features later:
1. Get your secret key from Supabase Dashboard → Settings → API Keys
2. Use it only in server-side code (never in frontend)
3. Consider using `@supabase/server` for Edge Functions
