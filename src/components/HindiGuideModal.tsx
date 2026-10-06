import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  Terminal, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  Settings
} from 'lucide-react';

interface HindiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const HindiGuideModal: React.FC<HindiGuideModalProps> = ({
  isOpen,
  onClose,
  appUrl,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'checkout' | 'faq'>('overview');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Shopify Prepaid Offer App Complete Guide
                <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                  Hindi / Hinglish Roadmap
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                GitHub → Vercel → Shopify Partner Dev → Checkout Functions me offer lagana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Architecture &amp; Motive
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'steps'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Vercel &amp; Shopify Partner Steps
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'checkout'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Checkout Per Offer Kaise Dikhana Hai?
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'faq'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Common Doubts &amp; Solutions
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-slate-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
                <h3 className="font-semibold text-emerald-300 text-base mb-1">
                  Bhai aapka motive 100% sahi hai: Prepaid Discounts = Low RTO &amp; High Profit!
                </h3>
                <p className="text-xs text-slate-300">
                  India me D2C e-commerce brands ka sabse bada headache <strong>COD RTO (Return To Origin)</strong> hota hai, 
                  jaha 25% se 35% COD orders cancel ho jate hain aur merchant ko dono side ka courier charge (₹120-₹150) lagta hai. 
                  Jab aap customer ko Checkout ya Cart me <strong>"Flat ₹50 OFF"</strong> ya <strong>"10% Instant Discount on UPI"</strong> dikhate ho, 
                  toh 60-70% customers COD chhodkar turant Prepaid select karte hain!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-emerald-400 font-semibold mb-1 flex items-center gap-1.5 text-xs">
                    <Zap className="w-4 h-4" />
                    Part A: App Dashboard
                  </div>
                  <p className="text-xs text-slate-400">
                    Yeh React/Vercel application jaha aap login karke rules set karte ho (e.g. 10% on UPI, Min order ₹499, Active/Inactive).
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-blue-400 font-semibold mb-1 flex items-center gap-1.5 text-xs">
                    <Globe className="w-4 h-4" />
                    Part B: Shopify Partners App
                  </div>
                  <p className="text-xs text-slate-400">
                    Shopify Partner me create hota hai jisse Client ID &amp; API Secret milti hai, jisse merchant ke Shopify store me App install hota hai.
                  </p>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-lg">
                  <div className="text-amber-400 font-semibold mb-1 flex items-center gap-1.5 text-xs">
                    <Settings className="w-4 h-4" />
                    Part C: Checkout &amp; Theme Extension
                  </div>
                  <p className="text-xs text-slate-400">
                    Shopify Functions + Checkout UI Extension ya Theme Liquid Snippet jo customer ko checkout/cart me offer dikhata hai aur amount minus karta hai.
                  </p>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950 p-4 rounded-xl space-y-2">
                <div className="text-xs font-semibold text-slate-200">Shopify Ecosystem Flow Diagram:</div>
                <div className="text-xs font-mono bg-slate-900 p-3 rounded text-slate-300 overflow-x-auto whitespace-pre">
{`Merchant sets Rule in Dashboard (e.g. "10% off on UPI")
          ↓ (Saved in Database / App Backend)
Shopify Store Customer adds item to Cart (₹999)
          ↓
[Cart / Product Nudge]: "Pay Online & Save ₹100!"
          ↓
Customer goes to Checkout → Selects Razorpay / UPI
          ↓
[Shopify Function / UI Extension]: Automatically applies ₹100 discount!
          ↓
Customer pays ₹899 → Zero RTO Risk → 100% Prepaid Conversion!`}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                Aapne jo process bataya (GitHub push → Vercel deploy → Shopify Dev app create), wahi exact professional way hai. Yaha 4 practical steps hain:
              </div>

              {/* Step 1 */}
              <div className="border border-slate-800 bg-slate-950/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">1</span>
                    GitHub Repository &amp; Vercel Deployment
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">1-Click Ready</span>
                </div>
                <p className="text-xs text-slate-300">
                  Aap is app ke pure code ko apne GitHub repository me push karein. Fir Vercel.com me jake <strong>"Add New Project"</strong> par click karke GitHub repo select karein.
                </p>
                <div className="bg-slate-900 p-2.5 rounded text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Build Command: npm run build &bull; Output Directory: dist</span>
                  <button 
                    onClick={() => handleCopy('npm run build', 'build-cmd')}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    {copiedKey === 'build-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-800 bg-slate-950/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">2</span>
                    Shopify Partner Dashboard me App Create Karna
                  </div>
                  <span className="text-[11px] text-blue-400 font-mono">partners.shopify.com</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li><strong>partners.shopify.com</strong> par jao → <strong>Apps</strong> → <strong>Create app</strong> → <strong>Create app manually</strong>.</li>
                  <li>App name enter karo: <em>Prepaid Perks - Payment Offers</em>.</li>
                  <li><strong>App URL</strong> me apna Vercel URL dalo (e.g. <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">https://your-app.vercel.app</code>).</li>
                  <li><strong>Allowed redirection URL(s)</strong> me dalo: <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">https://your-app.vercel.app/api/auth/callback</code>.</li>
                  <li><strong>Embedded in Shopify admin:</strong> Make sure yeh <strong>Enabled / ON</strong> rahe! Isse hi Shopify Admin ke left menu me app par click karne par yeh dashboard Shopify ke andar khulega.</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-800 bg-slate-950/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">3</span>
                    API Credentials &amp; Scopes Setup
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">Checkout &amp; Calculation Scopes</span>
                </div>
                <p className="text-xs text-slate-300">
                  Shopify Partner me <strong>App setup</strong> / <strong>Configuration</strong> &gt; <strong>Access scopes</strong> me yeh <strong>FINAL COMPLETE SCOPES</strong> paste karein taki Checkout page, Automatic Discounts aur Calculation bina kisi error ke chale:
                </p>
                <div className="bg-slate-900 p-2.5 rounded text-xs font-mono text-slate-300 space-y-1.5 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-[11px]">Final Complete Scopes (20 Scopes):</span>
                    <button
                      onClick={() => handleCopy('read_orders,write_orders,read_discounts,write_discounts,write_theme_code,read_themes,write_themes,read_checkouts,write_checkouts,read_payment_customizations,write_payment_customizations,read_products,write_products,read_price_rules,write_price_rules,read_draft_orders,write_draft_orders,read_customers,read_delivery_customizations,write_delivery_customizations', 'full-scopes-guide')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      {copiedKey === 'full-scopes-guide' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'full-scopes-guide' ? 'Copied!' : 'Copy All Scopes'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300 break-all bg-slate-950 p-2 rounded max-h-20 overflow-y-auto">
                    read_orders,write_orders,read_discounts,write_discounts,write_theme_code,read_themes,write_themes,read_checkouts,write_checkouts,read_payment_customizations,write_payment_customizations,read_products,write_products,read_price_rules,write_price_rules,read_draft_orders,write_draft_orders,read_customers,read_delivery_customizations,write_delivery_customizations
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 flex flex-col gap-1">
                    <div>⚡ <strong>Checkout Scopes:</strong> <code className="text-amber-300">write_payment_customizations, write_checkouts</code> (UPI ke aage RECOMMENDED aur 10% off badge lagane ke liye)</div>
                    <div>⚡ <strong>Calculation Scopes:</strong> <code className="text-emerald-300">write_price_rules, write_discounts, read_products</code> (Cart subtotal aur automatic 10% calculation ke liye)</div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-800 bg-slate-950/80 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">4</span>
                    Test Store me App Install Karna
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono">OAuth Install</span>
                </div>
                <p className="text-xs text-slate-300">
                  Shopify Partner ke <strong>"Select store"</strong> ya <strong>"Install app"</strong> button se apne development store me install karein. 
                  Merchant ko Shopify OAuth screen dikhegi: "Install Prepaid Perks", accept karte hi app store ke sath connect ho jayega!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'checkout' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <h4 className="font-semibold text-white text-xs mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Shopify me Checkout per Offer kaise lagta hai? (Technical Details)
                </h4>
                <p className="text-xs text-slate-300">
                  Shopify me checkout page private/secure hota hai. Shopify ne 2 methods diye hain offers lagane ke liye:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-emerald-900/60 bg-emerald-950/20 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>⚡ Method 1: Shopify Functions (Modern 2024+)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Yeh Shopify ka official API hai: <strong>Discounts Allocator API</strong>.
                    Jab customer cart ya payment method select karta hai, toh yeh function automatically execute hota hai aur order me discount add kar deta hai bina kisi coupon code ke!
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded">
                    Code ready in "Code Export" tab → extensions/prepaid-discount-function
                  </div>
                </div>

                <div className="border border-blue-900/60 bg-blue-950/20 p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <span>🎨 Method 2: Checkout UI Extension</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Shopify Checkout Extensibility me payment method ke theek upar ek attractive banner render karta hai: 
                    <em>"Pay with UPI &amp; Save ₹100 instantly"</em>.
                    Isse customer direct online payment choose karta hai.
                  </p>
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded">
                    Code ready in "Code Export" tab → extensions/checkout-ui
                  </div>
                </div>
              </div>

              <div className="border border-slate-800 bg-slate-950/90 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-amber-300">
                  Agar store Shopify Plus nahi hai (Basic / Shopify Plan)?
                </div>
                <p className="text-xs text-slate-300">
                  Basic plans par Checkout customize nahi hota, toh standard industry tarika hai: 
                  <strong>Cart Drawer &amp; Product Page Nudge</strong> + <strong>Automatic Draft Order / Cart Transform API</strong>.
                  Humne "Code Export" me ek <code>prepaid-offer-banner.liquid</code> snippet diya hai jo koi bhi theme (Dawn, Impulse, etc.) me 1-click paste ho jata hai!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              <div className="border border-slate-800 bg-slate-950 p-3.5 rounded-xl space-y-1">
                <div className="text-xs font-bold text-white">Q1: Kya humare dashboard me rules live change honge?</div>
                <p className="text-xs text-slate-400">
                  Haan! Is dashboard me aap jo bhi rule set karoge (e.g. Flat ₹50 off ya 10%), woh rules engine me store hota hai aur customer ke cart/checkout me instantly apply hota hai.
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950 p-3.5 rounded-xl space-y-1">
                <div className="text-xs font-bold text-white">Q2: Razorpay, PhonePe ya Paytm ke saath kaise synchronize hoga?</div>
                <p className="text-xs text-slate-400">
                  Jab customer Payment gateway selection par pahunchta hai, rule filter check karta hai gateway name (Razorpay, PhonePe, Cards). Agar prepaid gateway selected hai, toh rule validate hokar discount line item attach kar deta hai.
                </p>
              </div>

              <div className="border border-slate-800 bg-slate-950 p-3.5 rounded-xl space-y-1">
                <div className="text-xs font-bold text-white">Q3: Kya mujhe koi alag se server kharidna padega?</div>
                <p className="text-xs text-slate-400">
                  Nahi! Vercel ka Free Hobby Tier aur Shopify Partner free development stores completely free hain prototyping aur initial launch ke liye.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Aap "Store Simulator" tab me live checkout test kar sakte hain!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
          >
            Samajh Gaya (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
