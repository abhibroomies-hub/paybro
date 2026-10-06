import { PaymentProviderFactory } from '../../src/payments/PaymentProviderFactory';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount = 1350, currency = 'INR', provider: requestedProvider, notes } = req.body || {};

  try {
    const provider = PaymentProviderFactory.getProvider(requestedProvider);
    const orderResult = await provider.createOrder({
      amount,
      currency,
      receipt: 'rcpt_' + Date.now(),
      notes,
    });

    return res.status(200).json({
      success: true,
      ...orderResult,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
