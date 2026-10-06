import {
  IPaymentProvider,
  CreateOrderParams,
  CreateOrderResult,
  VerifyPaymentParams,
  VerifyPaymentResult,
  RefundParams,
  RefundResult,
} from './IPaymentProvider';
import { PaymentMethodItem } from '../types';

export class MockPaymentProvider implements IPaymentProvider {
  name = 'mock';

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const mockId = 'mock_order_' + Math.random().toString(36).substring(2, 12);
    console.log(`[MOCK] createOrder called: amount=₹${params.amount}, orderId=${mockId}`);

    return {
      providerOrderId: mockId,
      amount: params.amount,
      currency: params.currency || 'INR',
      status: 'created',
      provider: 'MockPaymentProvider',
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    console.log(`[MOCK] verifyPayment started for providerOrderId=${params.providerOrderId}`);
    // Simulate 1.5-second network processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const txnId = 'mock_txn_' + Date.now();
    console.log(`[MOCK] verifyPayment SUCCESS: txnId=${txnId}`);

    return {
      success: true,
      amount: 1350,
      method: 'UPI_INTENT',
      transactionId: txnId,
      message: 'Mock payment verified successfully (Test Sandbox)',
    };
  }

  async refund(params: RefundParams): Promise<RefundResult> {
    console.log(`[MOCK] refund processed for paymentId=${params.providerPaymentId}, amount=₹${params.amount}`);
    return {
      success: true,
      refundId: 'mock_rfnd_' + Date.now(),
    };
  }

  async getPaymentMethods(): Promise<PaymentMethodItem[]> {
    console.log('[MOCK] getPaymentMethods returning abstracted methods');
    return [
      {
        id: 'upi',
        label: 'UPI (Google Pay, PhonePe, Paytm, BHIM)',
        recommended: true,
        discountPercent: 10,
        icon: 'upi',
      },
      {
        id: 'card',
        label: 'Debit / Credit Card (Visa, Mastercard, RuPay)',
        recommended: false,
        discountPercent: 0,
        icon: 'card',
      },
      {
        id: 'netbanking',
        label: 'NetBanking (All Indian Banks)',
        recommended: false,
        discountPercent: 0,
        icon: 'bank',
      },
      {
        id: 'cod',
        label: 'Cash on Delivery (COD)',
        recommended: false,
        discountPercent: 0,
        icon: 'cod',
        penalty: 50,
      },
    ];
  }
}
