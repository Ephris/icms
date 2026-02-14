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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, city },
    },
  });
  return { data, error };
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
