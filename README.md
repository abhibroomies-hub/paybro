# PayBro / Prepaid Perks - Production Shopify App
**Merchant Target:** `broomiesbakery.in` (`broomiesbakery.myshopify.com`)  
**Deployment Platform:** Vercel (Serverless Functions) + Shopify Partner App + Shopify CLI (Theme App Extension)  
**Database Dependency:** **NONE** (Zero Postgres / MongoDB / Supabase. 100% Shopify Metafields & In-Memory TTL)

---

## ⚡ 1. Tech Stack & Core Philosophy
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js / Express Serverless Functions deployed on Vercel (`/api/*`).
- **Data Storage:**
  - **Shopify Metafields (Persistent):**
    - `shop.metafields.paybro.settings` → JSON blob with discount %, minCart, codPenalty, provider selection.
    - `shop.metafields.paybro.payment_provider` → Encrypted provider credentials.
    - `shop.metafields.paybro.automatic_discount_id` → GID of Shopify automatic discount.
    - `order.metafields.paybro.*` → Per-order session ID, payment provider, method, and discount amount.
  - **In-Memory TTL Cache (Ephemeral):**
    - 1-hour auto-expiring checkout sessions (`session_<uuid>`). Graceful fallback if Vercel KV is absent.
- **Payment Provider Layer:**
  - Fully abstracted `IPaymentProvider` interface.
  - Active: `MockPaymentProvider` (simulates UPI, Cards, NetBanking, COD with 1.5s network delay and logs `[MOCK]`).
  - Swappable: `RazorpayPaymentProvider` (SDK skeleton with zero-redeploy dashboard activation).

---

## 🛠️ 2. Environment Variables (`.env.example`)
Only these 5 environment variables are required:

```env
SHOPIFY_API_KEY=shp_7a9f82d1b03e491c92a
SHOPIFY_API_SECRET=shpss_8c172e9a5bf3214da9e8c
SHOPIFY_SCOPES=read_orders,write_orders,read_discounts,write_discounts,write_theme_code,read_themes,write_themes,read_checkouts,write_checkouts,read_payment_customizations,write_payment_customizations,read_products,write_products,read_price_rules,write_price_rules,read_draft_orders,write_draft_orders,read_customers,read_delivery_customizations,write_delivery_customizations
SHOPIFY_APP_URL=https://paybro-eta.vercel.app
PAYMENT_PROVIDER=mock
```

*(Optional later via dashboard: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`)*

---

## 🧪 3. How to Test with Mock Provider (Zero Setup)
1. Launch the app dashboard: `npm run dev` or visit your Vercel deployment.
2. In the top navigation, note the banner: **`🧪 Test Mode: Using Mock Payment Provider`**.
3. Go to the **"Payment Gateway"** tab:
   - Click **"Run Engine Unit Tests"** to verify the calculation engine (all 4 Vitest scenarios pass).
4. Go to **"⚡ Custom Fast Checkout"** (or visit `/?tab=custom-checkout`):
   - Notice **Love in Layers (₹1,500)** is pre-loaded with **UPI [RECOMMENDED]** pre-selected.
   - Price breakdown dynamically shows: Subtotal ₹1,500 ➔ **⚡ 10% Instant UPI Discount -₹150** ➔ **Total ₹1,350**.
   - If you click **Cash on Delivery (COD)**, the 10% discount is removed and a **+₹50 COD fee** is added (Total ₹1,550) with an urgency notice to switch to UPI.
5. Click **"PAY ₹1,350 • COMPLETE ORDER VIA UPI"**:
   - The `MockPaymentProvider` logs `[MOCK]` to the console, simulates payment verification, and renders the **Order Placed Successfully** screen with Draft Order `#BB-2026-8941`.

---

## 🔄 4. How to Switch to Razorpay (3-Step Zero-Redeploy Guide)
When ready to accept live Indian UPI / Card payments:
1. Open the dashboard and click the **"Payment Gateway"** tab.
2. Select **"2. Razorpay Live Provider"** and enter your credentials:
   - **Key ID:** `rzp_live_xxxxxxxx`
   - **Key Secret:** `••••••••••••••••••••••••••••••`
3. Click **"Save Provider Settings"**.

*The keys are encrypted and saved directly to `shop.metafields.paybro.settings`. The app instantly routes checkout sessions to the live Razorpay modal without any code changes or redeployments.*

---

## 🚀 5. Shopify CLI & Theme App Extension
```bash
# 1. Select the Broomies Bakery partner app
shopify app config use

# 2. Test theme extension in local preview
shopify app dev

# 3. Deploy Theme App Extension directly to Shopify
shopify app deploy
```

### Enable on Theme (Zero Code Edits):
1. In **Shopify Admin**, navigate to **Online Store** > **Themes** > Click **Customize** on the active Dawn theme.
2. In the left sidebar, click the **App Embeds** icon (third tab).
3. Toggle **PayBro Prepaid Offer Embed** to **ON** and click **Save**.

The script automatically displays the cart drawer offer banner and routes checkout clicks to the fast checkout page.

---

## 🛡️ 6. Security & Compliance
- **Webhook HMAC Verification:** All incoming Shopify webhooks verify the `X-Shopify-Hmac-Sha256` signature using `crypto.createHmac('sha256', SHOPIFY_API_SECRET)`.
- **Token Protection:** Tokens are never logged in full; error payloads redact sensitive strings.
- **Rate Limiting:** Guarded against brute force with a 100 req/min per-shop budget.
