import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { signInCustomer, signUpCustomer } from '../../lib/supabaseAuth';
import { User, Phone, MapPin, Home, CheckCircle2, X, ShieldCheck, Sparkles, LogIn, UserPlus, KeyRound, AlertCircle, Mail, Store, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  targetRole?: 'customer' | 'store_owner' | 'admin';
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetRole
}) => {
  const { userProfile, setUserProfile, languageMode, setViewMode } = useApp();

  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'store_owner' | 'admin'>(targetRole || 'customer');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [phoneOrEmail, setPhoneOrEmail] = useState<string>(userProfile?.phone || '');
  const [password, setPassword] = useState<string>('');

  // Sign Up Fields
  const [name, setName] = useState<string>(userProfile?.name === 'Guest Homemaker' ? '' : userProfile?.name || '');
  const [phone, setPhone] = useState<string>(userProfile?.phone || '');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>(userProfile?.address || '');
  const [houseNo, setHouseNo] = useState<string>(userProfile?.houseNo || '');

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signInCustomer(phoneOrEmail, password);
    setLoading(false);

    if (res.success && res.customer) {
      setUserProfile({
        name: res.customer.name,
        phone: res.customer.phone,
        address: res.customer.address,
        houseNo: res.customer.houseNo,
        roles: res.customer.roles
      });

      if (res.customer.roles.includes('store_owner')) setViewMode('storeowner');
      else if (res.customer.roles.includes('admin')) setViewMode('architecture');

      setIsSuccess(true);
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Invalid credentials or user not found');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signUpCustomer(name, phone, email, houseNo, address, password, selectedRole);
    setLoading(false);

    if (res.success && res.customer) {
      setUserProfile({
        name: res.customer.name,
        phone: res.customer.phone,
        address: res.customer.address,
        houseNo: res.customer.houseNo,
        roles: res.customer.roles
      });

      if (selectedRole === 'store_owner') setViewMode('storeowner');
      else if (selectedRole === 'admin') setViewMode('architecture');

      setIsSuccess(true);
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto cursor-default">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              {targetRole === 'store_owner' ? <Store className="w-4 h-4" /> : targetRole === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {targetRole === 'store_owner'
                  ? 'Kirana Merchant Login Required'
                  : targetRole === 'admin'
                  ? 'Platform Admin Login Required'
                  : (languageMode === 'hi' ? 'मोहल्ला ग्राहक प्रमाणीकरण' : 'User Account Authentication')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {targetRole
                  ? `Access restricted to ${targetRole.replace('_', ' ')} accounts`
                  : (languageMode === 'hi' ? 'सुरक्षित प्रमाणीकरण प्रणाली' : 'Secure Encrypted Account Access')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => { setTab('signin'); setErrorMsg(null); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'signin'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{languageMode === 'hi' ? 'साइन इन (Sign In)' : 'Sign In (Existing)'}</span>
          </button>

          <button
            onClick={() => { setTab('signup'); setErrorMsg(null); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'signup'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{languageMode === 'hi' ? 'साइन अप (Sign Up)' : 'Sign Up (New User)'}</span>
          </button>
        </div>


        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div>{errorMsg}</div>
              {errorMsg.includes('not found') && (
                <button
                  onClick={() => { setTab('signup'); setErrorMsg(null); }}
                  className="text-amber-400 underline font-bold hover:text-amber-300 text-[11px]"
                >
                  👉 Click here to Sign Up new account!
                </button>
              )}
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-white">
              {tab === 'signin' ? 'Welcome Back!' : 'Account Created Successfully!'}
            </h4>
            <p className="text-xs text-slate-400">
              Authenticated as <span className="text-amber-300 font-bold">{userProfile?.name}</span>.
            </p>
          </div>
        ) : tab === 'signin' ? (
          /* Sign In Form */
          <form onSubmit={handleSignIn} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Number or Email</span>
              </label>
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+91 99887 76655 or email@domain.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Password / Mobile PIN</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <span>Authenticating User...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSignUp} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Account Role</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="customer">🛒 Household Customer (Homemaker App)</option>
                <option value="store_owner">🏪 Kirana Merchant (Store Dashboard)</option>
                <option value="admin">🛡️ Platform Admin (System Design)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anjali Verma"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email (Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>House / Flat No</span>
                </label>
                <input
                  type="text"
                  required
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="House #42, Lane 3"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mohalla / Colony</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Pocket B, Sarita Vihar"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Set Password / Security PIN</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Creates encrypted user profile record in secure cloud database.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account & Continue</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
