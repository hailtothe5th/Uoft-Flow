# Quick Fix: Environment Variables

## 🎯 The Problem

Your local `.env` file is correct, but **Vercel doesn't automatically use your local `.env` file**. You need to add the environment variables directly in Vercel's dashboard.

## ⚡ Quick Fix (5 Minutes)

### Step 1: Add Variables to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project: **Uoft-Flow**
3. Click **Settings** → **Environment Variables**
4. Add these two variables:

**Variable 1:**
```
Name:  VITE_SUPABASE_URL
Value: https://wzjvdwgocqzgdrxjvfir.supabase.co
Environments: Production ✅ Preview ✅ Development ✅
```

**Variable 2:**
```
Name:  VITE_SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
Environments: Production ✅ Preview ✅ Development ✅
```

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click ⋮ on the latest deployment
3. Select **Redeploy**
4. Wait 1-2 minutes

### Step 3: Verify

1. Open your deployed site
2. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
3. Open browser console (F12)
4. Check for errors

## 🔍 Why This Happens

- **Local development:** Uses your `.env` file
- **Vercel deployment:** Uses environment variables from Vercel dashboard
- **They are separate!** Changes to `.env` don't automatically sync to Vercel

## 📋 Variable Names Matter

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `SUPABASE_URL` | `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `VITE_SUPABASE_KEY` | `VITE_SUPABASE_PUBLISHABLE_KEY` |

**The `VITE_` prefix is required!** Vite only exposes variables with this prefix to the frontend.

## 🧪 Test It Works

After redeploying, open browser console and run:

```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
```

**Expected output:**
```
https://wzjvdwgocqzgdrxjvfir.supabase.co
sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
```

**If you see `undefined`:**
- Variables weren't added correctly
- Variable names are wrong
- Deployment wasn't refreshed

## 🚨 Common Mistakes

1. ❌ Forgot to add `VITE_` prefix
2. ❌ Only added to Production, not Preview/Development
3. ❌ Added spaces before/after the value
4. ❌ Didn't redeploy after adding variables
5. ❌ Used wrong variable name (e.g., `VITE_SUPABASE_KEY` instead of `VITE_SUPABASE_PUBLISHABLE_KEY`)

## ✅ Verification Checklist

- [ ] Variables added to Vercel dashboard
- [ ] All three environments selected
- [ ] Variable names have `VITE_` prefix
- [ ] No extra spaces in values
- [ ] Redeploy triggered
- [ ] Hard refresh performed
- [ ] Console shows correct values (not `undefined`)
- [ ] No errors in browser console

## 🆘 Still Not Working?

1. **Check Vercel Build Logs**
   - Deployments → Latest → View Build Logs
   - Look for environment variable warnings

2. **Verify in Supabase**
   - Dashboard → Settings → API
   - Confirm URL and anon key match

3. **Clear Everything**
   - Clear browser cache
   - Clear site data (F12 → Application → Clear storage)
   - Hard refresh

## 📞 Need Help?

If you've followed all steps and it's still not working:

1. Screenshot your Vercel Environment Variables page
2. Screenshot the browser console errors
3. Check if the variables show as `undefined` in console

The most common issue is that the variables haven't been added to Vercel's dashboard yet, or the deployment hasn't been refreshed.
