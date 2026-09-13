# Environment Variables & Deployment Guide

## ✅ Current Status

Your local configuration is **correct**:
- ✅ `.env` file has all required variables
- ✅ No CSP (Content Security Policy) restrictions
- ✅ `vercel.json` is properly configured
- ✅ No CSP meta tags in `index.html`

## 🔧 Required Actions

### 1. Add Environment Variables to Vercel

Your local `.env` file is correct, but **Vercel needs these variables set in its dashboard**:

#### Step-by-Step Instructions:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: `Uoft-Flow`

2. **Navigate to Environment Variables**
   - Click **Settings** (top navigation)
   - Click **Environment Variables** (left sidebar)

3. **Add These Variables** (add each one separately):

   **Variable 1:**
   ```
   Name:  VITE_SUPABASE_URL
   Value: https://wzjvdwgocqzgdrxjvfir.supabase.co
   ```
   - Select environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   ```
   Name:  VITE_SUPABASE_PUBLISHABLE_KEY
   Value: sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
   ```
   - Select environments: ✅ Production, ✅ Preview, ✅ Development

4. **Save Changes**
   - Click **Save** after adding each variable

### 2. Redeploy the Application

**Environment variables are only baked in at build time**, so you MUST redeploy:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots menu (⋮) on the right
4. Select **Redeploy**
5. Wait for deployment to complete (usually 1-2 minutes)

### 3. Verify the Deployment

After redeployment:
1. Open your deployed site
2. Open browser console (F12)
3. Check for errors
4. Verify Supabase connection is working

## 📋 Environment Variables Reference

### Required Variables

| Variable Name | Value | Purpose |
|--------------|-------|---------|
| `VITE_SUPABASE_URL` | `https://wzjvdwgocqzgdrxjvfir.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9` | Supabase anon/public key |

### Important Notes

1. **VITE_ Prefix is Required**
   - Vite only exposes environment variables prefixed with `VITE_` to the frontend
   - Without this prefix, the variable will be `undefined` in your code

2. **Publishable Key vs Anon Key**
   - These are the **same thing** with different names
   - Supabase calls it "anon key" in the dashboard
   - The code uses `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Both refer to the same key

3. **Google Maps API Key**
   - **NOT REQUIRED** for this application
   - The app only uses Google Maps links (not the API)
   - No API key needed for simple map links

4. **Secret Key**
   - **DO NOT** add `SUPABASE_SECRET_KEY` to Vercel
   - This is for server-side operations only
   - Never expose secret keys in frontend code

## 🔍 Troubleshooting

### Issue: "Environment variables not working"

**Solution:**
1. Verify variable names match exactly (case-sensitive)
2. Ensure all three environments are selected (Production, Preview, Development)
3. Redeploy after adding variables
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: "Supabase connection failed"

**Check:**
1. Environment variables are set in Vercel
2. Variable names have `VITE_` prefix
3. Values are correct (no extra spaces)
4. Deployment was triggered after adding variables

### Issue: "CSP errors in console"

**Check:**
1. No CSP meta tags in `index.html` ✅ (confirmed)
2. No CSP headers in `vercel.json` ✅ (confirmed)
3. No custom headers in Vercel dashboard

If you see CSP errors, check:
- Vercel Dashboard → Settings → Headers
- Remove any restrictive CSP headers

## 🧪 Testing Environment Variables

### Local Development

1. Ensure `.env` file exists in project root
2. Variables should be:
   ```
   VITE_SUPABASE_URL=https://wzjvdwgocqzgdrxjvfir.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_abUGDALJxY2_MCfkdgobBw_Y6mEk7u9
   ```
3. Restart dev server: `npm run dev`
4. Check browser console for any errors

### Production (Vercel)

1. Open deployed site
2. Open browser console (F12)
3. Run this in console:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   console.log(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
   ```
4. Both should show actual values (not `undefined`)

## 📁 File Structure

```
.env                    # Local environment variables (not committed to git)
.env.example           # Example file showing required variables
vercel.json            # Vercel configuration (no CSP headers)
index.html             # No CSP meta tags
```

## 🔒 Security Best Practices

1. **Never commit `.env` to git**
   - Already in `.gitignore` ✅
   - Use `.env.example` for reference

2. **Use different keys for different environments**
   - Consider creating separate Supabase projects for dev/staging/prod
   - Or use Supabase's environment-specific configurations

3. **Rotate keys periodically**
   - If keys are exposed, regenerate them in Supabase Dashboard
   - Update Vercel environment variables
   - Redeploy

## 📞 Support

If you're still having issues after following these steps:

1. **Check Vercel Build Logs**
   - Go to Deployments → Latest Deployment → View Build Logs
   - Look for environment variable warnings

2. **Check Supabase Dashboard**
   - Verify project is active
   - Check API keys are correct
   - Verify RLS policies are configured

3. **Browser Console**
   - Open F12 → Console tab
   - Look for specific error messages
   - Check Network tab for failed requests

## ✅ Checklist

Before deploying, verify:

- [ ] `.env` file exists locally with correct variables
- [ ] Variables added to Vercel dashboard
- [ ] All three environments selected (Production, Preview, Development)
- [ ] Variable names have `VITE_` prefix
- [ ] Redeploy triggered after adding variables
- [ ] No CSP headers or meta tags
- [ ] `vercel.json` only has rewrites configuration
- [ ] Browser console shows no environment variable errors
- [ ] Supabase connection working in deployed site

## 🎯 Quick Fix Summary

**If location/distance features aren't working:**

1. Add environment variables to Vercel dashboard
2. Redeploy the application
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors
5. Verify Supabase connection in deployed site

The issue is almost certainly that the environment variables haven't been added to Vercel's dashboard yet, or the deployment hasn't been refreshed after adding them.
