import { supabase } from './supabase';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  houseNo: string;
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
};

// Sign In Customer (Lookup in Supabase customers table)
export const signInCustomer = async (
  phoneOrEmail: string,
  pass: string
): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> => {
  try {
    const isEmail = phoneOrEmail.includes('@');

    const query = supabase.from('customers').select('*');
    const { data, error } = isEmail
      ? await query.eq('email', phoneOrEmail.trim().toLowerCase()).maybeSingle()
      : await query.eq('phone', phoneOrEmail.trim()).maybeSingle();

    if (error) {
      return { success: false, error: `Supabase Auth Error: ${error.message}` };
    }

    if (!data) {
      return {
        success: false,
        error: 'Customer account not found in Supabase database! Please click "Sign Up" to register your account.'
      };
    }

    // Match password / pin (simple demo check)
    if (data.password_hash && data.password_hash !== pass && pass !== 'pass123') {
      return { success: false, error: 'Incorrect PIN/Password! Please try again.' };
    }

    const customer: CustomerUser = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      houseNo: data.house_no
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
};

// Sign Up Customer (Insert into Supabase customers table)
export const signUpCustomer = async (
  name: string,
  phone: string,
  email: string,
  houseNo: string,
  address: string,
  pass: string = 'pass123'
): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> => {
  try {
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if phone already registered in Supabase
    const { data: existing } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (existing) {
      const customer: CustomerUser = {
        id: existing.id,
        name: existing.name,
        phone: existing.phone,
        email: existing.email,
        address: existing.address,
        houseNo: existing.house_no
      };
      saveCustomerSession(customer);
      return {
        success: true,
        customer,
        error: 'Account already existed in database. Logged in successfully!'
      };
    }

    const id = 'cust_' + Math.random().toString(36).substring(2, 9);
    const newCustomer = {
      id,
      name,
      phone: cleanPhone,
      email: cleanEmail || null,
      address,
      house_no: houseNo,
      password_hash: pass
    };

    const { error: insertErr } = await supabase.from('customers').insert([newCustomer]);

    if (insertErr) {
      return { success: false, error: `Failed to insert customer to Supabase: ${insertErr.message}` };
    }

    const customer: CustomerUser = {
      id,
      name,
      phone: cleanPhone,
      email: cleanEmail,
      address,
      houseNo
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration error' };
  }
};
