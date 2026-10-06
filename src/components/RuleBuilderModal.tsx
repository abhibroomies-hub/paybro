import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Percent, 
  IndianRupee, 
  Truck, 
  Check, 
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { PrepaidRule, DiscountType, PaymentGatewayId } from '../types';

interface RuleBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (rule: PrepaidRule) => void;
  ruleToEdit?: PrepaidRule | null;
}

const AVAILABLE_GATEWAYS: { id: PaymentGatewayId; label: string; sub: string }[] = [
  { id: 'all_prepaid', label: 'All Prepaid Gateways', sub: 'UPI, Cards, NetBanking, Wallets' },
  { id: 'upi', label: 'UPI Direct', sub: 'PhonePe, GPay, Paytm, BHIM' },
  { id: 'cards', label: 'Credit & Debit Cards', sub: 'Visa, Mastercard, RuPay' },
  { id: 'razorpay', label: 'Razorpay Gateway', sub: 'Razorpay Standard Checkout' },
  { id: 'phonepe', label: 'PhonePe PG', sub: 'PhonePe Payment Gateway' },
  { id: 'paytm', label: 'Paytm Payment Gateway', sub: 'Paytm PG / All-in-One' },
  { id: 'cashfree', label: 'Cashfree Payments', sub: 'Cashfree Gateway' },
  { id: 'netbanking', label: 'NetBanking', sub: 'All Indian Banks' },
];

