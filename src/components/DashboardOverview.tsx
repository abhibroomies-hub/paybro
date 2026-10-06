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
  Sparkles
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
}) => {
  const activeRulesCount = rules.filter((r) => r.isActive).length;
  const netMerchantSavings = analytics.estimatedRtoSaved - analytics.totalDiscountsDisbursed;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Store Status & Quick Callout */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-base font-bold text-white tracking-tight">
              Prepaid Payment Offer Engine
            </h1>
            <span className="text-xs text-slate-400 font-mono">
              v2.4 &bull; Connected to {storeConfig.shopDomain}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Active rules are running on your checkout &amp; cart to convert COD shoppers into Prepaid UPI/Card buyers.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={onNavigateToSimulator}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test in Checkout Simulator</span>
          </button>

          <button
            onClick={onOpenCreateRule}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+ Create New Rule</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Prepaid Orders Share */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Prepaid Share</span>
            <span className="text-emerald-400 flex items-center gap-0.5 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +36.2%
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums">
              {analytics.prepaidRatio.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-mono tabular-nums">{analytics.prepaidOrders.toLocaleString()}</span> of{' '}
              <span className="font-mono tabular-nums">{analytics.totalOrders.toLocaleString()}</span> orders paid online
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${analytics.prepaidRatio}%` }}
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
              COD RTO dropped from <span className="font-mono text-red-400">{analytics.rtoRateWithoutOffer}%</span> to{' '}
              <span className="font-mono text-emerald-400">{analytics.rtoRateWithOffer}%</span>
            </p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            ~₹140 average two-way courier shipping saved per order
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
            Avg discount: ₹{(analytics.totalDiscountsDisbursed / analytics.prepaidOrders).toFixed(0)} / order
          </div>
        </div>

        {/* Metric 4: Net Merchant ROI */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Merchant Gain</span>
            <span className="text-emerald-400 text-xs font-semibold">+183% ROI</span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-300 tracking-tight tabular-nums">
              +₹{netMerchantSavings.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              RTO savings minus discounts given
            </p>
          </div>
          <div className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pure profit retained by business
          </div>
        </div>

      </div>

      {/* Main Row: Rules Status & COD vs Prepaid Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Rules quick list (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <span>Active Prepaid Offer Rules</span>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-medium">
                  {activeRulesCount} of {rules.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                These rules trigger discounts dynamically when shoppers choose prepaid methods.
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

          <div className="space-y-2.5">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  rule.isActive
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white truncate">{rule.name}</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 shrink-0">
                        {rule.discountType === 'percentage'
                          ? `${rule.discountValue}% OFF (Max ₹${rule.maxDiscountAmount || 0})`
                          : rule.discountType === 'fixed_amount'
                          ? `₹${rule.discountValue} Flat OFF`
                          : 'Free Shipping'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Min Order: <strong className="text-slate-300 font-mono">₹{rule.minOrderValue}</strong></span>
                      <span aria-hidden="true">&bull;</span>
                      <span>Gateways: <span className="text-slate-300">{rule.applicableGateways.join(', ')}</span></span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="text-slate-400 truncate max-w-[200px]">{rule.badgeText}</span>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle rule status"
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
            <span>Rules are evaluated in order of priority on checkout.</span>
            <button
              onClick={onOpenCreateRule}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              + Add another offer rule
            </button>
          </div>
        </div>

        {/* Right Column: Conversion Comparison & Deployment Card */}
        <div className="space-y-6">
          
          {/* COD vs Prepaid Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Payment Breakdown
            </h3>

            <div className="space-y-3">
              {/* Prepaid Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Prepaid (UPI / Cards)
                  </span>
                  <span className="font-mono text-white tabular-nums font-semibold">
                    {analytics.prepaidOrders.toLocaleString()} ({analytics.prepaidRatio.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analytics.prepaidRatio}%` }} />
                </div>
              </div>

              {/* COD Row */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Cash on Delivery (COD)
                  </span>
                  <span className="font-mono text-white tabular-nums font-semibold">
                    {analytics.codOrders.toLocaleString()} ({(100 - analytics.prepaidRatio).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${100 - analytics.prepaidRatio}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-400">RTO Impact Analysis:</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Before activating Prepaid Perks, 26.8% of COD orders were returned unopened. 
                With instant ₹50-₹100 prepaid discounts, buyers commit online, lowering delivery failures to 3.2%.
              </p>
            </div>
          </div>

          {/* Shopify & Vercel Quick Setup Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white">
                Shopify &amp; Vercel Integration
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Need to connect your GitHub repo, deploy to Vercel, or configure Shopify Partners Client ID?
            </p>
            <button
              onClick={onNavigateToIntegration}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors text-center"
            >
              Open Setup &amp; Deployment Hub &rarr;
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
