# CSP Investigation Report

## 🔍 Investigation Complete

After thoroughly searching the entire repository, I can confirm:

## ✅ NO CSP Found in Repository

### Files Checked:
1. ✅ **vercel.json** - Only contains routing rewrites, NO CSP headers
2. ✅ **index.html** - NO CSP meta tags
3. ✅ **vite.config.js** - NO CSP configuration
4. ✅ **All source files** - NO CSP directives anywhere
5. ✅ **No _headers file** - Vercel-specific headers file doesn't exist
6. ✅ **No _redirects file** - No redirect configuration

### Search Results:
- Searched for `Content-Security-Policy` - Only found in node_modules and documentation
- Searched for `script-src` - Only found in node_modules
- Searched for `unsafe-eval` - Only found in node_modules
- Searched for `eval(` and `new Function` - Only found in node_modules

## 🎯 Conclusion

**The CSP is NOT coming from your repository.**

The CSP error you're seeing must be coming from one of these sources:

### 1. Vercel Project Settings (Most Likely)
The CSP is likely configured in your Vercel project dashboard:
- Go to: https://vercel.com/dashboard
- Select your project: **Uoft-Flow**
- Click **Settings** → **Headers**
- Look for any Content-Security-Policy headers
- If found, either:
  - Remove the CSP header entirely, OR
  - Add `'unsafe-eval'` to the `script-src` directive

### 2. Browser Extension
Some browser extensions inject CSP headers:
- Try opening the site in incognito/private mode
- Disable browser extensions temporarily
- Try a different browser

### 3. Network/Corporate Proxy
If you're on a corporate network:
- Corporate proxies sometimes inject CSP headers
- Try accessing from a different network

## 🔧 How to Fix

### Option 1: Check Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Headers**
4. Look for any headers with `Content-Security-Policy`
5. If found:
   - **Remove it entirely** (simplest), OR
   - **Edit it** to add `'unsafe-eval'` to `script-src`:
     ```
     Content-Security-Policy: script-src 'self' 'unsafe-eval' https:; ...
     ```
6. Save changes
7. Redeploy

### Option 2: Add Headers to vercel.json

If you want to explicitly allow eval (not recommended unless necessary):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; default-src 'self'; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://*.supabase.co;"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Option 3: Check Browser

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for the exact CSP error message
4. It will tell you which directive is blocking what
5. Share the exact error message for more specific help

## 🧪 Diagnostic Steps

### Step 1: Check Response Headers

1. Open your deployed site
2. Open DevTools (F12)
3. Go to **Network** tab
4. Refresh the page
5. Click on the first request (usually your domain)
6. Look at **Response Headers**
7. Look for `Content-Security-Policy` header
8. If it exists, that's your CSP source

### Step 2: Check Vercel Deployment

1. Go to Vercel Dashboard
2. Click on the latest deployment
3. Click **View Deployment**
4. Open DevTools on the deployed site
5. Check response headers as above

### Step 3: Test Locally

1. Run `npm run dev` locally
2. Check if you see the same CSP error
3. If NO error locally but error on Vercel → CSP is in Vercel settings
4. If error locally too → Check browser extensions

## 📋 Summary

| Location | CSP Found? | Action Required |
|----------|-----------|-----------------|
| Repository (vercel.json) | ❌ No | None |
| Repository (index.html) | ❌ No | None |
| Repository (source files) | ❌ No | None |
| Repository (_headers file) | ❌ No | None |
| Vercel Dashboard Settings | ⚠️ Unknown | **Check here** |
| Browser Extensions | ⚠️ Unknown | Test in incognito |

## 🎯 Next Steps

1. **Check Vercel Dashboard** → Settings → Headers
2. **Check browser response headers** in DevTools
3. **Test in incognito mode** to rule out extensions
4. **Share the exact CSP error message** from console

The CSP is definitely NOT in your repository. It's being injected somewhere else, most likely in the Vercel project settings.

## 🔍 What to Look For

In Vercel Dashboard → Settings → Headers, look for:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; ...
```

Or similar. If you find it:
- Either delete it entirely
- Or modify it to include `'unsafe-eval'` in `script-src`

## 📞 Need Help?

If you still can't find the CSP source:
1. Share a screenshot of Vercel Dashboard → Settings → Headers
2. Share the exact CSP error message from browser console
3. Share the response headers from DevTools → Network tab

This will help identify exactly where the CSP is coming from.
