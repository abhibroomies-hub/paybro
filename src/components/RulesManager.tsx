import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Percent, 
  IndianRupee, 
  Truck,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { PrepaidRule } from '../types';

interface RulesManagerProps {
  rules: PrepaidRule[];
  onToggleRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onDuplicateRule: (rule: PrepaidRule) => void;
  onEditRule: (rule: PrepaidRule) => void;
  onOpenCreateModal: () => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
  rules,
  onToggleRule,
  onDeleteRule,
  onDuplicateRule,
  onEditRule,
  onOpenCreateModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.badgeText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.applicableGateways.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'active') return matchesSearch && r.isActive;
    if (filterStatus === 'inactive') return matchesSearch && !r.isActive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Prepaid Offer Rules</span>
            <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded font-normal">
              {rules.length} Rules Configured
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create custom discounts that apply automatically when buyers choose online payment methods.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Rule</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules by name, gateway, or badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({rules.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterStatus === 'active'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active ({rules.filter((r) => r.isActive).length})
          </button>
          <button
            onClick={() => setFilterStatus('inactive')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              filterStatus === 'inactive'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paused ({rules.filter((r) => !r.isActive).length})
          </button>
        </div>
      </div>

      {/* Rules Table / Cards */}
      {filteredRules.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No rules matched your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new prepaid offer rule for your checkout.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Offer Rule</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRules.map((rule, idx) => (
            <div
              key={rule.id}
              className={`bg-slate-900 border rounded-xl p-4.5 transition-all ${
                rule.isActive
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Info */}
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center font-bold">
                      #{idx + 1}
                    </span>
                    <h3 className="font-semibold text-sm text-white">{rule.name}</h3>

                    {/* Discount Badge */}
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center gap-1">
                      {rule.discountType === 'percentage' && <Percent className="w-3 h-3" />}
                      {rule.discountType === 'fixed_amount' && <IndianRupee className="w-3 h-3" />}
                      {rule.discountType === 'free_shipping' && <Truck className="w-3 h-3" />}
                      {rule.discountType === 'percentage'
                        ? `${rule.discountValue}% OFF (Max ₹${rule.maxDiscountAmount || 0})`
                        : rule.discountType === 'fixed_amount'
                        ? `₹${rule.discountValue} Flat Discount`
                        : 'Free Shipping'}
                    </span>

                    {/* Status Pill */}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        rule.isActive
                          ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.isActive ? 'Active on Checkout' : 'Paused'}
                    </span>
                  </div>

                  {/* Customer Badge Preview */}
                  <div className="text-xs text-slate-300 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">Customer Sees:</span>
                    <span className="font-medium text-emerald-400">{rule.badgeText}</span>
                  </div>

                  {/* Criteria Metadata */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 pt-0.5">
                    <span>
                      Min Cart: <strong className="text-slate-200 font-mono">₹{rule.minOrderValue}</strong>
                    </span>
                    <span aria-hidden="true">&bull;</span>
                    <span>
                      Gateways:{' '}
                      <span className="text-slate-300">
                        {rule.applicableGateways.join(', ')}
                      </span>
                    </span>
                    <span aria-hidden="true">&bull;</span>
                    <span>
                      Placements:{' '}
                      <span className="text-slate-300">
                        {[
                          rule.placements.checkoutPaymentStep ? 'Checkout' : null,
                          rule.placements.cartDrawer ? 'Cart' : null,
                          rule.placements.productPage ? 'Product Page' : null,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  
                  {/* Active Toggle Switch */}
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {rule.isActive ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.isActive ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      aria-label="Toggle rule"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.isActive ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => onEditRule(rule)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Rule"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Duplicate Button */}
                  <button
                    onClick={() => onDuplicateRule(rule)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Duplicate Rule"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper callout & Checkout Activation Guide */}
      <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <span>⚡ Shopify Checkout Page par Discount Kaise Dikhega (Sabse Zaroori Step):</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Shopify ka checkout private hota hai. Dashboard me rule ON karne ke baad, discount ko checkout par minus karne ke 2 standard tarike hain:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">A</span>
              Shopify Admin me &quot;Automatic Discount&quot; (Instant 1-Minute Fix)
            </div>
            <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px]">
              <li>Shopify Admin ke left menu me <strong>Discounts</strong> par click karein.</li>
              <li><strong>Create discount</strong> &rarr; <strong>Amount off order</strong> select karein.</li>
              <li>Upar <strong>&quot;Automatic discount&quot;</strong> select karein (taaki customer ko code na dalna pade).</li>
              <li>Title: <code className="text-emerald-400">⚡ Instant 10% UPI &amp; Online Pay</code></li>
              <li>Percentage: <code className="text-emerald-400">10%</code>, Minimum amount: <code className="text-emerald-400">₹499</code>.</li>
              <li><strong>Save discount</strong> dabayein &rarr; Checkout par turant discount minus ho jayega!</li>
            </ol>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">B</span>
              Shopify Checkout Editor me Banner Lagana
            </div>
            <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px]">
              <li>Shopify Admin me <strong>Settings ⚙️ &rarr; Checkout</strong> par jayein.</li>
              <li>&quot;Checkout customization&quot; ke andar <strong>Customize</strong> par click karein.</li>
              <li>Payment section ke paas <strong>Add app block</strong> &rarr; PayBro Banner choose karein.</li>
              <li>Upar <strong>Save</strong> kar dein!</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};