export const RuleBuilderModal: React.FC<RuleBuilderModalProps> = ({
  isOpen,
  onClose,
  onSaveRule,
  ruleToEdit,
}) => {
  const [name, setName] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(150);
  const [minOrderValue, setMinOrderValue] = useState<number>(499);
  const [customerEligibility, setCustomerEligibility] = useState<'all' | 'new_customers' | 'returning_customers'>('all');
  const [applicableGateways, setApplicableGateways] = useState<PaymentGatewayId[]>(['all_prepaid', 'upi', 'razorpay']);
  const [nudgeMessage, setNudgeMessage] = useState('Pay Online & Save ₹100 instantly! No coupon code required.');
  const [codExtraFee, setCodExtraFee] = useState<number>(50);
  const [placements, setPlacements] = useState({
    cartDrawer: true,
    productPage: true,
    checkoutPaymentStep: true,
    stickyCheckoutBar: true,
  });

  useEffect(() => {
    if (ruleToEdit) {
      setName(ruleToEdit.name);
      setBadgeText(ruleToEdit.badgeText);
      setDiscountType(ruleToEdit.discountType);
      setDiscountValue(ruleToEdit.discountValue);
      setMaxDiscountAmount(ruleToEdit.maxDiscountAmount || 0);
      setMinOrderValue(ruleToEdit.minOrderValue);
      setCustomerEligibility(ruleToEdit.customerEligibility);
      setApplicableGateways(ruleToEdit.applicableGateways);
      setNudgeMessage(ruleToEdit.nudgeMessage);
      setCodExtraFee(ruleToEdit.codExtraFee || 50);
      setPlacements(ruleToEdit.placements);
    } else {
      // Default reset
      setName('Flat 10% OFF on UPI & Online Pay');
      setBadgeText('⚡ Extra 10% OFF on UPI & Online Pay');
      setDiscountType('percentage');
      setDiscountValue(10);
      setMaxDiscountAmount(150);
      setMinOrderValue(499);
      setCustomerEligibility('all');
      setApplicableGateways(['all_prepaid', 'upi', 'razorpay']);
      setNudgeMessage('Pay Online & Save ₹100 instantly! No coupon code required.');
      setCodExtraFee(50);
      setPlacements({
        cartDrawer: true,
        productPage: true,
        checkoutPaymentStep: true,
        stickyCheckoutBar: true,
      });
    }
  }, [ruleToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleGateway = (gwId: PaymentGatewayId) => {
    if (applicableGateways.includes(gwId)) {
      if (applicableGateways.length > 1) {
        setApplicableGateways(applicableGateways.filter((g) => g !== gwId));
      }
    } else {
      setApplicableGateways([...applicableGateways, gwId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: PrepaidRule = {
      id: ruleToEdit ? ruleToEdit.id : `rule-${Date.now()}`,
      name: name.trim() || 'Prepaid Discount Rule',
      badgeText: badgeText.trim() || '⚡ Pay Online & Save',
      discountType,
      discountValue: Number(discountValue) || 0,
      maxDiscountAmount: discountType === 'percentage' ? (Number(maxDiscountAmount) || undefined) : undefined,
      minOrderValue: Number(minOrderValue) || 0,
      customerEligibility,
      applicableGateways,
      placements,
      isActive: true,
      priority: ruleToEdit ? ruleToEdit.priority : 1,
      nudgeMessage: nudgeMessage.trim(),
      codExtraFee: Number(codExtraFee) || 0,
      createdAt: ruleToEdit ? ruleToEdit.createdAt : new Date().toISOString().split('T')[0],
    };
    onSaveRule(newRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{ruleToEdit ? 'Edit Offer Rule' : 'Create Prepaid Offer Rule'}</span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.5 rounded">
                Shopify Function Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Set discount criteria, eligible payment methods, and checkout placement.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: Rule Name & Badge */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-slate-400">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Rule Title (Internal Reference)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 10% UPI & Razorpay Prepaid Discount"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Display Badge Text (Seen by Customer in Checkout &amp; Cart)</span>
                <span className="text-slate-500 text-[11px]">Keep short and punchy</span>
              </label>
              <input
                type="text"
                required
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="e.g. ⚡ Extra 10% OFF on UPI & Online Pay"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Discount Logic */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-slate-400">
              2. Discount Calculation
            </h3>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType('percentage')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  discountType === 'percentage'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Percent className="w-4 h-4" />
                <span className="font-semibold">Percentage (%)</span>
                <span className="text-[10px] text-slate-400">e.g. 10% OFF</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType('fixed_amount')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  discountType === 'fixed_amount'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                <span className="font-semibold">Flat Amount (₹)</span>
                <span className="text-[10px] text-slate-400">e.g. Flat ₹50 OFF</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType('free_shipping')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  discountType === 'free_shipping'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="font-semibold">Free Shipping</span>
                <span className="text-[10px] text-slate-400">Prepaid Only</span>
              </button>
            </div>

            {/* Discount Value Inputs */}
            {discountType !== 'free_shipping' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Flat Discount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={discountType === 'percentage' ? 100 : 10000}
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Max Discount Cap (₹) (Optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      placeholder="e.g. 150"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Min Cart Value */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Minimum Cart Value (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  placeholder="e.g. 499"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Rule applies only if cart subtotal is &ge; this value
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  COD Handling Fee to Highlight (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={codExtraFee}
                  onChange={(e) => setCodExtraFee(Number(e.target.value))}
                  placeholder="e.g. 50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Shown to customer if they switch to Cash on Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Target Payment Gateways */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-slate-400">
              3. Applicable Payment Gateways
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_GATEWAYS.map((gw) => {
                const isSelected = applicableGateways.includes(gw.id);
                return (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => toggleGateway(gw.id)}
                    className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-colors ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/80 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs leading-none">{gw.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{gw.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Display Placements */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider text-slate-400">
              4. Display Surfaces
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.checkoutPaymentStep}
                  onChange={(e) =>
                    setPlacements({ ...placements, checkoutPaymentStep: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="font-medium text-slate-200">Shopify Checkout Payment Step</div>
                  <div className="text-[10px] text-slate-400">Shopify Checkout UI Extension (Shopify 2024+)</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.cartDrawer}
                  onChange={(e) =>
                    setPlacements({ ...placements, cartDrawer: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="font-medium text-slate-200">Cart Drawer &amp; Cart Page</div>
                  <div className="text-[10px] text-slate-400">Banner with savings unlock bar</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.productPage}
                  onChange={(e) =>
                    setPlacements({ ...placements, productPage: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="font-medium text-slate-200">Product Page Offer Tag</div>
                  <div className="text-[10px] text-slate-400">Renders below &quot;Buy It Now&quot; button</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.stickyCheckoutBar}
                  onChange={(e) =>
                    setPlacements({ ...placements, stickyCheckoutBar: e.target.checked })
                  }
                  className="rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <div>
                  <div className="font-medium text-slate-200">Sticky Bottom Offer Banner</div>
                  <div className="text-[10px] text-slate-400">High-converting mobile floating pill</div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 5: Nudge copy */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-slate-300 font-medium">
              Checkout Urgency Nudge Message
            </label>
            <input
              type="text"
              value={nudgeMessage}
              onChange={(e) => setNudgeMessage(e.target.value)}
              placeholder="e.g. Pay Online & Save ₹100 instantly! No coupon code required."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{ruleToEdit ? 'Update Rule' : 'Save & Activate Rule'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
