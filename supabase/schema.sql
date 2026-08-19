-- ======================================================================
-- Mohalla Kirana App - Supabase PostgreSQL Database Schema & Seeder
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Access Demo
CREATE POLICY "Public Read/Write Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public Read/Write Stores" ON public.stores FOR ALL USING (true);
CREATE POLICY "Public Read/Write Orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public Read/Write Khata Entries" ON public.khata_entries FOR ALL USING (true);
CREATE POLICY "Public Read/Write Customers" ON public.customers FOR ALL USING (true);

-- ======================================================================
-- SEED DATA - STORES & PRODUCTS
-- ======================================================================

INSERT INTO public.stores (id, name, owner_name, phone, address, lat, lng, radius_km, rating, orders_completed, is_open, khata_accepted)
VALUES 
  ('store-101', 'Gupta General & Kirana Store', 'Ramakant Gupta', '+91 98123 45678', 'Shop #14, Pocket B Main Market, Sarita Vihar, New Delhi', 28.5295, 77.2915, 1.5, 4.9, 1420, true, true),
  ('store-102', 'Sharma Provision & Daily Needs', 'Mahesh Sharma', '+91 98765 43210', 'Block C Market, Sarita Vihar, New Delhi', 28.5310, 77.2940, 1.5, 4.7, 980, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, item_code, item_name_en, item_name_hi, name, hindi_name, category, price, unit, image, in_stock, keywords, stock_qty, reorder_level, supplier)
