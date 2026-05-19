# ⚡ Quick Start: Deploy to Replit (15 Minutes)

**TL;DR**: This app is ready for Replit. Follow these 5 steps.

---

## Step 1: Create Supabase Project (5 min)

1. Go to https://supabase.com
2. Sign up (free)
3. Click "New Project"
4. Choose project name and password
5. Wait ~2 minutes for setup
6. Go to **Settings → API**
7. Copy these values:
   - Project ID
   - anon public key
   - service_role key

---

## Step 2: Upload to Replit (2 min)

1. Go to https://replit.com
2. Create new Repl
3. Choose "Import from Upload"
4. Upload this entire folder
5. Replit auto-detects as Node.js project

---

## Step 3: Replace Files (1 min)

In Replit Shell, run:

```bash
# Delete Figma-specific file
rm __figma__entrypoint__.ts

# Replace with Replit versions
mv vite.config.replit.ts vite.config.ts
mv utils/supabase/info.replit.tsx utils/supabase/info.tsx
```

---

## Step 4: Set Secrets (2 min)

1. Click **Secrets** (🔒) in Replit sidebar
2. Add these 4 secrets:

```
VITE_SUPABASE_PROJECT_ID = [paste from step 1]
VITE_SUPABASE_ANON_KEY = [paste from step 1]
SUPABASE_URL = https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY = [paste from step 1]
```

---

## Step 5: Install & Run (5 min)

```bash
# Install dependencies
npm install

# Run the app
npm run dev
```

Click "Open in new tab" → Your app is live! ✅

---

## Optional: Deploy Backend (10 min)

For full functionality (auth, data persistence):

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-id

# Deploy backend
supabase functions deploy server
```

---

## ✅ Success Checklist

- [ ] App loads at Replit URL
- [ ] No errors in browser console
- [ ] Can navigate between pages
- [ ] Dark mode toggle works
- [ ] (With backend) Can sign up/login

---

## 🐛 Troubleshooting

**App won't start?**
```bash
rm -rf node_modules
npm install
```

**Supabase errors?**
- Check all 4 secrets are set
- Check for typos in secret names
- Verify project ID matches

**Need help?**
See `REPLIT_TRANSFER_AUDIT_V2.md` for detailed guide.

---

**That's it! You're done.** 🎉

The app has 130+ components, full auth system, and admin dashboard - all working on Replit.
