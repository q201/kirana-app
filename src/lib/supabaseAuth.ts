import { supabase } from './supabase';

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  houseNo: string;
  roles: string[]; // Many-to-Many roles from user_roles join table
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
 * Fetch assigned roles from user_roles JOIN table (Many-to-Many RBAC)
 */
export const getUserRolesFromJoinTable = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role_id, roles(name)')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return ['customer'];
    }

    const assignedRoles: string[] = data.map((item: any) => item.roles?.name || item.role_id).filter(Boolean);
    return assignedRoles.length > 0 ? assignedRoles : ['customer'];
  } catch (err) {
    console.error('Failed to query user_roles join table:', err);
    return ['customer'];
  }
};

/**
 * Assign a Role to a User in user_roles JOIN table
 */
export const assignUserRoleJoin = async (userId: string, roleName: 'customer' | 'store_owner' | 'admin') => {
  try {
    const roleIdMap: Record<string, string> = {
      customer: 'role_customer',
      store_owner: 'role_store_owner',
      admin: 'role_admin'
    };

    const roleId = roleIdMap[roleName] || 'role_customer';

    await supabase.from('user_roles').insert([
      {
        user_id: userId,
        role_id: roleId
      }
    ]);
  } catch (err) {
    console.error('Failed to assign user role in join table:', err);
  }
};

/**
 * Sign In using Supabase Native Auth & Many-to-Many JOIN Roles Table
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

    // 2. Fetch assigned roles from Many-to-Many user_roles JOIN table
    const assignedRoles = await getUserRolesFromJoinTable(user.id);

    const customer: CustomerUser = {
      id: user.id,
      name: meta.name || user.email?.split('@')[0] || 'Customer Account',
      phone: meta.phone || cleanInput,
      email: user.email,
      address: meta.address || 'Sarita Vihar, Pocket B',
      houseNo: meta.house_no || 'House #42',
      roles: assignedRoles
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
};

/**
 * Sign Up using Supabase Native Auth & Assigning Roles in user_roles JOIN Table
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
          address
        }
      }
    });

    if (authErr) {
      if (authErr.message.includes('already registered')) {
        return signInCustomer(cleanEmail, pass);
      }
      return { success: false, error: `Supabase Auth Sign Up Error: ${authErr.message}` };
    }

    const user = authData.user;
    const userId = user?.id || 'usr_' + Math.random().toString(36).substring(2, 9);

    // 2. Assign role in Many-to-Many user_roles JOIN table
    await assignUserRoleJoin(userId, role);

    const customer: CustomerUser = {
      id: userId,
      name,
      phone: cleanPhone,
      email: cleanEmail,
      address,
      houseNo,
      roles: [role]
    };

    saveCustomerSession(customer);
    return { success: true, customer };
  } catch (err: any) {
    return { success: false, error: err.message || 'Registration error' };
  }
};
