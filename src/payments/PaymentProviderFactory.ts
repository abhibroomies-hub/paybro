import { IPaymentProvider } from './IPaymentProvider';
import { MockPaymentProvider } from './MockPaymentProvider';
import { RazorpayPaymentProvider, razorpayConfig } from './RazorpayPaymentProvider';
import { PaymentProviderType } from '../types';

export class PaymentProviderFactory {
  private static mockInstance = new MockPaymentProvider();
  private static razorpayInstance: RazorpayPaymentProvider | null = null;

  public static getProvider(
    providerType?: PaymentProviderType,
    keys?: { keyId?: string; keySecret?: string }
  ): IPaymentProvider {
    const selected = providerType || (process.env.PAYMENT_PROVIDER as PaymentProviderType) || 'mock';

    if (selected === 'razorpay' && (keys?.keyId || razorpayConfig.key_id)) {
      if (!this.razorpayInstance || keys?.keyId) {
        this.razorpayInstance = new RazorpayPaymentProvider(keys?.keyId, keys?.keySecret);
      }
      return this.razorpayInstance;
    }

    // Default to Mock provider for 100% zero-configuration testing
    return this.mockInstance;
  }
}
