import { PaymentProviderFactory } from '../src/payments/PaymentProviderFactory';

export default async function handler(req: any, res: any) {
  try {
    const provider = PaymentProviderFactory.getProvider();
    const methods = await provider.getPaymentMethods();

    return res.status(200).json({
      success: true,
      provider: provider.name,
      methods,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
