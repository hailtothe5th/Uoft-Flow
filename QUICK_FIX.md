# 🚨 Quick Fix: 404 Errors on /rest/v1/facilities and /rest/v1/reviews

## Problem
The app is getting 404 errors because the database tables don't exist yet.

```
GET | 404 | https://wzjvdwgocqzgdrxjvfir.supabase.co/rest/v1/reviews
GET | 404 | https://wzjvdwgocqzgdrxjvfir.supabase.co/rest/v1/facilities
```

## Solution (2 minutes)

### Step 1: Open Supabase SQL Editor
Go to: https://supabase.com/dashboard/project/wzjvdwgocqzgdrxjvfir/sql

### Step 2: Copy the Schema
Open `supabase/schema.sql` in this project and copy ALL of its contents.

### Step 3: Run the Schema
Paste it into the SQL Editor and click **Run**.

### Step 4: Verify
Run this query to confirm:
```sql
SELECT COUNT(*) FROM public.facilities;  -- Should return 19
SELECT COUNT(*) FROM public.reviews;     -- Should return 20
```

### Step 5: Refresh the App
Reload your app. The 404 errors will be gone and the setup banner will disappear.

---

## What the Schema Does

1. ✅ Creates `profiles` table (user display names)
2. ✅ Creates `facilities` table (19 UofT locations)
3. ✅ Creates `reviews` table (20 starter reviews)
4. ✅ Enables Row Level Security (RLS) on all tables
5. ✅ Creates security policies (who can read/write what)
6. ✅ Adds database constraints (data validation)
7. ✅ Creates indexes (fast queries)
8. ✅ Seeds 19 facilities + 20 reviews
9. ✅ Creates auto-profile trigger on user signup

---

## Security Verified ✅

After running the schema:
- **RLS is enabled** — Only authenticated users can insert data
- **Public read** — Anyone can browse facilities and reviews
- **User ownership** — Users can only delete their own reviews
- **No secret key needed** — Only publishable key (safe in frontend)

See `SECURITY_AUDIT.md` for full security details.

---

## Still Getting Errors?

1. **Check your env vars** — Make sure `.env` has:
   ```
   VITE_SUPABASE_URL=https://wzjvdwgocqzgdrxjvfir.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
   ```

2. **Check Supabase project** — Make sure the project is active

3. **Check browser console** — Look for specific error messages

4. **Fallback works** — The app will use localStorage if Supabase fails, so it still works!
