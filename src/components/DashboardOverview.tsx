import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Smartphone, 
  SlidersHorizontal, 
  Zap, 
  Percent, 
  Layers, 
  Sparkles,
  Power,
  Store,
  Clock
} from 'lucide-react';
import { PrepaidRule, AnalyticsSummary, ShopifyStoreConfig } from '../types';

interface DashboardOverviewProps {
  rules: PrepaidRule[];
  onToggleRule: (ruleId: string) => void;
  analytics: AnalyticsSummary;
  storeConfig: ShopifyStoreConfig;
  onOpenCreateRule: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToIntegration: () => void;
  onNavigateToRules: () => void;
  onNavigateToAutoPilot?: () => void;
  isAppEnabled: boolean;
  onToggleAppEnabled: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  rules,
  onToggleRule,
  analytics,
  storeConfig,
  onOpenCreateRule,
  onNavigateToSimulator,
  onNavigateToIntegration,
  onNavigateToRules,
  onNavigateToAutoPilot,
  isAppEnabled,
  onToggleAppEnabled,
}) => {
  const activeRulesCount = rules.filter((r) => r.isActive).length;
  const netMerchantSavings = analytics.estimatedRtoSaved - analytics.totalDiscountsDisbursed;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Store Status, Master App Switch & Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isAppEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <h1 className="text-base font-bold text-white tracking-tight">
              PayBro &bull; Prepaid Payment Offer Engine
            </h1>
            <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {storeConfig.shopDomain}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isAppEnabled
              ? 'App status is ACTIVE. Enabled offer rules are applying to customer checkouts.'
              : 'App status is PAUSED. All checkout offers are temporarily paused.'}
          </p>
        </div>

        {/* Master ON/OFF Toggle + Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Master ON/OFF Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              Master Status:
            </span>
            <button
              onClick={onToggleAppEnabled}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAppEnabled ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
              title={isAppEnabled ? 'Click to Turn Off All Offers' : 'Click to Turn On PayBro'}
              aria-label="Toggle entire app status"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isAppEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span
              className={`text-xs font-bold font-mono ${
                isAppEnabled ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              {isAppEnabled ? 'ON' : 'OFF'}
            </span>
          </div>

          {onNavigateToAutoPilot && (
            <button
              onClick={onNavigateToAutoPilot}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ 1-Click Auto-Pilot</span>
            </button>
          )}

          <button
            onClick={onNavigateToSimulator}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Simulator</span>
          </button>

          <button
            onClick={onOpenCreateRule}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+ New Rule</span>
          </button>
        </div>
      </div>

      {/* PAUSED WARNING BANNER IF TURNED OFF */}
      {!isAppEnabled && (
        <div className="bg-amber-950/60 border border-amber-800/80 rounded-xl p-4 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Power className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>PayBro is currently PAUSED:</strong> Prepaid discounts and checkout badges will NOT be shown to customers until you turn the master switch back ON.
            </span>
          </div>
          <button
            onClick={onToggleAppEnabled}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors shrink-0 ml-3"
          >
            Turn ON Now
          </button>
        </div>
      )}

      {/* KPI Metrics Grid: Real Initial Store Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Prepaid Orders Share */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Prepaid Orders Share</span>
            <span className="text-slate-400 font-mono text-[11px]">Live tracking</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {analytics.totalOrders > 0 ? `${analytics.prepaidRatio.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-mono tabular-nums">{analytics.prepaidOrders}</span> of{' '}
              <span className="font-mono tabular-nums">{analytics.totalOrders}</span> orders paid prepaid
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, analytics.prepaidRatio)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: RTO Courier Losses Prevented */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>RTO Losses Prevented</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums">
              ₹{analytics.estimatedRtoSaved.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {analytics.totalOrders > 0
                ? 'Estimated shipping cost saved from canceled CODs'
                : 'Awaiting checkout orders to compute RTO savings'}
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            ~₹140 average courier return cost saved per prepaid order
          </div>
        </div>

        {/* Metric 3: Total Discounts Distributed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Discounts Disbursed</span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              ₹{analytics.totalDiscountsDisbursed.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Across <span className="font-mono tabular-nums text-slate-200">{analytics.prepaidOrders}</span> prepaid checkouts
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Direct customer incentive given to prevent COD
          </div>
        </div>

        {/* Metric 4: Net Merchant ROI */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Value Saved</span>
            <span className="text-emerald-400 text-xs font-semibold">Active</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-300 tracking-tight tabular-nums">
              ₹{netMerchantSavings.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              RTO courier savings minus discount cost
            </p>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Net profit retained by broomiesbakery
          </div>
        </div>

      </div>

      {/* Main Row: Active Rules & Rule Toggles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Rules List (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Prepaid Offer Rules</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-medium">
                  {activeRulesCount} of {rules.length} ON
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle any rule ON or OFF. Changes save immediately to your store.
              </p>
            </div>
            <button
              onClick={onNavigateToRules}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>Manage all rules</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border transition-all ${
                  rule.isActive && isAppEnabled
                    ? 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600 shadow-xs'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-xs text-white truncate">{rule.name}</span>
                      
                      {/* Discount Pill */}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 shrink-0">
                        {rule.discountType === 'percentage'
                          ? `${rule.discountValue}% OFF (Max ₹${rule.maxDiscountAmount || 0})`
                          : rule.discountType === 'fixed_amount'
                          ? `₹${rule.discountValue} Flat OFF`
                          : 'Free Shipping'}
                      </span>

                      {/* Status indicator */}
                      <span
                        className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded uppercase ${
                          rule.isActive && isAppEnabled
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rule.isActive && isAppEnabled ? 'ACTIVE (ON)' : 'OFF / PAUSED'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span>Min Order: <strong className="text-slate-300 font-mono">₹{rule.minOrderValue}</strong></span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Gateways: <span className="text-slate-300">{rule.applicableGateways.join(', ')}</span></span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="text-slate-300 truncate max-w-[200px]">{rule.badgeText}</span>
                    </div>
                  </div>

                  {/* Toggle Button for this rule */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-semibold hidden sm:inline text-slate-400">
                      {rule.isActive ? 'ON' : 'OFF'}
                    </span>
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      aria-label={`Toggle ${rule.name}`}
                      title={rule.isActive ? 'Click to Turn OFF' : 'Click to Turn ON'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
            <span>Rules save in real-time. Toggling OFF deactivates it immediately.</span>
            <button
              onClick={onOpenCreateRule}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + Create custom rule
            </button>
          </div>
        </div>

        {/* Right Column: Live Store Status & Connection Details */}
        <div className="space-y-6">
          
          {/* Store Connection Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Connected Store Status</span>
            </h3>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Store Domain:</span>
                <span className="font-mono text-emerald-400 font-bold">{storeConfig.shopDomain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Shopify Embed:</span>
                <span className="font-mono text-slate-200">Active in Admin iFrame</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Verified &bull; Ready
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300">How ON/OFF works:</div>
              <p className="text-[11px] leading-relaxed">
                When you toggle a rule ON or OFF above, it is instantly updated in your app state. 
                Use the <strong>"Test Simulator"</strong> tab to verify the exact customer checkout experience!
              </p>
            </div>
          </div>

          {/* Quick Setup Reference Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">
                Shopify &amp; Vercel Integration
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Need to check OAuth credentials, access tokens, or export Shopify Functions code?
            </p>
            <button
              onClick={onNavigateToIntegration}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors text-center"
            >
              Open Integration &amp; API Details &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
