export interface CalculationInput {
  items: Array<{ price: number; quantity: number }>;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  discountPercent?: number; // e.g. 10
  minCart?: number; // e.g. 499
  maxCap?: number; // e.g. 500
  codPenalty?: number; // e.g. 50
}

export interface CalculationResult {
  subtotal: number;
  discountAmount: number;
  codPenalty: number;
  finalTotal: number;
  isEligibleForDiscount: boolean;
  savingsMessage: string;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedPenalty: string;
  formattedFinalTotal: string;
}

export class CalculationEngine {
  /**
   * Calculates subtotal, prepaid discount or COD penalty, and final total
   */
  public static calculate(input: CalculationInput): CalculationResult {
    const discountPercent = input.discountPercent ?? 10;
    const minCart = input.minCart ?? 499;
    const maxCap = input.maxCap ?? 500;
    const codPenaltyValue = input.codPenalty ?? 50;

    // 1. Calculate Subtotal
    const subtotal = (input.items || []).reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);

    const isPrepaid = input.paymentMethod !== 'cod';
    const isEligibleForDiscount = isPrepaid && subtotal >= minCart;

    // 2. Calculate Discount
    let discountAmount = 0;
    if (isEligibleForDiscount) {
      const rawDiscount = (subtotal * discountPercent) / 100;
      discountAmount = Math.min(rawDiscount, maxCap);
    }

    // 3. Calculate COD Penalty
    const codPenalty = input.paymentMethod === 'cod' ? codPenaltyValue : 0;

    // 4. Final Total (rounded to 2 decimal places)
    const finalTotal = Math.round((subtotal - discountAmount + codPenalty) * 100) / 100;

    // 5. User-friendly savings message
    let savingsMessage = '';
    if (isEligibleForDiscount) {
      savingsMessage = `⚡ Saved ₹${discountAmount.toLocaleString('en-IN')} with instant ${discountPercent}% Prepaid Offer!`;
    } else if (isPrepaid && subtotal < minCart) {
      const gap = minCart - subtotal;
      savingsMessage = `Add ₹${gap.toLocaleString('en-IN')} more to unlock ${discountPercent}% Instant UPI Discount.`;
    } else if (input.paymentMethod === 'cod') {
      savingsMessage = `Switch to UPI to save ₹${(discountAmount || (subtotal * discountPercent) / 100) + codPenaltyValue}!`;
    }

    return {
      subtotal,
      discountAmount,
      codPenalty,
      finalTotal,
      isEligibleForDiscount,
      savingsMessage,
      formattedSubtotal: `₹${subtotal.toLocaleString('en-IN')}`,
      formattedDiscount: `-₹${discountAmount.toLocaleString('en-IN')}`,
      formattedPenalty: `+₹${codPenalty.toLocaleString('en-IN')}`,
      formattedFinalTotal: `₹${finalTotal.toLocaleString('en-IN')}`,
    };
  }
}
