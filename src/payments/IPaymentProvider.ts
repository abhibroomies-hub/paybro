import { PaymentMethodItem } from '../types';

export interface CreateOrderParams {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
}

export interface VerifyPaymentParams {
  providerOrderId: string;
  providerPaymentId: string;
  signature?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  amount: number;
  method: string;
  transactionId: string;
  message?: string;
}

export interface RefundParams {
  providerPaymentId: string;
  amount: number;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
}

export interface IPaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
  refund(params: RefundParams): Promise<RefundResult>;
  getPaymentMethods(): Promise<PaymentMethodItem[]>;
}
