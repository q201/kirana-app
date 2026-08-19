-- ======================================================================
-- Mohalla Kirana App - Supabase PostgreSQL Automated CI/CD Migration
-- ======================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  item_code TEXT NOT NULL UNIQUE,
  item_name_en TEXT NOT NULL,
  item_name_hi TEXT NOT NULL,
  name TEXT NOT NULL,
  hindi_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  keywords TEXT[] DEFAULT '{}',
  stock_qty INTEGER DEFAULT 50,
  reorder_level INTEGER DEFAULT 10,
  supplier TEXT DEFAULT 'Delhi FMCG Wholesalers',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Stores Table
CREATE TABLE IF NOT EXISTS public.stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km NUMERIC(5, 2) DEFAULT 1.5,
  rating NUMERIC(3, 2) DEFAULT 4.9,
  orders_completed INTEGER DEFAULT 1420,
  is_open BOOLEAN DEFAULT true,
  khata_accepted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  status TEXT NOT NULL,
  order_type TEXT NOT NULL,
  assigned_delivery_boy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Digital Khata Ledger Table
CREATE TABLE IF NOT EXISTS public.khata_entries (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_id TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL,
  items_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Customers Profile Table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  address TEXT NOT NULL,
  house_no TEXT NOT NULL,
  password_hash TEXT NOT NULL DEFAULT 'pass123',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Roles Master Table
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create User Roles Join Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Products') THEN
    CREATE POLICY "Public Read/Write Products" ON public.products FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Stores') THEN
    CREATE POLICY "Public Read/Write Stores" ON public.stores FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Orders') THEN
    CREATE POLICY "Public Read/Write Orders" ON public.orders FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Khata Entries') THEN
    CREATE POLICY "Public Read/Write Khata Entries" ON public.khata_entries FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Customers') THEN
    CREATE POLICY "Public Read/Write Customers" ON public.customers FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write Roles') THEN
    CREATE POLICY "Public Read/Write Roles" ON public.roles FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read/Write User Roles') THEN
    CREATE POLICY "Public Read/Write User Roles" ON public.user_roles FOR ALL USING (true);
  END IF;
END $$;

-- Seed Roles Master Data
INSERT INTO public.roles (id, name, description)
VALUES 
  ('role_customer', 'customer', 'Homemaker ordering groceries & managing Digital Khata'),
  ('role_store_owner', 'store_owner', 'Kirana Store Owner managing inventory & order fulfillment'),
  ('role_admin', 'admin', 'Platform Administrator monitoring system architecture & network revenue')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Stores & Products
INSERT INTO public.stores (id, name, owner_name, phone, address, lat, lng, radius_km, rating, orders_completed, is_open, khata_accepted)
VALUES ('store-101', 'Gupta General & Kirana Store', 'Ramakant Gupta', '+91 98123 45678', 'Shop #14, Pocket B Main Market, Sarita Vihar, New Delhi', 28.5295, 77.2915, 1.5, 4.9, 1420, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, item_code, item_name_en, item_name_hi, name, hindi_name, category, price, unit, image, in_stock, keywords, stock_qty, reorder_level, supplier)
VALUES
  ('p1', 'STAP_001', 'Wheat Atta', 'गेहूं का आटा', 'Wheat Atta', 'गेहूं का आटा', 'Staples', 37.00, '1 kg', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80', true, ARRAY['atta', 'aata', 'wheat', 'flour', 'गेहूं', 'आटा'], 42, 15, 'Delhi Flour Mills Co.'),
  ('p2', 'STAP_002', 'Basmati Rice', 'बासमती चावल', 'Basmati Rice', 'बासमती चावल', 'Staples', 110.00, '1 kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', true, ARRAY['rice', 'chawal', 'basmati', 'बासमती', 'चावल'], 7, 15, 'Haryana Basmati Traders'),
  ('p3', 'STAP_003', 'Besan', 'बेसन', 'Besan', 'बेसन', 'Staples', 82.50, '1 kg', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=500&q=80', true, ARRAY['besan', 'gram flour', 'बेसन'], 4, 10, 'Agra Gram Processors'),
  ('p4', 'PULS_001', 'Toor Dal', 'अरहर दाल', 'Toor Dal', 'अरहर दाल', 'Pulses', 150.00, '1 kg', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80', true, ARRAY['toor dal', 'arhar dal', 'dal', 'अरहर', 'दाल'], 24, 10, 'Indore Pulse Hub'),
  ('p5', 'PULS_002', 'Moong Dal', 'मूंग दाल', 'Moong Dal', 'मूंग दाल', 'Pulses', 120.00, '1 kg', 'https://images.unsplash.com/photo-1585994191611-726a8807282b?auto=format&fit=crop&w=500&q=80', true, ARRAY['moong dal', 'mung', 'dal', 'मूंग', 'दाल'], 3, 10, 'Indore Pulse Hub'),
  ('p6', 'OILS_001', 'Mustard Oil', 'सरसों का तेल', 'Mustard Oil', 'सरसों का तेल', 'Oils', 145.00, '1 litre', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80', true, ARRAY['mustard oil', 'sarso', 'sarson', 'oil', 'tel', 'सरसों', 'तेल'], 4, 12, 'Fortune Oils Agency')
ON CONFLICT (id) DO NOTHING;
