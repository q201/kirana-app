import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ThemeMode } from '../../types';
import { Palette, Moon, Sun, Leaf, Waves, Flame, Zap, Check, Sparkles, RefreshCw, Copy, CheckCircle2, Sliders, Shield } from 'lucide-react';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const AdminThemeSelector: React.FC = () => {
  const { themeMode, setThemeMode } = useApp();
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const themeOptions: ThemeOption[] = [
    {
      id: 'dark',
      name: 'Classic Dark Slate',
      subtitle: 'Default Production Theme',
      icon: Moon,
      colors: {
        bg: '#020617',
        card: '#0f172a',
        accent: '#f59e0b',
        text: '#f8fafc'
      },
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-400',
      description: 'Sleek dark mode tailored for low-light environments, reducing eye fatigue for store managers.'
    },
    {
      id: 'light',
      name: 'Clean Light Mode',
      subtitle: 'Crisp & High Contrast',
      icon: Sun,
      colors: {
        bg: '#f1f5f9',
        card: '#ffffff',
        accent: '#2563eb',
        text: '#0f172a'
      },
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-600',
      description: 'Ultra-clear, high-visibility bright layout optimized for outdoor sunlight reading.'
    },
    {
      id: 'emerald',
      name: 'Emerald Grocer',
      subtitle: 'Desi Fresh & Mint',
      icon: Leaf,
      colors: {
        bg: '#022c22',
        card: '#065f46',
        accent: '#10b981',
        text: '#ecfdf5'
      },
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-400',
      description: 'Organic green aesthetic inspired by fresh farm produce & local neighborhood mandi markets.'
    },
    {
      id: 'sapphire',
      name: 'Midnight Sapphire',
      subtitle: 'Deep Ocean Navy',
      icon: Waves,
      colors: {
        bg: '#09122c',
        card: '#1e3a8a',
        accent: '#38bdf8',
        text: '#f0f9ff'
      },
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-400',
      description: 'Enterprise royal navy blue design tailored for corporate fleet management & admin tools.'
    },
    {
      id: 'sunset',
      name: 'Sunset Ochre',
      subtitle: 'Royal Amber & Mahogany',
      icon: Flame,
      colors: {
        bg: '#1c0a00',
        card: '#451a03',
        accent: '#facc15',
        text: '#fffbeb'
      },
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      description: 'Warm golden hues celebrating traditional Indian festive colors and rich merchant ledgers.'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      subtitle: 'Futuristic Obsidian & Pink',
      icon: Zap,
      colors: {
        bg: '#09090b',
        card: '#27272a',
        accent: '#d946ef',
        text: '#fae8ff'
      },
      badgeBg: 'bg-fuchsia-500/20',
      badgeText: 'text-fuchsia-400',
      description: 'Vibrant neon highlights with obsidian surfaces for tech-forward super-app experiences.'
    }
  ];

  const handleSaveStoreDefault = () => {
    localStorage.setItem('mohalla_admin_default_theme', themeMode);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleCopyThemeCSS = () => {
    const activeObj = themeOptions.find(t => t.id === themeMode);
    const cssText = `/* MohallaKirana Admin Theme: ${activeObj?.name} */\n[data-theme="${themeMode}"] {\n  --bg-primary: ${activeObj?.colors.bg};\n  --bg-card: ${activeObj?.colors.card};\n  --accent: ${activeObj?.colors.accent};\n  --text-main: ${activeObj?.colors.text};\n}`;
    navigator.clipboard.writeText(cssText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Palette className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white">Admin Theme Manager & Customizer</h2>
          </div>
          <p className="text-xs text-slate-400">
            Configure application theme appearance globally. Admin choices apply instantly across Homemaker, Merchant, and Admin modules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleSaveStoreDefault}
            className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{savedNotification ? 'Saved System Default!' : 'Save System Default'}</span>
          </button>
        </div>
      </div>

      {/* Theme Cards Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {themeOptions.map((theme) => {
          const IconComp = theme.icon;
          const isActive = themeMode === theme.id;

          return (
            <div
              key={theme.id}
              onClick={() => setThemeMode(theme.id)}
              className={`bg-slate-900 border rounded-3xl p-5 flex flex-col justify-between gap-4 cursor-pointer transition-all duration-200 hover:scale-[1.02] relative overflow-hidden ${
                isActive
                  ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Active Ribbon */}
              {isActive && (
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 px-3 py-1 rounded-bl-2xl text-[10px] font-black uppercase flex items-center gap-1 shadow">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Active Theme</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Theme Title & Icon */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${theme.badgeBg} ${theme.badgeText} border-current/20`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{theme.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{theme.subtitle}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>

                {/* Color Palette Swatches */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Color Tokens Palette
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                        style={{ backgroundColor: theme.colors.bg }}
                        title={`Background: ${theme.colors.bg}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                        style={{ backgroundColor: theme.colors.card }}
                        title={`Card BG: ${theme.colors.card}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                        style={{ backgroundColor: theme.colors.accent }}
                        title={`Accent: ${theme.colors.accent}`}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-700 shadow-inner"
                        style={{ backgroundColor: theme.colors.text }}
                        title={`Text Color: ${theme.colors.text}`}
                      />
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                      {theme.id.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setThemeMode(theme.id);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Theme Currently Active</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Apply {theme.name}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Admin Interactive Component Preview Test */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Live Theme UI Component Test Drive</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive preview of how buttons, badges, inputs, and cards adapt under the active theme (<span className="text-amber-400 font-bold">{themeMode.toUpperCase()}</span>).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyThemeCSS}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-purple-400" />
              <span>{copiedNotification ? 'CSS Copied!' : 'Copy Theme Tokens'}</span>
            </button>
            <button
              onClick={() => setThemeMode('dark')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Default Dark</span>
            </button>
          </div>
        </div>

        {/* Live Widget Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Homemaker Quick Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 flex items-center justify-between">
              <span>Public Homemaker App Card</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Preview</span>
            </div>
            <h4 className="text-sm font-black text-white">Chakki Fresh Atta (5kg)</h4>
            <p className="text-xs text-slate-400">₹245 • Premium Whole Wheat</p>
            <button className="w-full py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow">
              Add to Basket
            </button>
          </div>

          {/* Kirana Merchant Dashboard Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>Merchant Dashboard Card</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Khata Active</span>
            </div>
            <h4 className="text-sm font-black text-white">Khata Balance: ₹1,420</h4>
            <p className="text-xs text-slate-400">Customer: Sharma Ji (#42)</p>
            <button className="w-full py-2 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow">
              Settle Digital Khata
            </button>
          </div>

          {/* Admin System Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-blue-400 flex items-center justify-between">
              <span>Admin PostGIS Geofence</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">1.5km Bounds</span>
            </div>
            <h4 className="text-sm font-black text-white">Spatial Polygon Router</h4>
            <p className="text-xs text-slate-400">Status: ST_DWithin Active</p>
            <button className="w-full py-2 bg-blue-600 text-white font-black text-xs rounded-xl shadow">
              Run Spatial Query
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
