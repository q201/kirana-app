import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Mic, BookOpen, Store, Server, MapPin, Sparkles, Navigation, User } from 'lucide-react';

interface NavbarProps {
  onOpenVoiceModal: () => void;
  onOpenPhotoModal: () => void;
  onOpenCartModal: () => void;
  onOpenTrackingModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenVoiceModal,
  onOpenPhotoModal,
  onOpenCartModal,
  onOpenTrackingModal,
  onOpenAuthModal
}) => {
  const {
    viewMode,
    setViewMode,
    languageMode,
    setLanguageMode,
    cart,
    khata,
    geofenceResults,
    activeStore,
    setActiveStore,
    isSupabaseConnected,
    userProfile
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 px-4 py-1 text-xs font-bold flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {languageMode === 'hi'
              ? 'स्मार्ट मोहल्ला किराना: स्थानीय पड़ोस डिलीवरी और डिजिटल खाता'
              : 'Smart Mohalla Kirana: Hyper-Local Neighborhood Household & Khata Platform'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block bg-slate-950/20 px-2 py-0.5 rounded text-[11px] font-semibold">
            PostGIS Geofenced 1.5km Active
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 ${
              isSupabaseConnected
                ? 'bg-emerald-950/40 text-emerald-900 border border-emerald-900/30'
                : 'bg-slate-950/30 text-slate-900'
            }`}
          >
            {isSupabaseConnected ? '⚡ Supabase DB Active' : '💾 Local Mode'}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Store Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('homemaker')}>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-500/20 border-2 border-amber-400">
              K
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                <span>MohallaKirana</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SuperLocal
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {languageMode === 'hi' ? 'अपने मोहल्ले की दुकान (विश्वास और खाता)' : 'Apne Mohalle Ki Dukaan (Trust & Khata)'}
              </p>
            </div>
          </div>

          {/* Hyper-local Store Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">{languageMode === 'hi' ? 'दुकान:' : 'Store:'}</span>
            <select
              value={activeStore.id}
              onChange={(e) => {
                const s = geofenceResults.find(r => r.store.id === e.target.value);
                if (s) setActiveStore(s.store);
              }}
              className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
            >
              {geofenceResults.map(({ store, distanceKm, isWithinGeofence }) => (
                <option key={store.id} value={store.id} className="bg-slate-900 text-slate-100">
                  {store.name} ({distanceKm} km {isWithinGeofence ? '✓' : '⚠️ Out of Bounds'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('homemaker')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'homemaker'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{languageMode === 'hi' ? 'गृहणी ऐप' : 'Homemaker App'}</span>
          </button>

          <button
            onClick={() => setViewMode('storeowner')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'storeowner'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{languageMode === 'hi' ? 'किराना अंकल डैशबोर्ड' : 'Kirana Uncle Dashboard'}</span>
          </button>

          <button
            onClick={() => setViewMode('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'architecture'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>System Design</span>
          </button>
        </div>

        {/* Language Switcher & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Hindi / English Language Toggle */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setLanguageMode('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                languageMode === 'en'
                  ? 'bg-slate-900 text-amber-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguageMode('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                languageMode === 'hi'
                  ? 'bg-slate-900 text-amber-400 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Quick Action Buttons for Homemaker */}
          {viewMode === 'homemaker' && (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-500 text-white rounded-lg font-bold text-xs shadow-md shadow-rose-900/30 hover:scale-105 transition-transform"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span className="hidden sm:inline">
                  {languageMode === 'hi' ? 'आवाज़ से ऑर्डर' : 'Voice Note Order'}
                </span>
              </button>

              <button
                onClick={onOpenTrackingModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold text-xs shadow-md hover:scale-105 transition-transform"
                title="Track Live Rider GPS Map"
              >
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">
                  {languageMode === 'hi' ? 'लाइव ट्रैकिंग' : 'Live Delivery GPS'}
                </span>
              </button>

              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-lg font-bold text-xs shadow transition-colors"
                title="Customer Auth & Profile"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">
                  {!userProfile?.name || userProfile?.name === 'Guest Homemaker'
                    ? (languageMode === 'hi' ? 'लॉगिन / साइन अप' : 'Sign In / Register')
                    : userProfile.name}
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <div className="text-left text-[11px]">
                  <div className="text-slate-400 leading-none">
                    {languageMode === 'hi' ? 'डिजिटल खाता' : 'Digital Khata Dues'}
                  </div>
                  <div className="font-bold text-emerald-400 leading-tight">₹{khata.totalBalance}</div>
                </div>
              </div>

              <button
                onClick={onOpenCartModal}
                className="relative p-2 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors font-bold flex items-center justify-center shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
