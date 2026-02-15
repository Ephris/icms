import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. Running in demo mode with sample data.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper: check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase;

// Auth helpers
export async function signUp({ email, password, fullName, phone, city }) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone, city },
      },
    });
    
    // If signup succeeds but profile creation fails, check the profile
    if (data?.user && !error) {
      // Wait a bit for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if profile was created
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (profileError && !profile) {
        // Profile wasn't created by trigger, try to create it manually
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            phone: phone,
            city: city,
          });
        
        if (insertError) {
          return { 
            data, 
            error: { 
              message: `Profile creation failed: ${insertError.message}. Please check if the profiles table exists and has the correct permissions.` 
            } 
          };
        }
      }
    }
    
    return { data, error };
  } catch (err) {
    return { 
      error: { 
        message: `Signup error: ${err.message}. Please check your database setup.` 
      } 
    };
  }
}

export async function signIn({ email, password }) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

// Product CRUD
export async function fetchProducts({ city, category, search, sort, limit = 50 }) {
  if (!supabase) return [];

  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active');

  if (city && city !== 'all') query = query.eq('city', city);
  if (category && category !== 'all') query = query.eq('category', category);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

  switch (sort) {
    case 'price-low': query = query.order('price', { ascending: true }); break;
    case 'price-high': query = query.order('price', { ascending: false }); break;
    case 'name-asc': query = query.order('title', { ascending: true }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const { data } = await query.limit(limit);
  return data || [];
}

export async function fetchProduct(id) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('products')
    .select('*, profiles(full_name, phone, city, avatar_url)')
    .eq('id', id)
    .single();

  // Increment views
  if (data) supabase.rpc('increment_views', { product_id: id });

  return data;
}

export async function createProduct(product) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  const { data, error } = await supabase.from('products').insert(product).select().single();
  return { data, error };
}

export async function uploadImage(file, userId) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };

  const ext = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) return { url: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return { url: publicUrl, error: null };
}
