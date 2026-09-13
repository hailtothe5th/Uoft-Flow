# Account Creation Fix Guide

## Problem
When creating a new account, the system doesn't let you save info without authentication, and even after authenticating, it still doesn't save the info.

## Root Cause
The `profiles` table in Supabase might not exist or has incorrect Row Level Security (RLS) policies that prevent profile creation.

## Solution

### Step 1: Run the Profiles Table Migration

Go to your **Supabase SQL Editor** and run this SQL:

```sql
-- Ensure profiles table exists with correct structure and RLS policies

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;

-- Create policies
-- Users can read all profiles (for displaying names)
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### Step 2: Verify the Table

Run this query to verify the table exists:

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

You should see:
- `id` (UUID, NOT NULL)
- `email` (TEXT, nullable)
- `display_name` (TEXT, NOT NULL)
- `created_at` (TIMESTAMPTZ, nullable)
- `updated_at` (TIMESTAMPTZ, nullable)

### Step 3: Test Account Creation

1. Go to `/signup`
2. Fill in the form with:
   - Display Name: Your name
   - Email: Your email
   - Password: At least 6 characters
   - Confirm Password: Same as password
3. Click "Create Account"

### Step 4: Check Browser Console

Open browser DevTools (F12) and check the console for these logs:

```
📝 Starting signup for: your@email.com
✅ Signup successful, checking session...
📧 Email confirmation required for: your@email.com
```

OR if email confirmation is disabled:

```
📝 Starting signup for: your@email.com
✅ Signup successful, checking session...
✅ Session exists, creating profile...
✅ Profile created successfully
✅ User set in context: {id: "...", email: "...", displayName: "..."}
```

## What Changed

### Code Improvements

1. **AuthContext.tsx** - Added comprehensive logging:
   - Logs signup start
   - Logs session check
   - Logs profile creation with error handling
   - Logs user context update

2. **Signup.tsx** - Better user feedback:
   - Shows success message when email confirmation is required
   - Redirects to login page after 3 seconds
   - Clear error messages for common issues

3. **Database Schema** - Ensured profiles table exists with:
   - Correct RLS policies
   - Proper foreign key relationship to auth.users
   - Policies allow users to read all profiles but only modify their own

## Troubleshooting

### Issue: Profile creation error in console

If you see:
```
⚠️ Profile creation error (non-critical): {message: "..."}
```

**Solution:**
1. Check that the profiles table exists (Step 2)
2. Verify RLS policies are correct
3. Make sure you're authenticated

### Issue: Can't sign up at all

If signup fails immediately:

1. Check browser console for errors
2. Verify Supabase connection in `/debug` page
3. Check that email confirmation settings are correct in Supabase:
   - Go to Authentication → Providers → Email
   - Check "Confirm email" setting

### Issue: Account created but can't sign in

1. Check your email for confirmation link (if email confirmation is enabled)
2. Click the confirmation link
4. Try signing in again

## Email Confirmation Settings

By default, Supabase requires email confirmation. You have two options:

### Option A: Keep Email Confirmation (Recommended for Production)
- Users must verify their email before signing in
- More secure
- Prevents fake accounts

### Option B: Disable Email Confirmation (Easier for Testing)
1. Go to Supabase Dashboard → Authentication → Providers → Email
3. Uncheck "Confirm email"
3. Save changes
4. Now users can sign in immediately after signup

## Expected Behavior

### With Email Confirmation Enabled:
1. User fills signup form
6. User clicks "Create Account"
8. System creates account
4. System shows: "Account created! Please check your email to confirm your account, then sign in."
5. User checks email and clicks confirmation link
6. User goes to `/login` and signs in
7. Profile is created automatically on first login

### With Email Confirmation Disabled:
1. User fills signup form
2. User clicks "Create Account"
3. System creates account and profile immediately
4. User is redirected to home page
5. User is signed in automatically

## Files Modified

1. **`src/context/AuthContext.tsx`**
   - Added comprehensive logging to signUp function
   - Added error handling for profile creation
   - Non-critical errors don't block signup

2. **`src/pages/Signup.tsx`**
   - Better success message for email confirmation
   - Auto-redirect to login after 3 seconds

3. **`supabase/ensure_profiles_table.sql`**
   - SQL migration to ensure profiles table exists
   - Correct RLS policies

## Next Steps

1. ✅ Run the SQL migration (Step 1)
2. ✅ Test account creation (Step 3)
3. ✅ Check browser console for logs (Step 4)
4. ✅ Verify profile was created in Supabase:
   ```sql
   SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
   ```

## Support

If you're still having issues after following these steps:

1. Check browser console (F12) for detailed error messages
2. Run the `/debug` page to test database connection
3. Check Supabase logs in the dashboard
4. Verify all SQL migrations have been run

The account creation should now work smoothly with proper error handling and user feedback!
