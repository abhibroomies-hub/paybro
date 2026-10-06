import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Plus, 
  CheckCircle2, 
  Store, 
  SlidersHorizontal,
  Smartphone,
  Layers,
  Code2,
  Palette,
  Zap
} from 'lucide-react';
import { ShopifyStoreConfig } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storeConfig: ShopifyStoreConfig;
  onOpenHindiGuide: () => void;
  onOpenCreateRule: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  storeConfig,
  onOpenHindiGuide,
  onOpenCreateRule,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">PayBro</span>
              <span className="text-xs text-emerald-400 font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                Shopify App
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none mt-0.5">
              Prepaid Payment Offer &amp; RTO Reducer Engine
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('autopilot')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'autopilot'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/60 font-semibold'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ 1-Click Auto-Pilot</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Rules Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('shopify-admin')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'shopify-admin'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold'
                : 'hover:text-white hover:bg-slate-900 text-slate-300'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Shopify Admin Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Checkout Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'integration'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Shopify &amp; Vercel Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('banner')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'banner'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Banner Styling</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Export</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Hindi/Hinglish Guide Button */}
          <button
            onClick={onOpenHindiGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-amber-950/60 border border-amber-800/80 text-amber-300 hover:bg-amber-900/60 transition-colors"
            title="Shopify Dev, Vercel & GitHub step-by-step Hindi guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Setup Guide (हिंदी)</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Store status pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-300">
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[140px]">{storeConfig.shopDomain}</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
          </div>

          {/* Primary CTA: Create Rule */}
          <button
            onClick={onOpenCreateRule}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Offer Rule</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('autopilot')}
          className={`px-2.5 py-1 rounded whitespace-nowrap font-bold ${
            activeTab === 'autopilot'
              ? 'bg-emerald-600 text-white'
              : 'text-emerald-400 bg-emerald-950 border border-emerald-800'
          }`}
        >
          ⚡ Auto-Pilot
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'rules' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Rules Engine
        </button>
        <button
          onClick={() => setActiveTab('shopify-admin')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'shopify-admin' ? 'bg-emerald-950 text-emerald-300 font-medium border border-emerald-800' : 'text-slate-400'
          }`}
        >
          Shopify Admin
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveTab('integration')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'integration' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Shopify &amp; Vercel
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'banner' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Banner Style
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'code' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
          }`}
        >
          Code Export
        </button>
      </div>
    </header>
  );
};
