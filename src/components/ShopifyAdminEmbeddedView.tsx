import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Store, 
  Home, 
  ShoppingBag, 
  Tag, 
  Users, 
  BarChart2, 
  Megaphone, 
  Percent, 
  LayoutGrid, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Layers,
  SlidersHorizontal,
  Smartphone,
  ChevronDown,
  Maximize2
} from 'lucide-react';
import { PrepaidRule, AnalyticsSummary, ShopifyStoreConfig, BannerDesignConfig } from '../types';
import { DashboardOverview } from './DashboardOverview';
import { RulesManager } from './RulesManager';
import { BannerCustomizer } from './BannerCustomizer';
import { DeveloperCodeExport } from './DeveloperCodeExport';

interface ShopifyAdminEmbeddedViewProps {
  rules: PrepaidRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onDuplicateRule: (rule: PrepaidRule) => void;
  onEditRule: (rule: PrepaidRule) => void;
  onOpenCreateRule: () => void;
  analytics: AnalyticsSummary;
  storeConfig: ShopifyStoreConfig;
  bannerDesign: BannerDesignConfig;
  onUpdateDesign: (newDesign: BannerDesignConfig) => void;
  onNavigateToSimulator: () => void;
  onNavigateToIntegration: () => void;
  isAppEnabled: boolean;
  onToggleAppEnabled: () => void;
}

