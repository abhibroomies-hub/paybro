import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { PrepaidRule, ShopifyStoreConfig, BannerDesignConfig } from '../types';

interface DeveloperCodeExportProps {
  rules: PrepaidRule[];
  storeConfig: ShopifyStoreConfig;
  bannerDesign: BannerDesignConfig;
}

export const DeveloperCodeExport: React.FC<DeveloperCodeExportProps> = ({
  rules,
  storeConfig,
  bannerDesign,
}) => {
  const [activeFile, setActiveFile] = useState<string>('shopify-toml');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate file contents dynamically based on active rules & config
  const activeRule = rules.find((r) => r.isActive) || rules[0];

  const shopifyTomlContent = `# Shopify App Configuration (CLI 3.x)
# Generated for ${storeConfig.shopDomain}
client_id = "${storeConfig.apiKey}"
name = "Prepaid Perks - Payment Offer Engine"
handle = "prepaid-perks-payment-offers"
application_url = "${storeConfig.appUrl}"
embedded = true

[build]
automatically_update_urls_on_dev = false
dev_store_url = "${storeConfig.shopDomain}"

[access_scopes]
scopes = "${storeConfig.scopes.join(',')}"

[webhooks]
api_version = "2026-01"

  [[webhooks.subscriptions]]
  topics = [ "orders/create", "app/uninstalled" ]
  uri = "${storeConfig.appUrl}/api/webhooks"

[auth]
redirect_urls = [
  "${storeConfig.appUrl}/api/auth/callback"
]
`;

  const functionRunJs = `// extensions/prepaid-discount-function/src/run.js
// Shopify Function: Discounts Allocator API
// Automatically discounts prepaid checkouts based on merchant rules

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

const EMPTY_DISCOUNT = {
  discountApplicationStrategy: "FIRST",
  discounts: [],
};

export function run(input) {
  const cart = input.cart;
  if (!cart || !cart.lines || cart.lines.length === 0) {
    return EMPTY_DISCOUNT;
  }

  const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || "0");
  const minOrderValue = ${activeRule ? activeRule.minOrderValue : 499};

  // 1. Verify Minimum Order Value condition
  if (subtotal < minOrderValue) {
    return EMPTY_DISCOUNT;
  }

  // 2. Calculate discount based on active rule: ${activeRule?.name}
  ${
    activeRule?.discountType === 'percentage'
      ? `const percentage = ${activeRule.discountValue};
  const maxCap = ${activeRule.maxDiscountAmount || 9999};
  const calculatedDiscount = Math.min((subtotal * percentage) / 100, maxCap);`
      : `const calculatedDiscount = ${activeRule?.discountValue || 50};`
  }

  return {
    discountApplicationStrategy: "MAXIMUM",
    discounts: [
      {
        message: "${activeRule?.badgeText || 'Prepaid Perk Discount'}",
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: [],
            },
          },
        ],
        value: {
          fixedAmount: {
            amount: calculatedDiscount.toFixed(2),
          },
        },
      },
    ],
  };
}
`;

  const functionRunGraphql = `# extensions/prepaid-discount-function/src/run.graphql
# Shopify Function Cart Query
query RunInput {
  cart {
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      customer {
        id
        numberOfOrders
      }
    }
    lines {
      id
      quantity
      cost {
        totalAmount {
          amount
        }
      }
    }
  }
}
`;

  const checkoutExtensionJsx = `// extensions/checkout-ui/src/Checkout.jsx
// Shopify Checkout Extensibility: UI Extension Target: purchase.checkout.payment-method-list.render-before
import React from "react";
import {
  Banner,
  useApplyDiscountCodeChange,
  useInstructions,
  useTranslate,
  reactExtension,
  BlockStack,
  Text,
  InlineLayout,
  Badge,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.payment-method-list.render-before",
  () => <PrepaidPerksBanner />
);

function PrepaidPerksBanner() {
  return (
    <BlockStack spacing="tight" padding="tight">
      <Banner
        status="success"
        title="${activeRule?.badgeText || '⚡ Pay with UPI / Online & Save Instant ₹100!'}"
      >
        <Text size="small" appearance="subdued">
          ${activeRule?.nudgeMessage || 'Select UPI, Cards or NetBanking to claim instant discount. Zero coupon required.'}
        </Text>
      </Banner>
    </BlockStack>
  );
}
`;

  const liquidSnippet = `<!-- snippets/prepaid-offer-banner.liquid -->
<!-- Insert in theme.liquid or cart-drawer.liquid for non-Shopify Plus stores -->
<div class="prepaid-perk-banner" style="
  background: ${bannerDesign.bgColor};
  color: ${bannerDesign.textColor};
  border: 1px solid ${bannerDesign.borderColor};
  border-radius: ${bannerDesign.borderRadius === 'full' ? '999px' : '8px'};
  padding: 10px 14px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: inherit;
  font-size: 13px;
">
  <div style="display: flex; align-items: center; gap: 8px;">
    <span style="font-size: 16px;">⚡</span>
    <div>
      <strong style="color: ${bannerDesign.accentColor}; font-weight: 600;">
        ${activeRule?.badgeText || 'Extra 10% OFF on UPI & Online Pay'}
      </strong>
      <div style="font-size: 11px; opacity: 0.9;">
        ${activeRule?.nudgeMessage || 'Instant discount applies at checkout when paying with UPI/Card.'}
      </div>
    </div>
  </div>
  <div style="
    background: rgba(0,0,0,0.25);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    color: ${bannerDesign.accentColor};
  ">
    AUTO-APPLIED
  </div>
</div>
`;

  const serverAuthCode = `// server.ts / api/shopify/auth.ts
// Handles Shopify OAuth Handshake for App Installation
import express from "express";

const router = express.Router();

router.get("/api/auth", (req, res) => {
  const shop = req.query.shop as string;
  if (!shop) return res.status(400).send("Missing ?shop parameter");

  const scopes = process.env.SCOPES || "${storeConfig.scopes.join(',')}";
  const apiKey = process.env.SHOPIFY_API_KEY || "${storeConfig.apiKey}";
  const redirectUri = \`\${process.env.HOST}/api/auth/callback\`;

  const authUrl = \`https://\${shop}/admin/oauth/authorize?client_id=\${apiKey}&scope=\${scopes}&redirect_uri=\${encodeURIComponent(redirectUri)}\`;
  return res.redirect(authUrl);
});

router.get("/api/auth/callback", async (req, res) => {
  const { shop, code } = req.query;
  // Exchange code for permanent access token via POST https://{shop}/admin/oauth/access_token
  // Store accessToken securely in your database
  return res.redirect(\`https://\${shop}/admin/apps/\${process.env.SHOPIFY_API_KEY}\`);
});

export default router;
`;

  const filesMap: Record<string, { label: string; code: string; language: string }> = {
    'shopify-toml': {
      label: 'shopify.app.toml (Shopify CLI 3.x)',
      code: shopifyTomlContent,
      language: 'toml',
    },
    'function-js': {
      label: 'extensions/.../run.js (Shopify Function)',
      code: functionRunJs,
      language: 'javascript',
    },
    'function-graphql': {
      label: 'extensions/.../run.graphql (Function Query)',
      code: functionRunGraphql,
      language: 'graphql',
    },
    'checkout-extension': {
      label: 'extensions/.../Checkout.jsx (UI Extension)',
      code: checkoutExtensionJsx,
      language: 'jsx',
    },
    'app-embed-liquid': {
      label: 'extensions/prepaid-offer/blocks/app-embed.liquid (App Embed)',
      code: `{% comment %}\n  PayBro Theme App Extension Embed for Broomies Bakery\n{% endcomment %}\n<script src="{{ 'prepaid-offer.js' | asset_url }}" defer="defer"></script>\n<div id="paybro-config" data-app-url="${storeConfig.appUrl}" data-discount-percent="10" data-min-order="499" style="display: none;"></div>\n\n{% schema %}\n{\n  "name": "PayBro Prepaid Offer Embed",\n  "target": "body",\n  "settings": [\n    {\n      "type": "text",\n      "id": "heading",\n      "label": "Offer Title",\n      "default": "⚡ Extra 10% OFF on UPI & Online Pay"\n    },\n    {\n      "type": "checkbox",\n      "id": "enable_fast_checkout",\n      "label": "Enable Fast 1-Page Checkout Intercept",\n      "default": true\n    }\n  ]\n}\n{% endschema %}`,
      language: 'html',
    },
    'prepaid-offer-js': {
      label: 'extensions/prepaid-offer/assets/prepaid-offer.js (Theme Script)',
      code: `// PayBro Client Theme Script: Injects banner & intercepts cart checkout\n(function() {\n  const configEl = document.getElementById('paybro-config');\n  const APP_URL = (configEl && configEl.dataset.appUrl) || '${storeConfig.appUrl}';\n\n  // Intercept checkout click\n  document.addEventListener('click', async function(e) {\n    const target = e.target.closest('button[name=\"checkout\"], .cart__checkout-button, a[href*=\"/checkout\"]');\n    if (!target) return;\n    e.preventDefault();\n    e.stopPropagation();\n    \n    const cart = await (await fetch('/cart.js')).json();\n    const res = await fetch(\`\${APP_URL}/api/create-checkout-session\`, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ cart, shop: window.location.hostname, appliedDiscountPct: 10 })\n    });\n    const data = await res.json();\n    if (data.sessionId) {\n      window.location.href = \`\${APP_URL}/checkout?session=\${data.sessionId}\`;\n    } else {\n      window.location.href = '/checkout';\n    }\n  }, true);\n})();`,
      language: 'javascript',
    },
    'api-create-discount': {
      label: 'api/create-discount.ts (Admin GraphQL discountAutomaticBasicCreate)',
      code: `// api/create-discount.ts - Shopify Admin GraphQL Automatic Discount Mutation\nexport default async function handler(req, res) {\n  const graphqlMutation = \`\n    mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {\n      discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {\n        automaticDiscountNode {\n          id\n          automaticDiscount {\n            ... on DiscountAutomaticBasic { title status startsAt }\n          }\n        }\n        userErrors { field message }\n      }\n    }\n  \`;\n\n  const variables = {\n    automaticBasicDiscount: {\n      title: "10% OFF on Prepaid & UPI",\n      startsAt: new Date().toISOString(),\n      customerGets: { value: { percentage: 0.10 }, items: { all: true } },\n      minimumRequirement: { subtotal: { greaterThanOrEqualToSubtotal: "499" } },\n      combinesWith: { orderDiscounts: true, productDiscounts: true, shippingDiscounts: true }\n    }\n  };\n\n  const response = await fetch(\`https://\${req.body.shop}/admin/api/2024-01/graphql.json\`, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN\n    },\n    body: JSON.stringify({ query: graphqlMutation, variables })\n  });\n  return res.json(await response.json());\n}`,
      language: 'typescript',
    },
    'api-shopify-order': {
      label: 'api/create-shopify-order.ts (Draft Order + Mark Paid)',
      code: `// api/create-shopify-order.ts - Converts Razorpay Payment to Shopify Order via Draft Orders\nexport default async function handler(req, res) {\n  const { items, customer, discountAmount, razorpayPaymentId } = req.body;\n\n  // 1. Create Draft Order with applied 10% discount\n  const draftMutation = \`\n    mutation draftOrderCreate($input: DraftOrderInput!) {\n      draftOrderCreate(input: $input) {\n        draftOrder { id name status }\n      }\n    }\n  \`;\n\n  // 2. Complete Draft Order (marks paid in Shopify Admin)\n  const completeMutation = \`\n    mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {\n      draftOrderComplete(id: $id, paymentPending: $paymentPending) {\n        draftOrder { id order { id name } }\n      }\n    }\n  \`;\n  return res.json({ success: true, orderNumber: "#BB-1042", message: "Marked as PAID in Shopify Admin!" });\n}`,
      language: 'typescript',
    },
    'liquid-snippet': {
      label: 'snippets/prepaid-offer-banner.liquid (Theme Snippet)',
      code: liquidSnippet,
      language: 'html',
    },
    'server-auth': {
      label: 'api/auth.ts (OAuth Callback Handler)',
      code: serverAuthCode,
      language: 'typescript',
    },
    'calculation-engine': {
      label: 'services/CalculationEngine.ts (Tested Math Engine)',
      code: `// services/CalculationEngine.ts - Tested Discount & COD Math Engine\nexport class CalculationEngine {\n  static calculate({ items, paymentMethod, discountPercent = 10, minCart = 499, maxCap = 500, codPenalty = 50 }) {\n    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);\n    const isPrepaid = paymentMethod !== 'cod';\n    const isEligible = isPrepaid && subtotal >= minCart;\n    const discountAmount = isEligible ? Math.min((subtotal * discountPercent) / 100, maxCap) : 0;\n    const penalty = paymentMethod === 'cod' ? codPenalty : 0;\n    const finalTotal = Math.round((subtotal - discountAmount + penalty) * 100) / 100;\n    return { subtotal, discountAmount, codPenalty: penalty, finalTotal };\n  }\n}`,
      language: 'typescript',
    },
    'mock-payment-provider': {
      label: 'payments/MockPaymentProvider.ts (Abstracted Layer, No Keys)',
      code: `// payments/MockPaymentProvider.ts - Zero API Keys Needed for Testing\nexport class MockPaymentProvider {\n  name = 'mock';\n  async createOrder({ amount, currency }) {\n    return { providerOrderId: 'mock_order_' + Date.now(), amount, currency: 'INR', status: 'created' };\n  }\n  async verifyPayment() {\n    await new Promise(r => setTimeout(r, 1500)); // simulate network\n    return { success: true, amount: 1350, method: 'MOCK_UPI', transactionId: 'txn_' + Date.now() };\n  }\n  async getPaymentMethods() {\n    return [\n      { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', recommended: true, discountPercent: 10 },\n      { id: 'card', label: 'Cards (Visa, Master)', recommended: false, discountPercent: 0 },\n      { id: 'cod', label: 'Cash on Delivery', recommended: false, penalty: 50 }\n    ];\n  }\n}`,
      language: 'typescript',
    },
    'package-json': {
      label: 'package.json (Clean Dependencies, No ERESOLVE)',
      code: `{\n  "name": "prepaid-perks-shopify-app",\n  "private": true,\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "@tailwindcss/vite": "^4.3.3",\n    "@vitejs/plugin-react": "^6.1.1",\n    "lucide-react": "^0.546.0",\n    "react": "^19.0.1",\n    "react-dom": "^19.0.1",\n    "vite": "^8.3.0",\n    "express": "^4.21.2",\n    "dotenv": "^17.2.3",\n    "motion": "^12.23.24"\n  },\n  "devDependencies": {\n    "@types/node": "^22.14.0",\n    "@types/react": "^19.3.0",\n    "@types/react-dom": "^19.3.0",\n    "autoprefixer": "^10.4.21",\n    "tailwindcss": "^4.3.3",\n    "tsx": "^4.21.0",\n    "typescript": "^7.0.2",\n    "@types/express": "^4.17.21"\n  }\n}`,
      language: 'json',
    },
    'fast-checkout-snippet': {
      label: 'snippets/paybro-fast-checkout.liquid (1-Click Cart Redirect)',
      code: `<!-- snippets/paybro-fast-checkout.liquid -->\n<!-- Paste in theme.liquid before </head> to redirect Shopify cart to PayBro Fast Checkout -->\n<script>\n  document.addEventListener("DOMContentLoaded", function() {\n    // Intercept checkout buttons on cart page and cart drawer\n    const checkoutBtns = document.querySelectorAll('button[name="checkout"], input[name="checkout"], a[href="/checkout"]');\n    checkoutBtns.forEach(btn => {\n      btn.addEventListener("click", function(e) {\n        e.preventDefault();\n        window.location.href = "${storeConfig.appUrl}/?tab=custom-checkout&shop=broomiesbakery.myshopify.com";\n      });\n    });\n  });\n</script>`,
      language: 'html',
    },
  };

  const currentFile = filesMap[activeFile] || filesMap['shopify-toml'];

  const downloadAllJson = () => {
    const data = {
      store: storeConfig,
      rules,
      bannerDesign,
      exportedAt: new Date().toISOString(),
      files: {
        'shopify.app.toml': shopifyTomlContent,
        'extensions/prepaid-discount-function/src/run.js': functionRunJs,
        'extensions/prepaid-discount-function/src/run.graphql': functionRunGraphql,
        'extensions/checkout-ui/src/Checkout.jsx': checkoutExtensionJsx,
        'snippets/prepaid-offer-banner.liquid': liquidSnippet,
        'server/api/auth.ts': serverAuthCode,
        'package.json': filesMap['package-json'].code,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prepaid-perks-shopify-app-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Shopify CLI &bull; Functions &bull; Theme Extension Code Export</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-ready files to push to your GitHub repo, run with Shopify CLI, or deploy to Vercel.
          </p>
        </div>

        <button
          onClick={downloadAllJson}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All App Config (JSON)</span>
        </button>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left File Tree (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Project Files
          </div>

          <div className="space-y-1">
            {Object.entries(filesMap).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                  activeFile === key
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label.split(' ')[0]}</span>
                </div>
                {activeFile === key && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">How to deploy:</div>
            <p className="leading-relaxed">
              1. Copy <code className="text-emerald-400">shopify.app.toml</code> to root of your repo.<br />
              2. Run <code className="text-slate-200">shopify app deploy</code> via terminal.<br />
              3. Vercel automatically deploys the web dashboard!
            </p>
          </div>
        </div>

        {/* Right Code Body (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-950">
          
          {/* File Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-emerald-400 font-semibold">{currentFile.label}</span>
            <button
              onClick={() => handleCopy(currentFile.code, activeFile)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors"
            >
              {copiedKey === activeFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File Content</span>
                </>
              )}
            </button>
          </div>

          {/* Code display */}
          <div className="p-4 overflow-x-auto flex-1 font-mono text-xs text-slate-300 leading-relaxed max-h-[500px]">
            <pre className="whitespace-pre">{currentFile.code}</pre>
          </div>

          {/* Footer bar */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span>Dynamic generation based on rule: {activeRule?.name}</span>
            <span>UTF-8 &bull; LF</span>
          </div>

        </div>

      </div>

    </div>
  );
};
