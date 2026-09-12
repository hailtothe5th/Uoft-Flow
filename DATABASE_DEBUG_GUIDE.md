# 🔧 Database Debugging Guide

## Quick Debug Tool

I've added a debug page at `/debug` that will help identify exactly what's wrong with your database connection.

### How to Use the Debug Tool

1. **Navigate to the debug page:**
   - Go to: `http://localhost:5173/debug` (or your deployed URL + `/debug`)

2. **Click "Run Database Test"**
   - This will check:
     - ✅ Your authentication status
     - ✅ Supabase session
     - ✅ If tables exist
     - ✅ If you can insert data
     - ✅ RLS policies

3. **Read the results**
   - The tool will show you exactly what's working and what's not
   - Look for ❌ errors to identify the problem

---

## Common Issues & Solutions

### Issue 1: "No active session"
**Symptom:** Debug tool shows "Supabase Session: None"

**Solution:**
1. Sign out completely
2. Clear browser storage (F12 → Application → Clear storage)
3. Sign in again
4. Try the debug tool again

---

### Issue 2: "Facilities table error" or "Reviews table error"
**Symptom:** Debug tool shows tables don't exist

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the complete schema: `supabase/complete_setup_with_seed_data.sql`
3. Wait for it to complete
4. Refresh the debug page and test again

---

### Issue 3: "Permission denied" or "violates row-level security"
**Symptom:** Tables exist but you can't insert data

**Solution:**
This means RLS policies are blocking you. Run this SQL in Supabase:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.facilities;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON public.reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only"
ON public.facilities FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);
```

---

### Issue 4: "Invalid credentials" when signing in
**Symptom:** Can't sign in even with correct password

**Solution:**
1. Check if email confirmation is required:
   - Go to Supabase Dashboard → Authentication → Providers → Email
   - Check "Confirm email" setting
   
2. If enabled, you must confirm your email before signing in
   - Check your email for a confirmation link
   - Click the link to verify your account
   
3. To disable email confirmation (for testing):
   - Go to Authentication → Providers → Email
   - Uncheck "Confirm email"
   - Save changes

---

### Issue 5: Data saves locally but not to Supabase
**Symptom:** Reviews appear in app but not in database

**Solution:**
1. Open browser console (F12)
2. Try adding a review
3. Look for these messages:
   - `💾 Saving review to Supabase...` - Starting save
   - `✅ Review saved to Supabase successfully` - Success!
   - `❌ Failed to save review to Supabase` - Error (check the message)

4. If you see an error, copy the full message and check what it means:
   - `duplicate key` → Review already exists
   - `violates row-level security` → RLS policy issue
   - `relation does not exist` → Tables not created

---

## Step-by-Step Debugging Process

### Step 1: Verify Authentication
1. Sign up for a new account (or sign in)
2. Go to `/debug`
3. Check that it shows:
   - ✅ User: your@email.com
   - ✅ Is Authenticated: true
   - ✅ Supabase Session: Active

### Step 2: Verify Tables Exist
1. In the debug tool, look for:
   - ✅ Facilities table exists
   - ✅ Reviews table exists

2. If not, run the schema SQL in Supabase

### Step 3: Test Insert
1. The debug tool will automatically try to insert a test review
2. Look for:
   - ✅ Insert successful!
   - OR ❌ Insert failed: [error message]

3. If it fails, the error message will tell you exactly what's wrong

### Step 4: Check RLS Policies
1. The debug tool will list all policies
2. You should see policies for:
   - reviews (SELECT, INSERT, DELETE)
   - facilities (SELECT, INSERT)
   - profiles (SELECT, INSERT, UPDATE)

3. If policies are missing, run the schema SQL again

---

## Browser Console Debugging

Open the browser console (F12) and look for these messages when adding a review:

### Success Flow:
```
🔍 addReview called with: {id: "review-123", ...}
🔍 User object: {id: "user-456", email: "...", ...}
🔍 isAuthenticated: true
🔍 Supabase session: {...}
🔍 Supabase user: {id: "user-456", ...}
💾 Saving review to Supabase...
💾 Data being sent: {id: "review-123", ...}
💾 Supabase response - data: [...]
💾 Supabase response - error: null
✅ Review saved to Supabase successfully!
```

### Error Flow:
```
🔍 addReview called with: {id: "review-123", ...}
🔍 User object: null
🔍 isAuthenticated: false
❌ No active Supabase session. Please sign in again.
```

OR

```
💾 Saving review to Supabase...
💾 Supabase response - error: {message: "new row violates row-level security policy", code: "42501"}
❌ Failed to save review to Supabase: new row violates row-level security policy
```

---

## Quick Fix Checklist

If data isn't saving to the database, check these in order:

- [ ] **Are you signed in?**
  - Check the header shows your name
  - Go to `/debug` and verify session is active

- [ ] **Do tables exist?**
  - Run debug tool
  - If not, run `supabase/complete_setup_with_seed_data.sql`

- [ ] **Are RLS policies correct?**
  - Run debug tool
  - If policies missing, run the policy SQL above

- [ ] **Is email confirmation required?**
  - Check Supabase Authentication settings
  - Confirm your email or disable confirmation

- [ ] **Check browser console**
  - Open F12
  - Look for error messages
  - Copy the full error and check what it means

---

## Still Not Working?

If you've tried all of the above and it's still not working:

1. **Run the debug tool** at `/debug`
2. **Copy the full output** (all the logs)
3. **Check browser console** (F12) for any errors
4. **Verify in Supabase Dashboard:**
   - Go to Table Editor
   - Check if `reviews` table has any new rows
   - Check Authentication → Users to see if your user exists

5. **Common gotchas:**
   - Make sure you're using the correct Supabase URL and key in `.env`
   - Make sure you've run the schema SQL (not just created tables manually)
   - Make sure RLS is enabled on all tables
   - Make sure you're actually authenticated (not just signed in locally)

---

## Expected Behavior

Once everything is working:

1. **Sign up/Sign in** → Should create a session
2. **Add a review** → Should:
   - Show "💾 Saving review to Supabase..." in console
   - Show "✅ Review saved to Supabase successfully" in console
   - Appear in Supabase Table Editor → reviews table
   - Persist after page refresh
   - Be visible to other users

3. **Debug tool** → Should show:
   - ✅ Active session
   - ✅ Tables exist
   - ✅ Insert successful
   - ✅ All policies present

---

## Need Help?

If you're still stuck, provide:
1. Screenshot of the debug tool output
2. Browser console logs (F12 → Console)
3. Any error messages you see
4. Whether you can see the data in Supabase Table Editor

This will help identify exactly where the problem is!
