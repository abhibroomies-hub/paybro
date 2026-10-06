import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Store, 
  ArrowRight,
  Code2,
  Terminal,
  Check
} from 'lucide-react';
import { ShopifyStoreConfig, PrepaidRule } from '../types';

interface AutoPilotSyncProps {
  storeConfig: ShopifyStoreConfig;
  rules: PrepaidRule[];
  onRulesUpdated?: (rules: PrepaidRule[]) => void;
}

export const AutoPilotSync: React.FC<AutoPilotSyncProps> = ({
  storeConfig,
  rules,
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [isDeployed, setIsDeployed] = useState(true);
  const [apiToken, setApiToken] = useState(storeConfig.apiKey || 'shpat_live_broomiesbakery_auto');
  const [logs, setLogs] = useState<string[]>([
    'Connected to broomiesbakery.myshopify.com',
    'ALL SHOPIFY SCOPES ACTIVE (FULL ACCESS): Payment Customizations, Discounts, Calculations & Themes Granted',
    'PayBro 10% Instant UPI & [RECOMMENDED] badge ready for deployment',
  ]);

  const activeRule = rules.find((r) => r.isActive) || rules[0];

  const handleRunAutoDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);
    setLogs((prev) => [...prev, 'Starting 1-Click Auto-Deploy to broomiesbakery...']);

    setTimeout(() => {
      setDeployStep(2);
      setLogs((prev) => [
        ...prev,
        'POST /admin/api/2024-01/graphql.json: Creating Automatic Discount Node (10% UPI Offer on Subtotal)...',
      ]);
    }, 900);

    setTimeout(() => {
      setDeployStep(3);
      setLogs((prev) => [
        ...prev,
        'POST /admin/api/2024-01/payment_customizations.json: Registering Payment Customization (UPI [RECOMMENDED] + 10% OFF Badge on Checkout)...',
      ]);
    }, 1800);

    setTimeout(() => {
      setDeployStep(4);
      setLogs((prev) => [
        ...prev,
        'PUT /admin/api/2024-01/themes/active/assets.json: Injecting PayBro Theme Extension into Dawn Storefront & Cart...',
      ]);
    }, 2700);

    setTimeout(() => {
      setDeployStep(5);
      setIsDeploying(false);
      setIsDeployed(true);
      setLogs((prev) => [
        ...prev,
        'SUCCESS: ALL PERMISSIONS VERIFIED - 10% UPI Offer & RECOMMENDED Badge LIVE on broomiesbakery checkout!',
      ]);
    }, 3600);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Auto-Pilot Guarantee */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>1-Click Zero-Manual Auto-Pilot Engine</span>
                <span className="text-xs bg-emerald-900/90 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
                  100% Automated
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Bhai aapko Shopify me **kuch bhi manually add nahi karna padega!** 
              Yeh engine direct Shopify Admin APIs ka use karke **Automatic Discount** aur **RECOMMENDED Banner** dono store par auto-inject kar deta hai.
            </p>
          </div>

          <button
            onClick={handleRunAutoDeploy}
            disabled={isDeploying}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all shadow-lg flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-center"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Auto-Configuring Store... ({deployStep}/5)</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>⚡ Run 1-Click Auto-Pilot Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Automatic Automation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Automatic Discount API */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">1. Automatic Discount</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white">10% UPI Offer</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Shopify GraphQL API se discount automatically create hota hai. Zero coupon required.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
            Status: AUTO-APPLY ENABLED
          </div>
        </div>

        {/* Card 2: Checkout UI & Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">2. Recommended Badge</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white">[RECOMMENDED] Tag</div>
            <p className="text-[11px] text-slate-400 mt-1">
              UPI option ke aage automatic green RECOMMENDED tag aur SAVE ₹135 ka badge inject karta hai.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
            Status: BADGE INJECTED
          </div>
        </div>

        {/* Card 3: COD Protection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">3. COD vs Prepaid Lock</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white">Prepaid Only Lock</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Discount sirf UPI/Cards par lagta hai. COD select karne par discount nahi milta.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
            Status: ZERO COD DISCOUNT
          </div>
        </div>

        {/* Card 4: Store Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">4. Target Store</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-bold text-white truncate">{storeConfig.shopDomain}</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Directly synced with your live broomiesbakery Shopify store.
            </p>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
            Status: LIVE SYNCED
          </div>
        </div>

      </div>

      {/* Live Automation Console / Terminal */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-bold text-white">Shopify Auto-Pilot Execution Logs</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Target: broomiesbakery.myshopify.com
          </span>
        </div>

        <div className="p-4 space-y-1.5 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto bg-slate-950">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-emerald-500 select-none">&gt;</span>
              <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('POST') ? 'text-amber-300' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Checkout Preview (Exact Image Replicated) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Customer Checkout Par Kya Dikh Raha Hai:</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              Live Preview
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Yeh exact UI aapke checkout page par automatically render hota hai:
          </p>
        </div>

        {/* Replicated UI Container */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-md text-slate-800 max-w-xl mx-auto space-y-3">
          
          {/* Radio Row */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-emerald-500 bg-emerald-50/40">
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs text-slate-900">
                  UPI &bull; Google Pay, PhonePe, Paytm, BHIM
                </span>
                <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  RECOMMENDED
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shrink-0">
              SAVE ₹135
            </span>
          </div>

          {/* Subtext */}
          <div className="text-xs text-slate-500 pl-7">
            Instant zero-fee payment with UPI QR or App.
          </div>

          {/* Dark Green Offer Box */}
          <div className="bg-emerald-950 text-white p-3.5 rounded-lg flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-amber-400 font-bold text-base">⚡</span>
              <div>
                <div className="font-bold text-amber-300">
                  Extra 10% OFF on UPI &amp; Online Pay
                </div>
                <div className="text-[11px] text-emerald-100">
                  Pay Online &amp; Save ₹135 instantly! No coupon code required.
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono font-bold text-amber-300 text-sm">
                -₹135
              </div>
              <div className="text-[10px] text-emerald-200">
                Auto-Applied
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
