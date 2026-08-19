import { supabase } from './supabase';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  houseNo: string;
  role: 'customer' | 'store_owner' | 'admin';
}

const STORAGE_KEY = 'mohalla_active_customer_session';

export const getStoredCustomerSession = (): CustomerUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to parse customer session:', err);
    return null;
  }
};

export const saveCustomerSession = (customer: CustomerUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customer));
};

export const clearCustomerSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  supabase.auth.signOut().catch(() => {});
};

/**
 * Sign In using Supabase Native Auth (auth.users schema)
 */
export const signInCustomer = async (
  phoneOrEmail: string,
  pass: string
): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> => {
  try {
    const cleanInput = phoneOrEmail.trim();
    const formattedEmail = cleanInput.includes('@')
      ? cleanInput.toLowerCase()
      : `${cleanInput.replace(/[^0-9]/g, '')}@mohallakirana.local`;

    // 1. Authenticate with Supabase Auth Engine (auth.users)
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: formattedEmail,
      password: pass
    });

    if (authErr || !authData?.user) {
      // Check if user is not found in auth.users
      if (authErr?.message.includes('Invalid login credentials') || authErr?.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'User not found in Supabase auth.users! Please click "Sign Up" tab to register.'
        };
      }
      return { success: false, error: authErr?.message || 'Supabase Auth login failed' };
    }

    const user = authData.user;
    const meta = user.user_metadata || {};

    const customer: CustomerUser = {
      id: user.id,
      name: meta.name || user.email?.split('@')[0] || 'Customer Account',
      phone: meta.phone || cleanInput,
      email: user.email,
      address: meta.address || 'Sarita Vihar, Pocket B',
      houseNo: meta.house_no || 'House #42',
      role: meta.role || 'customer'
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
};

/**
 * Sign Up using Supabase Native Auth (auth.users schema with user_metadata)
 */
export const signUpCustomer = async (
  name: string,
  phone: string,
  email: string,
  houseNo: string,
  address: string,
  pass: string = 'pass123',
  role: 'customer' | 'store_owner' | 'admin' = 'customer'
): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> => {
  try {
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim()
      ? email.trim().toLowerCase()
      : `${cleanPhone.replace(/[^0-9]/g, '')}@mohallakirana.local`;

    // 1. Create User in Supabase Auth (auth.users table)
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: cleanEmail,
      password: pass,
      options: {
        data: {
          name,
          phone: cleanPhone,
          house_no: houseNo,
          address,
          role
        }
      }
    });

    if (authErr) {
      // If user already registered in auth.users, try signing in!
      if (authErr.message.includes('already registered')) {
        return signInCustomer(cleanEmail, pass);
      }
      return { success: false, error: `Supabase Auth Sign Up Error: ${authErr.message}` };
    }

    const user = authData.user;
    const customer: CustomerUser = {
      id: user?.id || 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      phone: cleanPhone,
      email: cleanEmail,
      address,
      houseNo,
      role
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration error' };
  }
};
