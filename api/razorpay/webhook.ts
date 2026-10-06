import crypto from 'crypto';
import { razorpayConfig } from '../../src/payments/RazorpayPaymentProvider';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = razorpayConfig.webhook_secret;

  // 1. Verify Razorpay Webhook HMAC Signature if secret is configured
  if (signature && webhookSecret) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('[Razorpay Webhook] Signature mismatch, rejecting payload');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = req.body?.event;
  const payload = req.body?.payload;

  console.log(`[PayBro Razorpay Webhook] Event received: ${event}`);

  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload?.payment?.entity;
    console.log(`[Razorpay Payment Captured] Amount: ₹${(payment?.amount || 0) / 100}, Payment ID: ${payment?.id}`);
    // Here we can trigger Draft Order creation or update order tags in Shopify
  }

  return res.status(200).json({ status: 'ok', received: true });
}
