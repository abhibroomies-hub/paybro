import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  Smartphone, 
  RotateCcw, 
  CreditCard, 
  ShoppingBag, 
  Truck, 
  ChevronRight,
  Info,
  ExternalLink,
  Plus,
  Minus
} from 'lucide-react';
import { PrepaidRule, BannerDesignConfig, CartProduct } from '../types';
import { SAMPLE_PRODUCTS } from '../data/mockData';

interface CheckoutSimulatorProps {
  rules: PrepaidRule[];
  bannerDesign: BannerDesignConfig;
}

export const CheckoutSimulator: React.FC<CheckoutSimulatorProps> = ({
  rules,
  bannerDesign,
}) => {
  const [simulatorView, setSimulatorView] = useState<'checkout' | 'cart' | 'product'>('checkout');
  const [selectedPayment, setSelectedPayment] = useState<'upi' | 'cards' | 'cod'>('upi');
  const [cartItems, setCartItems] = useState<CartProduct[]>(SAMPLE_PRODUCTS.slice(0, 2));
  const [activeRuleId, setActiveRuleId] = useState<string>(
    rules.find((r) => r.isActive)?.id || rules[0]?.id || ''
  );

  const activeRule = rules.find((r) => r.id === activeRuleId) || rules[0];

  // Calculate cart subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Check if minimum order value is met
  const isMinOrderMet = activeRule ? subtotal >= activeRule.minOrderValue : true;

  // Calculate prepaid discount
  let discountAmount = 0;
  if (activeRule && activeRule.isActive && (selectedPayment === 'upi' || selectedPayment === 'cards') && isMinOrderMet) {
    if (activeRule.discountType === 'percentage') {
      const calculated = (subtotal * activeRule.discountValue) / 100;
      discountAmount = activeRule.maxDiscountAmount ? Math.min(calculated, activeRule.maxDiscountAmount) : calculated;
    } else if (activeRule.discountType === 'fixed_amount') {
      discountAmount = activeRule.discountValue;
    }
  }

  const codFee = selectedPayment === 'cod' ? (activeRule?.codExtraFee || 50) : 0;
  const shippingFee = (activeRule?.discountType === 'free_shipping' && selectedPayment !== 'cod') ? 0 : (subtotal > 999 ? 0 : 70);
  const finalTotal = subtotal - discountAmount + codFee + shippingFee;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartProduct[]
    );
  };

  const resetCart = () => {
    setCartItems(SAMPLE_PRODUCTS.slice(0, 2));
    setSelectedPayment('upi');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Simulation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Interactive Shopify Checkout &amp; Storefront Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how customers see and interact with your prepaid offer at Checkout, Cart Drawer, and Product page.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSimulatorView('checkout')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              simulatorView === 'checkout'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shopify Checkout (Payment)
          </button>
          <button
            onClick={() => setSimulatorView('cart')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              simulatorView === 'cart'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cart Drawer
          </button>
          <button
            onClick={() => setSimulatorView('product')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              simulatorView === 'product'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Page
          </button>
        </div>
      </div>

      {/* Simulator Control Strip */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400">Simulating Rule:</span>
          <select
            value={activeRuleId}
            onChange={(e) => setActiveRuleId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-emerald-500 font-medium"
          >
            {rules.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} {!r.isActive ? '(Inactive)' : ''}
              </option>
            ))}
          </select>

          <span className="text-slate-500">|</span>

          <span className="text-slate-400">Cart Items Subtotal:</span>
          <span className="font-mono font-bold text-white tabular-nums text-sm">
            ₹{subtotal.toLocaleString()}
          </span>

          {!isMinOrderMet && (
            <span className="text-amber-400 text-[11px] bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
              Below Min Order (₹{activeRule?.minOrderValue})
            </span>
          )}
        </div>

        <button
          onClick={resetCart}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Cart</span>
        </button>
      </div>

      {/* VIEW 1: SHOPIFY CHECKOUT SIMULATOR */}
      {simulatorView === 'checkout' && (
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden text-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Column: Checkout Payment Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200">
            
            {/* Shopify Checkout Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-slate-900 text-base">FASHION BAZAAR</span>
                <span className="text-[11px] text-slate-400 font-mono">checkout.myshopify.com</span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span>Information</span>
                <ChevronRight className="w-3 h-3" />
                <span>Shipping</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-bold text-slate-900">Payment</span>
              </div>
            </div>

            {/* Customer Summary Box */}
            <div className="border border-slate-200 rounded-lg p-3 text-xs space-y-2 bg-slate-50 text-slate-600">
              <div className="flex justify-between items-center">
                <span><strong className="text-slate-700">Contact:</strong> rahul.sharma@example.com</span>
                <span className="text-emerald-700 font-medium cursor-pointer">Change</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span><strong className="text-slate-700">Ship to:</strong> 402, Green Glen Layout, Bellandur, Bengaluru 560103</span>
                <span className="text-emerald-700 font-medium cursor-pointer">Change</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                <span><strong className="text-slate-700">Shipping:</strong> Standard Express Delivery &bull; ₹{shippingFee === 0 ? 'FREE' : shippingFee}</span>
                <span className="text-emerald-700 font-medium cursor-pointer">Change</span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Payment Method</h3>
                <p className="text-xs text-slate-500">All transactions are secure and encrypted.</p>
              </div>

              {/* PAYMENT SELECTION OPTIONS */}
              <div className="border border-slate-300 rounded-xl overflow-hidden divide-y divide-slate-200">
                
                {/* OPTION 1: UPI / Online Prepaid (With Offer Highlight!) */}
                <div
                  onClick={() => setSelectedPayment('upi')}
                  className={`p-4 transition-colors cursor-pointer ${
                    selectedPayment === 'upi' ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'upi'}
                        onChange={() => setSelectedPayment('upi')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">
                            UPI &bull; Google Pay, PhonePe, Paytm, BHIM
                          </span>
                          <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                            RECOMMENDED
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Instant zero-fee payment with UPI QR or App.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                        SAVE ₹{discountAmount > 0 ? discountAmount : (activeRule?.discountValue || 50)}
                      </span>
                    </div>
                  </div>

                  {/* ACTIVE PREPAID OFFER BANNER (CHECKOUT EXTENSION RENDER) */}
                  {selectedPayment === 'upi' && activeRule && activeRule.isActive && (
                    <div className="mt-3 bg-emerald-900 text-white p-3 rounded-lg flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⚡</span>
                        <div>
                          <div className="font-bold text-amber-300">{activeRule.badgeText}</div>
                          <div className="text-[11px] text-emerald-100">{activeRule.nudgeMessage}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-amber-300 text-sm">
                          -₹{discountAmount}
                        </div>
                        <div className="text-[10px] text-emerald-200">Auto-Applied</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OPTION 2: Credit / Debit Cards (Prepaid) */}
                <div
                  onClick={() => setSelectedPayment('cards')}
                  className={`p-4 transition-colors cursor-pointer ${
                    selectedPayment === 'cards' ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'cards'}
                        onChange={() => setSelectedPayment('cards')}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          Credit &amp; Debit Cards (Razorpay / PayU)
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Visa, MasterCard, RuPay, Maestro.
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* OPTION 3: Cash on Delivery (COD) */}
                <div
                  onClick={() => setSelectedPayment('cod')}
                  className={`p-4 transition-colors cursor-pointer ${
                    selectedPayment === 'cod' ? 'bg-amber-50/70 border-l-4 border-l-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === 'cod'}
                        onChange={() => setSelectedPayment('cod')}
                        className="mt-1 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-mono font-medium">
                            +₹{activeRule?.codExtraFee || 50} Handling
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Pay cash at doorstep upon physical arrival.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COD ANTI-DROP WARNING NUDGE */}
                  {selectedPayment === 'cod' && (
                    <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg text-xs space-y-2">
                      <div className="flex items-start gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Warning: You will miss instant savings!</strong>
                          <p className="text-[11px] text-red-700 mt-0.5">
                            Switching to UPI gives you an instant discount plus zero COD handling fee!
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPayment('upi');
                        }}
                        className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>⚡ Switch to UPI &amp; Save ₹{(activeRule?.discountValue || 50) + (activeRule?.codExtraFee || 50)} Now!</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={() => alert(`Simulated Order Placed via ${selectedPayment.toUpperCase()}! Total: ₹${finalTotal}`)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>PAY ₹{finalTotal.toLocaleString()} &bull; COMPLETE ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Order Summary ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-slate-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono">₹{item.price} each</div>
                        {/* Adjuster */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-slate-800 text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-5 h-5 rounded bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon / Discount code input placeholder */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Discount code (Auto-applied for Prepaid)"
                  disabled
                  value={discountAmount > 0 ? "PREPAID_PERK_AUTO" : ""}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-mono"
                />
                <button
                  disabled
                  className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-lg text-xs font-medium cursor-not-allowed"
                >
                  Apply
                </button>
              </div>

              {/* Price Calculation breakdown */}
              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums">₹{subtotal.toLocaleString()}</span>
                </div>

                {/* Prepaid Discount Line item */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700 bg-emerald-100/70 p-2 rounded-lg font-medium">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{activeRule?.badgeText || 'Prepaid Perk Discount'}</span>
                    </span>
                    <span className="font-mono font-bold tabular-nums">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {/* COD Handling Fee Line */}
                {codFee > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>COD Processing Fee</span>
                    <span className="font-mono font-semibold tabular-nums">+₹{codFee}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-mono text-slate-900 tabular-nums">
                    {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}
                  </span>
                </div>
              </div>

              {/* Final Total */}
              <div className="border-t-2 border-slate-300 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm text-slate-900">Total</span>
                  <p className="text-[10px] text-slate-500">Including taxes &bull; INR</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-slate-950 tabular-nums">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                  {discountAmount > 0 && (
                    <div className="text-[11px] font-semibold text-emerald-600">
                      You saved ₹{discountAmount} today!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Trust badge */}
            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 border-t border-slate-200 pt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Shopify Secure Checkout</span>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: CART DRAWER SIMULATOR */}
      {simulatorView === 'cart' && (
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden text-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Your Cart ({cartItems.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Cart Drawer Preview</span>
          </div>

          {/* PREPAID PROGRESS UNLOCK BAR */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <span>⚡</span>
                <span>Prepaid Savings Progress</span>
              </span>
              <span className="text-emerald-700 font-semibold font-mono">
                {isMinOrderMet ? 'Unlocked!' : `Add ₹${Math.max(0, (activeRule?.minOrderValue || 499) - subtotal)} more`}
              </span>
            </div>

            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / (activeRule?.minOrderValue || 499)) * 100)}%` }}
              />
            </div>

            <p className="text-[11px] text-emerald-800">
              {isMinOrderMet
                ? `🎉 Awesome! You've unlocked instant discount on UPI/Online Payment at checkout!`
                : `Add items worth ₹${(activeRule?.minOrderValue || 499) - subtotal} to unlock 10% instant UPI discount!`}
            </p>
          </div>

          {/* Cart items */}
          <div className="space-y-3 divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800 line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">₹{item.price} &times; {item.quantity}</div>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Cart Drawer Checkout Button */}
          <button
            onClick={() => setSimulatorView('checkout')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout &bull; ₹{subtotal.toLocaleString()}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW 3: PRODUCT PAGE OFFER TAG SIMULATOR */}
      {simulatorView === 'product' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden text-slate-800 p-6 space-y-6">
          <div className="text-xs text-slate-400 font-mono border-b border-slate-200 pb-2">
            Storefront Product Page Widget Preview
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-950 rounded-xl p-6 flex items-center justify-center border border-slate-200">
              <img 
                src={SAMPLE_PRODUCTS[0].image} 
                alt="Product" 
                className="w-48 h-48 object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">In Stock &bull; Ready to Ship</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Oversized Streetwear Heavyweight Tee</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-bold font-mono text-slate-900">₹899</span>
                  <span className="text-xs text-slate-400 line-through font-mono">₹1,499</span>
                  <span className="text-xs text-emerald-700 font-semibold">(40% OFF)</span>
                </div>
              </div>

              {/* PRODUCT PAGE OFFER BADGE WIDGET */}
              <div className="bg-emerald-950 text-white p-3.5 rounded-xl border border-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <span>⚡</span>
                  <span>{activeRule?.badgeText || 'Pay Online & Save ₹90'}</span>
                </div>
                <p className="text-[11px] text-emerald-100">
                  Select UPI, Google Pay or Card at checkout to instantly pay <strong className="text-white font-mono">₹809</strong> instead of ₹899!
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSimulatorView('checkout')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition-colors"
                >
                  BUY NOW WITH PREPAID DISCOUNT
                </button>
                <button
                  onClick={() => setSimulatorView('cart')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold text-xs transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
