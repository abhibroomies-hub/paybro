import { AppSettingsMetafield, PrepaidRule } from '../types';

export class ShopifyMetafieldService {
  // Local in-memory cache with 1-hour TTL (fallback for Vercel KV / local preview)
  private static memoryCache: Map<string, { value: any; expiresAt: number }> = new Map();

  private static setCache(key: string, value: any, ttlMs: number = 3600000) {
    this.memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  private static getCache(key: string): any | null {
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Fetches persistent app settings from Shopify Shop Metafield: shop.metafields.paybro.settings
   */
  public static async getShopSettings(shop: string, token?: string): Promise<AppSettingsMetafield> {
    const cacheKey = `settings_${shop}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    const defaultSettings: AppSettingsMetafield = {
      discountPercent: 10,
      minCart: 499,
      maxCap: 500,
      codPenalty: 50,
      paymentProvider: 'mock',
      razorpayConfigured: false,
      updatedAt: new Date().toISOString(),
    };

    if (!token) return defaultSettings;

    const query = `
      query getShopMetafields {
        shop {
          metafield(namespace: "paybro", key: "settings") {
            value
          }
        }
      }
    `;

    try {
      const res = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ query }),
      });
      const data = (await res.json()) as any;
      const rawValue = data?.data?.shop?.metafield?.value;
      if (rawValue) {
        const parsed = JSON.parse(rawValue);
        this.setCache(cacheKey, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('[SHOPIFY] Could not fetch shop metafield, using defaults', e);
    }

    return defaultSettings;
  }

  /**
   * Saves app settings to Shopify Shop Metafield: shop.metafields.paybro.settings (No Database Needed!)
   */
  public static async saveShopSettings(
    shop: string,
    settings: AppSettingsMetafield,
    token?: string
  ): Promise<boolean> {
    const cacheKey = `settings_${shop}`;
    this.setCache(cacheKey, settings);

    if (!token) {
      console.log('[MOCK-STORAGE] Settings saved in memory cache for shop:', shop);
      return true;
    }

    const mutation = `
      mutation setMetafield($input: MetafieldsSetInput!) {
        metafieldsSet(metafields: [$input]) {
          metafields {
            key
            namespace
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const input = {
      ownerId: `gid://shopify/Shop/1`, // Will resolve to current shop in Admin context
      namespace: 'paybro',
      key: 'settings',
      type: 'json',
      value: JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }),
    };

    try {
      const res = await fetch(`https://${shop}/admin/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({ query: mutation, variables: { input } }),
      });
      const data = (await res.json()) as any;
      return !data?.errors && !data?.data?.metafieldsSet?.userErrors?.length;
    } catch (e) {
      console.warn('[SHOPIFY] Could not write shop metafield', e);
      return false;
    }
  }
}
