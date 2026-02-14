# Deployment Guide - Vercel

## Step 1: Push to GitHub

### Option A: Create Repository via GitHub Website
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it: `suuq-soomaaliyeed` (or any name you prefer)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Option B: Use GitHub CLI (if installed)
```bash
gh repo create suuq-soomaaliyeed --public --source=. --remote=origin --push
```

### Add Remote and Push
After creating the repository, run these commands:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub account)
2. Click **"Add New Project"**
3. Import your GitHub repository (`suuq-soomaaliyeed`)
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `yarn build` (or `npm run build`)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `yarn install` (or `npm install`)
5. **Add Environment Variables**:
   - Click **"Environment Variables"**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. Your app will be live at `https://your-project.vercel.app`

### Option B: Via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? suuq-soomaaliyeed
# - Directory? ./
# - Override settings? No
```

## Step 3: Post-Deployment Checklist

✅ **Verify Deployment**
- Visit your Vercel URL
- Test the homepage loads
- Test user registration
- Test product listing

✅ **Update Supabase Settings** (if needed)
- Go to Supabase Dashboard → Settings → API
- Add your Vercel domain to **Allowed Redirect URLs**:
  - `https://your-project.vercel.app`
  - `https://your-project.vercel.app/**`

✅ **Enable Production Features**
- Check Supabase Storage bucket is public
- Verify email authentication is enabled
- Test image uploads work

## Troubleshooting

**Build Fails:**
- Check environment variables are set in Vercel
- Verify `yarn build` works locally
- Check Vercel build logs

**Supabase Connection Issues:**
- Verify environment variables in Vercel dashboard
- Check Supabase project is active
- Verify RLS policies are set correctly

**Image Upload Issues:**
- Verify storage bucket exists in Supabase
- Check bucket is set to public
- Verify storage policies are correct
