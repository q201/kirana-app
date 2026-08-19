import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Home, CheckCircle2, X, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { userProfile, setUserProfile, languageMode } = useApp();

  const [name, setName] = useState<string>(userProfile?.name || 'Sunita Sharma');
  const [phone, setPhone] = useState<string>(userProfile?.phone || '+91 99887 76655');
  const [address, setAddress] = useState<string>(userProfile?.address || 'Pocket B, Sarita Vihar, New Delhi');
  const [houseNo, setHouseNo] = useState<string>(userProfile?.houseNo || 'House #42, Lane 3');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      name,
      phone,
      address,
      houseNo
    });

    setIsSaved(true);
    confetti({ particleCount: 50, spread: 60 });

    setTimeout(() => {
      setIsSaved(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {languageMode === 'hi' ? 'गृहणी पंजीकरण / लॉगिन' : 'Homemaker Registration & Login'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {languageMode === 'hi' ? 'मोहल्ला डिलीवरी और खाता के लिए' : 'For Mohalla Delivery & Digital Khata'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-black text-white">
              {languageMode === 'hi' ? 'सफलतापूर्वक पंजीकृत!' : 'Successfully Registered!'}
            </h4>
            <p className="text-xs text-slate-400">
              Welcome <span className="text-amber-300 font-bold">{name}</span>. You can now place orders & manage Digital Khata.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{languageMode === 'hi' ? 'आपका नाम (Full Name)' : 'Full Name'}</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sunita Sharma"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{languageMode === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 99887 76655"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-amber-500"
              />
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

            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Registered households get instant Digital Khata credit line & 10-min neighborhood delivery!</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-1.5 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{languageMode === 'hi' ? 'पंजीकरण पूरा करें' : 'Complete Registration & Save Profile'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
