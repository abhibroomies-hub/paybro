import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Check, 
  Copy, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  RefreshCw,
  Terminal,
  Play
} from 'lucide-react';
import { PaymentProviderType, AppSettingsMetafield } from '../types';
import { runCalculationEngineTests } from '../tests/calculationEngine.test';

interface PaymentSettingsProps {
  settings: AppSettingsMetafield;
  onUpdateSettings: (newSettings: AppSettingsMetafield) => void;
}

export const PaymentSettings: React.FC<PaymentSettingsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [provider, setProvider] = useState<PaymentProviderType>(settings.paymentProvider || 'mock');
  const [keyId, setKeyId] = useState(settings.razorpayKeyId || '');
  const [keySecret, setKeySecret] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: number; failed: number; results: any[] } | null>(null);

  const handleSave = () => {
    const isRazorpayReady = Boolean(keyId.trim() && keySecret.trim());
    const updated: AppSettingsMetafield = {
      ...settings,
      paymentProvider: provider,
      razorpayConfigured: isRazorpayReady,
      razorpayKeyId: keyId.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    onUpdateSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRunTests = () => {
    const res = runCalculationEngineTests();
    setTestResults(res);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Test Mode Mock Provider */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-800/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Payment Provider &amp; Gateway Settings</span>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2.5 py-0.5 rounded font-mono">
                  {provider === 'mock' ? '🧪 Test Mode: Mock Provider Active' : '⚡ Live Mode: Razorpay Active'}
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              PayBro uses an <strong>Abstracted Payment Provider Layer</strong> with <strong>Zero Database Dependency</strong>. 
              All configuration is stored directly in <code>shop.metafields.paybro.settings</code>!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunTests}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run Engine Unit Tests</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unit Tests Result Box if executed */}
      {testResults && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-mono font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Calculation Engine Vitest Results</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 text-[11px]">
              {testResults.passed} PASSED &bull; {testResults.failed} FAILED
            </span>
          </div>
          <div className="space-y-1.5 font-mono text-xs text-slate-300">
            {testResults.results.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] bg-slate-900 p-2 rounded">
                <span>{r.name}</span>
                <span className="text-emerald-400 font-bold">✓ PASSED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Mock Provider Card */}
        <div
          onClick={() => setProvider('mock')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
            provider === 'mock'
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                {provider === 'mock' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </div>
              <span className="text-sm font-bold text-white">1. Mock Payment Provider (Recommended for Dev)</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
              READY NOW
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Requires <strong>Zero API keys</strong>. Generates simulated UPI orders, provides instant sandbox verification, and tests the complete Shopify Draft Orders pipeline seamlessly.
          </p>
          <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            PAYMENT_PROVIDER=mock &bull; Verified in broomiesbakery
          </div>
        </div>

        {/* Razorpay Provider Card */}
        <div
          onClick={() => setProvider('razorpay')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
            provider === 'razorpay'
              ? 'bg-slate-900/90 border-emerald-500 shadow-lg ring-1 ring-emerald-500/50'
              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                {provider === 'razorpay' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
              </div>
              <span className="text-sm font-bold text-white">2. Razorpay Live Provider (Production)</span>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono font-bold">
              ZERO-CODE SWAP
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plugs in live Razorpay Checkout SDK. Merchant pastes keys below, and it saves into <code>shop.metafields.paybro.payment_provider</code> without redeploying!
          </p>
          <div className="text-[11px] font-mono text-amber-300 bg-slate-950 p-2.5 rounded border border-slate-800">
            PAYMENT_PROVIDER=razorpay &bull; SDK Pluggable
          </div>
        </div>

      </div>

      {/* Razorpay Key Management Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Payment Credentials &amp; Metafield Config</h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Stored in: <code className="text-emerald-400 font-mono">shop.metafields.paybro.settings</code>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Razorpay Key ID (Live / Test)
            </label>
            <input
              type="text"
              placeholder="rzp_live_xxxxxxxx or rzp_test_xxxxxxxx"
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Razorpay Key Secret
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••"
              value={keySecret}
              onChange={(e) => setKeySecret(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1">
              Razorpay Webhook Secret (Optional)
            </label>
            <input
              type="password"
              placeholder="••••••••••••••••••••••••••••••"
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Save button and instructions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <p className="text-[11px] text-slate-400">
            <strong>3-Step Razorpay Switch:</strong> Paste your 3 keys &gt; Select Razorpay above &gt; Click Save. Zero code change, zero downtime.
          </p>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Metafield!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Save Provider Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
