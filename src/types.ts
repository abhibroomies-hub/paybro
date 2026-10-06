export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';

export type PaymentGatewayId = 'all_prepaid' | 'upi' | 'cards' | 'netbanking' | 'razorpay' | 'phonepe' | 'paytm' | 'cashfree' | 'stripe';

export interface PrepaidRule {
  id: string;
  name: string;
  badgeText: string;
  discountType: DiscountType;
  discountValue: number; // percentage (e.g. 10) or amount in INR (e.g. 50)
  maxDiscountAmount?: number; // max cap for percentage discounts (e.g. 150)
  minOrderValue: number; // minimum cart value in INR (e.g. 499)
  maxOrderValue?: number;
  applicableGateways: PaymentGatewayId[];
  customerEligibility: 'all' | 'new_customers' | 'returning_customers';
  placements: {
    cartDrawer: boolean;
    productPage: boolean;
    checkoutPaymentStep: boolean;
    stickyCheckoutBar: boolean;
  };
  isActive: boolean;
  priority: number;
  nudgeMessage: string;
  codExtraFee?: number; // fee to show on COD or reminder note
  createdAt: string;
}

export interface BannerDesignConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
  borderRadius: 'sm' | 'md' | 'lg' | 'full';
  iconType: 'lightning' | 'gift' | 'shield' | 'tag' | 'wallet';
  showCountdown: boolean;
  countdownMinutes: number;
  pulseAnimation: boolean;
  customCssClass?: string;
}

export interface ShopifyStoreConfig {
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
  scopes: string[];
  appUrl: string;
  isConnected: boolean;
  installedAt?: string;
  themeExtEnabled: boolean;
  checkoutExtEnabled: boolean;
  webhookStatus: 'active' | 'pending' | 'unverified';
}

export interface AnalyticsSummary {
  totalOrders: number;
  prepaidOrders: number;
  codOrders: number;
  prepaidRatio: number; // e.g. 68.5%
  totalDiscountsDisbursed: number; // in INR
  totalRevenuePrepaid: number; // in INR
  estimatedRtoSaved: number; // in INR (based on ~INR 140 average RTO loss per COD return)
  rtoRateWithOffer: number; // e.g. 4.8%
  rtoRateWithoutOffer: number; // e.g. 24.2%
}

export interface CartProduct {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export type PaymentProviderType = 'mock' | 'razorpay' | 'phonepe' | 'cashfree';

export interface PaymentMethodItem {
  id: string;
  label: string;
  recommended: boolean;
  discountPercent: number;
  icon: string;
  penalty?: number;
}

export interface AppSettingsMetafield {
  discountPercent: number;
  minCart: number;
  maxCap: number;
  codPenalty: number;
  paymentProvider: PaymentProviderType;
  razorpayConfigured: boolean;
  razorpayKeyId?: string;
  automaticDiscountId?: string;
  updatedAt?: string;
}
