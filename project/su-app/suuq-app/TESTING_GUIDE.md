# Database Testing Guide

## Quick Test (Automated)

Run the automated test script:

```bash
yarn test:db
```

This will check:
- ✅ Supabase connection
- ✅ Database tables exist (profiles, products)
- ✅ Storage bucket exists (product-images)
- ✅ Row Level Security policies
- ✅ Database functions

## Manual Testing Steps

### 1. Start Development Server

```bash
yarn dev
```

Open http://localhost:3000

### 2. Test User Registration

1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - First Name: Test
   - Last Name: User
   - Phone: +252 61 123 4567
   - Email: test@example.com
   - City: Mogadishu
   - Password: test123
   - Confirm Password: test123
3. Click "Create Account"
4. ✅ **Expected**: Success message, redirected to post page

**Verify in Supabase:**
- Go to Supabase Dashboard → Authentication → Users
- You should see the new user
- Go to Table Editor → profiles
- You should see a profile record for the user

### 3. Test User Login

1. Go to http://localhost:3000/login
2. Enter:
   - Email: test@example.com
   - Password: test123
3. Click "Sign In"
4. ✅ **Expected**: Logged in, redirected to homepage

### 4. Test Product Creation

1. Make sure you're logged in
2. Go to http://localhost:3000/post
3. Fill in the form:
   - Product Title: Test Product
   - Category: Electronics
   - City: Mogadishu
   - Price: 100
   - Phone: +252 61 123 4567
   - Description: This is a test product
   - Your Name: Test User
4. (Optional) Upload an image
5. Click "Post Product — It's Free"
6. ✅ **Expected**: Success message, product created

**Verify in Supabase:**
- Go to Table Editor → products
- You should see the new product with status "active"
- Check that seller_id matches your user ID

### 5. Test Product Display

1. Go to http://localhost:3000
2. ✅ **Expected**: Your test product appears on the homepage
3. Click on the product
4. ✅ **Expected**: Product detail page shows all information
5. Check browser console (F12) for any errors

### 6. Test Product Filtering

1. On homepage, try:
   - Filter by city (select "Mogadishu")
   - Filter by category (select "Electronics")
   - Search for "Test"
2. ✅ **Expected**: Products filter correctly

### 7. Test Image Upload (Optional)

1. Go to http://localhost:3000/post
2. Upload an image when creating a product
3. ✅ **Expected**: Image uploads successfully
4. Check Supabase Storage:
   - Go to Storage → product-images
   - You should see the uploaded image

**Verify in Supabase:**
- Go to Storage → product-images
- Check that images are uploaded
- Verify images are publicly accessible

## Common Issues & Solutions

### ❌ "Missing Supabase environment variables"
**Solution:** Make sure `.env.local` exists with:
```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### ❌ "relation 'profiles' does not exist"
**Solution:** Run `supabase/schema.sql` in Supabase SQL Editor

### ❌ "Cannot read products" or RLS error
**Solution:** Check Row Level Security policies in Supabase:
- Go to Table Editor → products → Policies
- Verify policies are set correctly

### ❌ Image upload fails
**Solution:** 
1. Check storage bucket exists: Storage → product-images
2. Verify bucket is set to Public
3. Check storage policies allow uploads

### ❌ User registration creates user but no profile
**Solution:** Check the trigger function:
- Go to Database → Functions → handle_new_user
- Verify it exists and is enabled

## Verification Checklist

Before pushing to GitHub, verify:

- [ ] ✅ Automated test passes (`yarn test:db`)
- [ ] ✅ Can register new user
- [ ] ✅ Can login with registered user
- [ ] ✅ Can create product
- [ ] ✅ Product appears on homepage
- [ ] ✅ Can view product details
- [ ] ✅ Filters work (city, category, search)
- [ ] ✅ Image upload works (if tested)
- [ ] ✅ No console errors in browser
- [ ] ✅ No errors in terminal

## Next Steps After Testing

Once all tests pass:

1. ✅ Commit your changes:
   ```bash
   git add .
   git commit -m "Add database testing and verification"
   ```

2. ✅ Push to GitHub (see DEPLOYMENT.md)

3. ✅ Deploy to Vercel (see DEPLOYMENT.md)
