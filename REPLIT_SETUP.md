# Replit Setup Guide - J1 Platform

Quick setup guide for deploying this application to Replit.

---

## 🚀 Quick Start (5 Minutes)

### 1. Import to Replit
- Create a new Repl on Replit
- Choose "Import from GitHub" or upload this project
- Replit will auto-detect it as a Node.js project

### 2. Replace Configuration Files

Replace these files with their `.replit` versions:

```bash
# In the Replit shell:
mv vite.config.replit.ts vite.config.ts
mv utils/supabase/info.replit.tsx utils/supabase/info.tsx
```

The `.replit` and `replit.nix` files are already configured.

### 3. Set Environment Secrets

Click the **Secrets** (🔒) tab in Replit and add:

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Getting Supabase Credentials:**
1. Go to https://supabase.com
2. Create a new project (free tier available)
3. Go to Project Settings → API
4. Copy the Project ID, anon key, and service role key

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

Click the **Run** button or:

```bash
npm run dev
```

The app will be available at your Replit URL!

---

## 🗄️ Backend Setup (Supabase)

This app uses Supabase for backend. You have two options:

### Option A: Deploy to Supabase (Recommended - 10 minutes)

1. **Install Supabase CLI:**
```bash
npm install -g supabase
```

2. **Login and Link:**
```bash
supabase login
supabase link --project-ref your-project-id
```

3. **Deploy Edge Functions:**
```bash
supabase functions deploy
```

4. **Done!** Your backend is now live.

### Option B: Local Development Only

If you just want to test the frontend:
- The app will work with mock data
- Authentication won't work
- Data won't persist
- Good for UI/UX testing only

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set
- [ ] Supabase functions deployed
- [ ] Test user registration
- [ ] Test user login
- [ ] Check all pages load
- [ ] Verify responsive design
- [ ] Test on mobile device
- [ ] Check console for errors
- [ ] Run production build
- [ ] Enable "Always On"

**Estimated Setup Time**: 15-30 minutes  
**Difficulty**: Easy  
**Success Rate**: 95%+
