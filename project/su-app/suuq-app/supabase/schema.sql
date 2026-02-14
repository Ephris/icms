-- ==========================================================================
-- Suuq Soomaaliyeed — Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ==========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- PROFILES — extends Supabase auth.users
-- -------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- -------------------------------------------------------------------------
-- PRODUCTS — main listings table
-- -------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'USD',
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    seller_name TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read active products
CREATE POLICY "Active products are viewable by everyone"
    ON products FOR SELECT USING (status = 'active');

-- Authenticated users can insert products
CREATE POLICY "Authenticated users can create products"
    ON products FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
    ON products FOR UPDATE USING (auth.uid() = seller_id);

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
    ON products FOR DELETE USING (auth.uid() = seller_id);

-- -------------------------------------------------------------------------
-- STORAGE — product images bucket
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view product images
CREATE POLICY "Product images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Users can delete their own uploaded images
CREATE POLICY "Users can delete own product images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- -------------------------------------------------------------------------
-- FUNCTION — auto-create profile on signup
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, phone, city)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'city', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- -------------------------------------------------------------------------
-- FUNCTION — increment view count
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE products SET views_count = views_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
