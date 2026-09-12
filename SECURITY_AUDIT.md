# Security Audit — UofT Flow

## ✅ Security Checklist

### 1. API Keys
- ✅ **Publishable/Anon Key** — Exposed in frontend (`.env` with `VITE_` prefix)
  - This is **correct and safe** — the anon key is designed for client-side use
  - RLS policies protect the data, not the key
- ❌ **Secret Key** — NOT exposed in frontend
  - The secret key (`sb_secret_8EY00•••...`) is masked and should NEVER be in client code
  - Only use it in server-side code (Edge Functions, backend APIs)

### 2. Row Level Security (RLS)
- ✅ **RLS Enabled** on all tables:
  - `profiles` — ENABLE ROW LEVEL SECURITY
  - `facilities` — ENABLE ROW LEVEL SECURITY
  - `reviews` — ENABLE ROW LEVEL SECURITY
- ✅ **Force RLS** enabled (defense in depth):
  - Even table owners must pass RLS policies
- ✅ **Policies configured**:
  - `profiles`: Public read, users can only insert/update their own
  - `facilities`: Public read, authenticated users can insert
  - `reviews`: Public read, authenticated users can insert, authors can delete their own

### 3. Authentication
- ✅ **Supabase Auth** — Uses email magic link authentication
- ✅ **Auth state management** — Proper session handling with `@supabase/ssr`
- ✅ **User isolation** — Reviews track `user_id` for ownership

### 4. Data Validation
- ✅ **CHECK constraints** on database:
  - `facilities.type` — Must be 'toilet' or 'fountain'
  - `facilities.gender_designation` — Must be NULL or one of the valid options
  - `reviews.overall_rating` — Must be 1-5
  - `reviews.cleanliness_rating` — Must be 1-5
  - `reviews.condition` — Must be one of the valid options
- ✅ **Foreign key constraints**:
  - `reviews.facility_id` references `facilities.id` with CASCADE delete
  - `profiles.id` references `auth.users(id)` with CASCADE delete

### 5. Input Sanitization
- ⚠️ **Client-side validation** — Basic validation in forms
- ⚠️ **Server-side validation** — Database constraints provide backend validation
- ✅ **No SQL injection risk** — Using Supabase client (parameterized queries)

### 6. CORS
- ✅ **Supabase handles CORS** — Configured in Supabase Dashboard
- ✅ **OPTIONS preflight** — Working correctly (200 responses in logs)

### 7. Environment Variables
- ✅ **Vite prefix** — All client-side env vars use `VITE_` prefix
- ✅ **No secrets in frontend** — Only publishable key exposed

### 8. Error Handling
- ✅ **Graceful fallback** — App works without Supabase (localStorage fallback)
- ✅ **Error logging** — Console warnings for debugging
- ✅ **User feedback** — Setup banner shows when tables missing

## 🔒 Security Recommendations

### High Priority
1. **Never commit `.env` to git** — Add to `.gitignore`
2. **Rotate keys if exposed** — If secret key was ever committed, regenerate it
3. **Enable email confirmation** — In Supabase Auth settings for production

### Medium Priority
1. **Rate limiting** — Consider adding rate limits on insert operations
2. **Content moderation** — Add ability to flag/report inappropriate reviews
3. **Backup strategy** — Enable Supabase automatic backups

### Low Priority
1. **Audit logs** — Enable Supabase audit logging for compliance
2. **IP restrictions** — Restrict API access to specific IPs if needed
3. **Custom domains** — Use custom domain for Supabase API

## 🚨 Common Mistakes to Avoid

1. ❌ **Don't expose the secret key** — Only use in server-side code
2. ❌ **Don't disable RLS** — Always keep RLS enabled in production
3. ❌ **Don't use `service_role` key in frontend** — It bypasses RLS
4. ❌ **Don't trust client-side validation** — Always validate on the server (database constraints)
5. ❌ **Don't store sensitive data in localStorage** — Only use for non-sensitive fallback data

## ✅ Current Status

**Security Level: GOOD** ✅

The app follows security best practices:
- RLS properly configured
- No secret keys exposed
- Database constraints in place
- Graceful error handling
- Auth properly integrated

**Next Steps:**
1. Run `supabase/schema.sql` to create tables with RLS policies
2. Enable email confirmation in Supabase Auth settings
3. Add `.env` to `.gitignore` if not already there
4. Test the app with a real user account

## 🔍 Verification Commands

After running the schema, verify security is working:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public';

-- Test as anonymous user (should fail to insert)
-- Run this in Supabase SQL Editor with "Run as" set to "anon"
INSERT INTO public.facilities (id, type, name, building, floor_note, lat, lng, created_by)
VALUES ('test', 'toilet', 'Test', 'Test', 'Test', 0, 0, 'test');
-- Should return: ERROR: new row violates row-level security policy
```