export const ShopifyAdminEmbeddedView: React.FC<ShopifyAdminEmbeddedViewProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onDuplicateRule,
  onEditRule,
  onOpenCreateRule,
  analytics,
  storeConfig,
  bannerDesign,
  onUpdateDesign,
  onNavigateToSimulator,
  onNavigateToIntegration,
  isAppEnabled,
  onToggleAppEnabled,
}) => {
  const [embeddedTab, setEmbeddedTab] = useState<'overview' | 'rules' | 'banner' | 'code'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="space-y-4">
      
      {/* Informational Callout Bar */}
      <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold">
            ⚡
          </div>
          <div>
            <h3 className="font-bold text-white text-xs flex items-center gap-2">
              <span>Shopify Admin Embedded App Mode (Live Simulation)</span>
              <span className="text-[10px] bg-emerald-900 text-emerald-300 border border-emerald-700 px-1.5 py-0.2 rounded font-mono">
                App Bridge v4 Ready
              </span>
            </h3>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Jab aap ya koi bhi merchant Shopify Admin ke left menu me <strong>"Apps &gt; Prepaid Perks"</strong> par click karega, 
              toh bilkul aise hi Shopify ke andar aapka dashboard load hoga!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-emerald-300 font-mono bg-emerald-900/60 border border-emerald-800 px-2.5 py-1 rounded">
            URL: admin.shopify.com/store/{storeConfig.shopDomain.replace('.myshopify.com', '')}/apps/prepaid-perks
          </span>
        </div>
      </div>

      {/* SHOPIFY ADMIN MOCKUP CONTAINER */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-slate-700 shadow-2xl overflow-hidden text-slate-200">
        
        {/* Shopify Admin Top Navigation Bar */}
        <div className="h-12 bg-[#1a1a1a] border-b border-neutral-800 px-4 flex items-center justify-between gap-4 select-none">
          
          {/* Left: Store Selector */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[#2a2a2a] flex items-center justify-center font-bold text-white text-xs">
              <Store className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-100 cursor-pointer">
              <span>{storeConfig.shopDomain.replace('.myshopify.com', '')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Center: Shopify Universal Search Bar */}
          <div className="hidden sm:flex items-center gap-2 bg-[#2a2a2a] border border-neutral-700/80 rounded-lg px-3 py-1.5 w-80 text-xs text-slate-400">
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1">Search apps, orders, customers...</span>
            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 font-mono">Ctrl K</span>
          </div>

          {/* Right: Notifications & Merchant Profile */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-md hover:bg-neutral-800 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-[11px]">
                MS
              </div>
              <span className="font-medium text-slate-200 hidden md:inline">Merchant Admin</span>
            </div>
          </div>
        </div>

        {/* Shopify Admin Workspace Layout (Sidebar + Embedded Canvas) */}
        <div className="flex flex-col md:flex-row min-h-[640px]">
          
          {/* Left Sidebar (Shopify Admin Standard Menu) */}
          <div className="w-full md:w-56 bg-[#141414] border-r border-neutral-800 p-3 space-y-4 text-xs select-none shrink-0">
            
            {/* Standard Shopify Links (Muted/Inactive to highlight App) */}
            <div className="space-y-0.5 text-neutral-400 font-medium">
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <Tag className="w-4 h-4" />
                <span>Products</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800/60 transition-colors cursor-not-allowed opacity-60">
                <Percent className="w-4 h-4" />
                <span>Discounts</span>
              </div>
            </div>

            {/* APPS SECTION (THE HERO ELEMENT) */}
            <div className="pt-2 border-t border-neutral-800 space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Installed Apps
              </div>

              {/* Our App: Prepaid Perks (ACTIVE) */}
              <div className="bg-[#2a2a2a] border border-neutral-700/80 text-white font-semibold rounded-lg px-2.5 py-2 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">⚡</span>
                  <span className="truncate">Prepaid Perks</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="px-2.5 py-1.5 text-neutral-500 text-[11px] flex items-center justify-between">
                <span>App Bridge 4.0</span>
                <span className="text-emerald-400 font-mono">Embedded</span>
              </div>
            </div>

            {/* Sub-navigation within Embedded App */}
            <div className="pt-2 border-t border-neutral-800 space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                App Pages
              </div>
              <button
                onClick={() => setEmbeddedTab('overview')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  embeddedTab === 'overview'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setEmbeddedTab('rules')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  embeddedTab === 'rules'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                Offer Rules Engine
              </button>
              <button
                onClick={() => setEmbeddedTab('banner')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  embeddedTab === 'banner'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                Banner Styling
              </button>
              <button
                onClick={() => setEmbeddedTab('code')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  embeddedTab === 'code'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/40'
                }`}
              >
                Code &amp; Functions Export
              </button>
            </div>

          </div>

          {/* Right Area: Embedded App iFrame Canvas */}
          <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto">
            
            {/* Embedded App Bridge Header */}
            <div className="mb-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">
                    https://{storeConfig.shopDomain}/admin/apps/prepaid-perks
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                    200 OK
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Prepaid Perks &bull; Merchant Control Center
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateToSimulator}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test Storefront Checkout</span>
                </button>
              </div>
            </div>

            {/* Embedded Active View */}
            {embeddedTab === 'overview' && (
              <DashboardOverview
                rules={rules}
                onToggleRule={onToggleRule}
                analytics={analytics}
                storeConfig={storeConfig}
                onOpenCreateRule={onOpenCreateRule}
                onNavigateToSimulator={onNavigateToSimulator}
                onNavigateToIntegration={onNavigateToIntegration}
                onNavigateToRules={() => setEmbeddedTab('rules')}
                isAppEnabled={isAppEnabled}
                onToggleAppEnabled={onToggleAppEnabled}
              />
            )}

            {embeddedTab === 'rules' && (
              <RulesManager
                rules={rules}
                onToggleRule={onToggleRule}
                onDeleteRule={onDeleteRule}
                onDuplicateRule={onDuplicateRule}
                onEditRule={onEditRule}
                onOpenCreateModal={onOpenCreateRule}
              />
            )}

            {embeddedTab === 'banner' && (
              <BannerCustomizer
                bannerDesign={bannerDesign}
                onUpdateDesign={onUpdateDesign}
              />
            )}

            {embeddedTab === 'code' && (
              <DeveloperCodeExport
                rules={rules}
                storeConfig={storeConfig}
                bannerDesign={bannerDesign}
              />
            )}

          </div>

        </div>

      </div>

      {/* Technical FAQ: Embedded App details */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs text-slate-300">
        <h4 className="font-bold text-white text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Shopify me App click karne par Dashboard khulne ki Puri Technical Jankari:</span>
        </h4>
        <ul className="space-y-1.5 list-disc list-inside text-slate-400">
          <li>
            <strong>1. Shopify Admin me URL:</strong> Jab merchant click karta hai, Shopify open karta hai: <code className="text-emerald-400 font-mono">https://admin.shopify.com/store/YOUR-STORE/apps/prepaid-perks</code>.
          </li>
          <li>
            <strong>2. Vercel iFrame Load:</strong> Shopify internally aapke Vercel URL ko iframe ke roop me call karta hai query parameters ke sath: <code className="text-amber-400 font-mono">?shop=your-store.myshopify.com&amp;host=...</code>.
          </li>
          <li>
            <strong>3. Security Header (Sabse Important):</strong> Vercel ya server me <code>Content-Security-Policy</code> me <code className="text-emerald-400 font-mono">frame-ancestors https://*.myshopify.com https://admin.shopify.com</code> hona zaroori hai taki Shopify iframe block na ho. (Yeh humne code export me de diya hai).
          </li>
          <li>
            <strong>4. Direct Access:</strong> Merchant ko koi alag tab nahi kholni padti, sab kuch Shopify Admin ke andar hi manage hota hai!
          </li>
        </ul>
      </div>

    </div>
  );
};
