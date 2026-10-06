import React from 'react';
import { 
  Palette, 
  Sparkles, 
  Zap, 
  Gift, 
  ShieldCheck, 
  Tag, 
  Wallet,
  Clock,
  Eye,
  Check
} from 'lucide-react';
import { BannerDesignConfig } from '../types';

interface BannerCustomizerProps {
  bannerDesign: BannerDesignConfig;
  onUpdateDesign: (newDesign: BannerDesignConfig) => void;
}

const PRESET_THEMES = [
  {
    name: 'Emerald Dark (High Trust)',
    bgColor: '#064e3b',
    textColor: '#ffffff',
    borderColor: '#10b981',
    accentColor: '#fbbf24',
  },
  {
    name: 'Midnight Indigo (Modern Luxury)',
    bgColor: '#1e1b4b',
    textColor: '#ffffff',
    borderColor: '#6366f1',
    accentColor: '#38bdf8',
  },
  {
    name: 'Slate Minimal (Clean Contemporary)',
    bgColor: '#0f172a',
    textColor: '#ffffff',
    borderColor: '#334155',
    accentColor: '#10b981',
  },
  {
    name: 'Amber Sunset (High Urgency)',
    bgColor: '#78350f',
    textColor: '#ffffff',
    borderColor: '#f59e0b',
    accentColor: '#fde047',
  },
];

export const BannerCustomizer: React.FC<BannerCustomizerProps> = ({
  bannerDesign,
  onUpdateDesign,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Prepaid Offer Banner &amp; Widget Customizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tailor colors, fonts, countdown badges, and styling to match your Shopify storefront theme seamlessly.
          </p>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          
          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold text-xs">
              Theme Presets
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() =>
                    onUpdateDesign({
                      ...bannerDesign,
                      bgColor: theme.bgColor,
                      textColor: theme.textColor,
                      borderColor: theme.borderColor,
                      accentColor: theme.accentColor,
                    })
                  }
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700 text-left flex items-center gap-2.5 transition-colors"
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: theme.bgColor }}
                  />
                  <span className="text-slate-200 text-xs font-medium truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers */}
          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            <h3 className="font-semibold text-slate-200">Colors &amp; Contrast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Banner Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bannerDesign.bgColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, bgColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bannerDesign.bgColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, bgColor: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Accent Highlight Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bannerDesign.accentColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, accentColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bannerDesign.accentColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, accentColor: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Border Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bannerDesign.borderColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, borderColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bannerDesign.borderColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, borderColor: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono flex-1 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bannerDesign.textColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, textColor: e.target.value })}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bannerDesign.textColor}
                    onChange={(e) => onUpdateDesign({ ...bannerDesign, textColor: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white font-mono flex-1 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Corner Radius & Urgency options */}
          <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
            <h3 className="font-semibold text-slate-200">Geometry &amp; Urgency Animation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Corner Radius</label>
                <select
                  value={bannerDesign.borderRadius}
                  onChange={(e) =>
                    onUpdateDesign({
                      ...bannerDesign,
                      borderRadius: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="sm">Subtle (4px)</option>
                  <option value="md">Rounded (8px)</option>
                  <option value="lg">Curved (12px)</option>
                  <option value="full">Pill (999px)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Icon Style</label>
                <select
                  value={bannerDesign.iconType}
                  onChange={(e) =>
                    onUpdateDesign({
                      ...bannerDesign,
                      iconType: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                >
                  <option value="lightning">⚡ Lightning Flash</option>
                  <option value="gift">🎁 Gift Box</option>
                  <option value="shield">🛡️ Verified Shield</option>
                  <option value="tag">🏷️ Discount Tag</option>
                  <option value="wallet">💰 Smart Wallet</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerDesign.pulseAnimation}
                  onChange={(e) =>
                    onUpdateDesign({ ...bannerDesign, pulseAnimation: e.target.checked })
                  }
                  className="rounded text-emerald-600 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300">Enable soft pulse animation on icon</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerDesign.showCountdown}
                  onChange={(e) =>
                    onUpdateDesign({ ...bannerDesign, showCountdown: e.target.checked })
                  }
                  className="rounded text-emerald-600 bg-slate-950 border-slate-700"
                />
                <span className="text-slate-300">
                  Show reservation timer (14:59 mins urgency timer)
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Live Preview Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Widget Preview</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Live CSS Render</span>
          </div>

          <div className="space-y-4">
            
            {/* Widget 1: Checkout Step Banner */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-slate-400">Checkout Payment Step:</span>
              <div
                style={{
                  backgroundColor: bannerDesign.bgColor,
                  color: bannerDesign.textColor,
                  borderColor: bannerDesign.borderColor,
                }}
                className={`border p-4 shadow-lg transition-all ${
                  bannerDesign.borderRadius === 'sm'
                    ? 'rounded-sm'
                    : bannerDesign.borderRadius === 'md'
                    ? 'rounded-lg'
                    : bannerDesign.borderRadius === 'lg'
                    ? 'rounded-xl'
                    : 'rounded-full'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-lg ${bannerDesign.pulseAnimation ? 'animate-pulse' : ''}`}>
                      {bannerDesign.iconType === 'lightning' && '⚡'}
                      {bannerDesign.iconType === 'gift' && '🎁'}
                      {bannerDesign.iconType === 'shield' && '🛡️'}
                      {bannerDesign.iconType === 'tag' && '🏷️'}
                      {bannerDesign.iconType === 'wallet' && '💰'}
                    </span>
                    <div>
                      <div className="font-bold tracking-tight" style={{ color: bannerDesign.accentColor }}>
                        Extra 10% OFF on UPI &amp; Cards
                      </div>
                      <div className="text-[11px] opacity-90">
                        Instant discount applied at checkout. No coupon required!
                      </div>
                    </div>
                  </div>

                  {bannerDesign.showCountdown && (
                    <div className="shrink-0 text-right font-mono text-[11px] bg-black/30 px-2 py-1 rounded">
                      <div className="opacity-70 text-[9px]">OFFER ENDS</div>
                      <div className="font-bold" style={{ color: bannerDesign.accentColor }}>
                        14:32
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Widget 2: Compact Cart Drawer Pill */}
            <div className="space-y-1 pt-3">
              <span className="text-[11px] font-mono text-slate-400">Cart Drawer Header Tag:</span>
              <div
                style={{
                  backgroundColor: bannerDesign.bgColor,
                  color: bannerDesign.textColor,
                  borderColor: bannerDesign.borderColor,
                }}
                className="border p-2.5 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span className="font-medium">Save ₹100 instantly on Prepaid orders!</span>
                </div>
                <span className="font-mono font-bold" style={{ color: bannerDesign.accentColor }}>
                  SAVE ₹100
                </span>
              </div>
            </div>

            {/* Widget 3: White background context preview */}
            <div className="space-y-1 pt-3">
              <span className="text-[11px] font-mono text-slate-400">Context on Light Shopify Store Theme:</span>
              <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
                <div className="text-slate-900 font-bold text-xs">Payment Information</div>
                <div
                  style={{
                    backgroundColor: bannerDesign.bgColor,
                    color: bannerDesign.textColor,
                    borderColor: bannerDesign.borderColor,
                  }}
                  className="border p-3 rounded-lg text-xs flex items-center justify-between"
                >
                  <span className="font-semibold">⚡ UPI / Online Payment Offer</span>
                  <span className="font-mono font-bold" style={{ color: bannerDesign.accentColor }}>
                    -₹100 APPLIED
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
