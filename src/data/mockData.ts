import { PrepaidRule, BannerDesignConfig, ShopifyStoreConfig, AnalyticsSummary, CartProduct } from '../types';

export const INITIAL_RULES: PrepaidRule[] = [
  {
    id: 'rule-1',
    name: 'Instant 10% UPI & Razorpay Discount',
    badgeText: '⚡ Extra 10% OFF on UPI & Online Pay',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscountAmount: 150,
    minOrderValue: 499,
    applicableGateways: ['all_prepaid', 'upi', 'razorpay', 'phonepe', 'paytm'],
    customerEligibility: 'all',
    placements: {
      cartDrawer: true,
      productPage: true,
      checkoutPaymentStep: true,
      stickyCheckoutBar: true,
    },
    isActive: true,
    priority: 1,
    nudgeMessage: 'Pay Online & Save ₹100 instantly! No coupon code required.',
    codExtraFee: 50,
    createdAt: '2026-09-15',
  },
  {
    id: 'rule-2',
    name: 'Flat ₹50 OFF on Any Prepaid Payment',
    badgeText: '₹50 Flat Cashback/Discount on Prepaid',
    discountType: 'fixed_amount',
    discountValue: 50,
    minOrderValue: 299,
    applicableGateways: ['all_prepaid', 'cards', 'netbanking'],
    customerEligibility: 'all',
    placements: {
      cartDrawer: true,
      productPage: false,
      checkoutPaymentStep: true,
      stickyCheckoutBar: false,
    },
    isActive: true,
    priority: 2,
    nudgeMessage: 'Choose Debit/Credit card or NetBanking and get flat ₹50 off instantly.',
    codExtraFee: 40,
    createdAt: '2026-09-20',
  },
  {
    id: 'rule-3',
    name: 'Free Priority Shipping on Prepaid Orders',
    badgeText: 'Free Express Shipping (Prepaid Only)',
    discountType: 'free_shipping',
    discountValue: 0,
    minOrderValue: 399,
    applicableGateways: ['all_prepaid', 'upi'],
    customerEligibility: 'new_customers',
    placements: {
      cartDrawer: true,
      productPage: true,
      checkoutPaymentStep: true,
      stickyCheckoutBar: true,
    },
    isActive: false,
    priority: 3,
    nudgeMessage: 'Prepaid orders skip dispatch queues and enjoy 100% Free Express Shipping!',
    codExtraFee: 60,
    createdAt: '2026-10-01',
  },
];

export const INITIAL_STORE_CONFIG: ShopifyStoreConfig = {
  shopDomain: 'fashion-bazaar-india.myshopify.com',
  apiKey: 'shp_7a9f82d1b03e491c92a',
  apiSecret: 'shpss_8c172e9a5bf3214da9e8c',
  scopes: [
    'read_orders',
    'write_orders',
    'read_discounts',
    'write_discounts',
    'write_theme_code',
    'read_products',
  ],
  appUrl: 'https://paybro-eta.vercel.app',
  isConnected: true,
  installedAt: '2026-10-02 11:20 AM',
  themeExtEnabled: true,
  checkoutExtEnabled: true,
  webhookStatus: 'active',
};

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  totalOrders: 2840,
  prepaidOrders: 1945,
  codOrders: 895,
  prepaidRatio: 68.48,
  totalDiscountsDisbursed: 142850,
  totalRevenuePrepaid: 2489600,
  estimatedRtoSaved: 261450, // 895 * 0.24 vs avoided RTO orders * ₹140 average RTO loss
  rtoRateWithOffer: 3.2,
  rtoRateWithoutOffer: 26.8,
};

export const INITIAL_BANNER_DESIGN: BannerDesignConfig = {
  bgColor: '#064e3b', // emerald-900
  textColor: '#ffffff',
  borderColor: '#10b981', // emerald-500
  accentColor: '#fbbf24', // amber-400
  borderRadius: 'md',
  iconType: 'lightning',
  showCountdown: true,
  countdownMinutes: 14,
  pulseAnimation: true,
};

export const SAMPLE_PRODUCTS: CartProduct[] = [
  {
    id: 'prod-1',
    title: 'Oversized Streetwear Heavyweight Tee',
    price: 899,
    quantity: 1,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%231e293b"><rect width="120" height="120" fill="%230f172a"/><path d="M40 28 L50 38 Q60 42 70 38 L80 28 L95 45 L85 55 L82 52 L82 92 L38 92 L38 52 L35 55 L25 45 Z" fill="%233b82f6"/><text x="60" y="75" fill="%23ffffff" font-size="10" font-family="sans-serif" text-anchor="middle" font-weight="bold">PREMIUM TEE</text></svg>',
    category: 'Apparel',
  },
  {
    id: 'prod-2',
    title: 'Classic Air Minimalist Low-Top Sneaker',
    price: 2499,
    quantity: 1,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%231e293b"><rect width="120" height="120" fill="%230f172a"/><path d="M25 68 Q30 52 50 50 L80 50 Q92 50 96 62 L98 78 L22 78 Z" fill="%2310b981"/><rect x="20" y="76" width="80" height="10" rx="3" fill="%23ffffff"/><text x="60" y="68" fill="%23ffffff" font-size="9" font-family="sans-serif" text-anchor="middle" font-weight="bold">AIR RUNNER</text></svg>',
    category: 'Footwear',
  },
  {
    id: 'prod-3',
    title: 'Active AMOLED Smart Fitness Watch',
    price: 1899,
    quantity: 1,
    image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%231e293b"><rect width="120" height="120" fill="%230f172a"/><rect x="42" y="22" width="36" height="76" rx="6" fill="%23334155"/><rect x="36" y="38" width="48" height="48" rx="14" fill="%230284c7" stroke="%2338bdf8" stroke-width="2"/><circle cx="60" cy="62" r="14" fill="%230f172a"/><text x="60" y="65" fill="%2338bdf8" font-size="8" font-family="sans-serif" text-anchor="middle" font-weight="bold">AMOLED</text></svg>',
    category: 'Accessories',
  },
];
