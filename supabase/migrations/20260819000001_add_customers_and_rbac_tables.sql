-- ======================================================================
-- Migration: Add Customers Profile Table & Enterprise Many-to-Many RBAC
-- ======================================================================

-- 1. Create Customers Profile Table
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

-- 2. Create Roles Master Table
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create User Roles Join Table (Many-to-Many RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create Public Access RLS Policies
DO $$
BEGIN
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