VALUES
  ('p1', 'STAP_001', 'Wheat Atta', 'गेहूं का आटा', 'Wheat Atta', 'गेहूं का आटा', 'Staples', 37.00, '1 kg', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80', true, ARRAY['atta', 'aata', 'wheat', 'flour', 'गेहूं', 'आटा'], 42, 15, 'Delhi Flour Mills Co.'),
  ('p2', 'STAP_002', 'Basmati Rice', 'बासमती चावल', 'Basmati Rice', 'बासमती चावल', 'Staples', 110.00, '1 kg', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', true, ARRAY['rice', 'chawal', 'basmati', 'बासमती', 'चावल'], 7, 15, 'Haryana Basmati Traders'),
  ('p3', 'STAP_003', 'Besan', 'बेसन', 'Besan', 'बेसन', 'Staples', 82.50, '1 kg', 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=500&q=80', true, ARRAY['besan', 'gram flour', 'बेसन'], 4, 10, 'Agra Gram Processors'),
  ('p4', 'PULS_001', 'Toor Dal', 'अरहर दाल', 'Toor Dal', 'अरहर दाल', 'Pulses', 150.00, '1 kg', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80', true, ARRAY['toor dal', 'arhar dal', 'dal', 'अरहर', 'दाल'], 24, 10, 'Indore Pulse Hub'),
  ('p5', 'PULS_002', 'Moong Dal', 'मूंग दाल', 'Moong Dal', 'मूंग दाल', 'Pulses', 120.00, '1 kg', 'https://images.unsplash.com/photo-1585994191611-726a8807282b?auto=format&fit=crop&w=500&q=80', true, ARRAY['moong dal', 'mung', 'dal', 'मूंग', 'दाल'], 3, 10, 'Indore Pulse Hub'),
  ('p6', 'OILS_001', 'Mustard Oil', 'सरसों का तेल', 'Mustard Oil', 'सरसों का तेल', 'Oils', 145.00, '1 litre', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80', true, ARRAY['mustard oil', 'sarso', 'sarson', 'oil', 'tel', 'सरसों', 'तेल'], 4, 12, 'Fortune Oils Agency'),
  ('p7', 'OILS_002', 'Sugar', 'चीनी', 'Sugar', 'चीनी', 'Oils/Sweeteners', 42.00, '1 kg', 'https://images.unsplash.com/photo-1622484210800-244439fa5a25?auto=format&fit=crop&w=500&q=80', true, ARRAY['sugar', 'cheeni', 'chini', 'चीनी'], 38, 15, 'Mawana Sugar Works'),
  ('p8', 'SPIC_001', 'Iodized Salt', 'नमक', 'Iodized Salt', 'नमक', 'Spices', 24.00, '1 kg', 'https://images.unsplash.com/photo-1518110165403-10029b4703a5?auto=format&fit=crop&w=500&q=80', true, ARRAY['salt', 'namak', 'iodized salt', 'नमक'], 55, 15, 'Tata Salt Distributors'),
  ('p9', 'SPIC_002', 'Turmeric Powder', 'हल्दी पाउडर', 'Turmeric Powder', 'हल्दी पाउडर', 'Spices', 20.00, '100g', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80', true, ARRAY['turmeric', 'haldi', 'haldi powder', 'हल्दी'], 2, 10, 'Everest Spices Ltd'),
  ('p10', 'BEVR_001', 'Tea Leaves', 'चाय पत्ती', 'Tea Leaves', 'चाय पत्ती', 'Beverages', 325.00, '1 kg', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80', true, ARRAY['tea', 'chai', 'chai patti', 'tea leaves', 'चाय'], 18, 8, 'Assam Tea Agency'),
  ('p11', 'SNAC_001', 'Parle-G Biscuit', 'पार्ले-जी बिस्कुट', 'Parle-G Biscuit', 'पार्ले-जी बिस्कुट', 'Snacks', 10.00, 'pack', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80', true, ARRAY['parle-g', 'biscuit', 'parle', 'बिस्कुट'], 65, 20, 'Parle Products Hub'),
  ('p12', 'PERS_001', 'Bath Soap', 'नहाने का साबुन', 'Bath Soap', 'नहाने का साबुन', 'Personal Care', 35.00, 'piece', 'https://images.unsplash.com/photo-1607006482602-765180037159?auto=format&fit=crop&w=500&q=80', true, ARRAY['soap', 'sabun', 'bath soap', 'साबुन'], 22, 10, 'Hindustan Unilever Depot'),
  ('p13', 'CLEA_001', 'Washing Powder', 'सर्फ पाउडर', 'Washing Powder', 'सर्फ पाउडर', 'Cleaning', 105.00, '1 kg', 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=500&q=80', true, ARRAY['washing powder', 'surf', 'detergent', 'सर्फ'], 15, 8, 'Surf Excel Agency')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Orders
INSERT INTO public.orders (id, idempotency_key, customer_name, customer_phone, address, items, total_amount, payment_method, payment_status, status, order_type, assigned_delivery_boy)
VALUES
  (
    'ORD-9841', 
    'idemp_key_initial_01', 
    'Sunita Sharma', 
    '+91 99887 76655', 
    'House #42, Lane 3, Pocket B, Sarita Vihar', 
    '[{"productId": "p1", "productName": "Wheat Atta", "price": 37, "quantity": 5, "unit": "5 kg"}, {"productId": "p6", "productName": "Mustard Oil", "price": 145, "quantity": 1, "unit": "1 litre"}]'::jsonb, 
    330.00, 
    'khata', 
    'added_to_khata', 
    'accepted', 
    'voice_note', 
    'db-1'
  )
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Khata Entries
INSERT INTO public.khata_entries (id, customer_id, customer_name, customer_phone, date, description, amount, type, balance_after, items_summary)
VALUES
  ('kh-101', 'cust_42', 'Sunita Sharma', '+91 99887 76655', CURRENT_DATE - INTERVAL '2 days', 'VOICE NOTE Order (ORD-9841)', 330.00, 'debit', 330.00, 'Wheat Atta x5, Mustard Oil x1'),
  ('kh-102', 'cust_42', 'Sunita Sharma', '+91 99887 76655', CURRENT_DATE - INTERVAL '1 days', 'UPI Bill Settlement Payment', 100.00, 'credit', 230.00, 'Khata Partial Payment via UPI')
ON CONFLICT (id) DO NOTHING;
