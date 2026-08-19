-- ======================================================================
-- Mohalla Kirana App - Supabase PostgreSQL Database Schema & Migration
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
  payment_method TEXT NOT NULL, -- 'khata' | 'upi' | 'cod'
  payment_status TEXT NOT NULL, -- 'pending' | 'paid' | 'added_to_khata'
  status TEXT NOT NULL, -- 'pending' | 'accepted' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled'
  order_type TEXT NOT NULL, -- 'standard' | 'voice_note' | 'photo_list' | 'subscription'
  assigned_delivery_boy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Digital Khata Ledger Table
CREATE TABLE IF NOT EXISTS public.khata_entries (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL DEFAULT 'cust_42',
  customer_name TEXT NOT NULL DEFAULT 'Sunita Sharma',
  customer_phone TEXT NOT NULL DEFAULT '+91 99887 76655',
  order_id TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL, -- 'debit' | 'credit'
  balance_after NUMERIC(10, 2) NOT NULL,
  items_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and Allow Public Read/Write for Mohalla Kirana Demo
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read/Write Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public Read/Write Stores" ON public.stores FOR ALL USING (true);
CREATE POLICY "Public Read/Write Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public Read/Write Khata Entries" ON public.khata_entries FOR ALL USING (true);

-- Seed Initial Store
INSERT INTO public.stores (id, name, owner_name, phone, address, lat, lng, radius_km, rating, orders_completed, is_open, khata_accepted)
VALUES ('store-101', 'Gupta General & Kirana Store', 'Ramakant Gupta', '+91 98123 45678', 'Shop #14, Pocket B Main Market, Sarita Vihar, New Delhi', 28.5295, 77.2915, 1.5, 4.9, 1420, true, true)
ON CONFLICT (id) DO NOTHING;
