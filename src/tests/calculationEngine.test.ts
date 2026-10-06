import { CalculationEngine } from '../services/CalculationEngine';

/**
 * Unit Test Suite for PayBro Calculation Engine
 * Run with Vitest / Node test runner
 */
export function runCalculationEngineTests(): { passed: number; failed: number; results: any[] } {
  const tests = [
    {
      name: 'Test 1: UPI Prepaid on ₹1,500 Cake applies 10% discount (₹150 off ➔ ₹1,350)',
      input: {
        items: [{ price: 1500, quantity: 1 }],
        paymentMethod: 'upi' as const,
        discountPercent: 10,
        minCart: 499,
        maxCap: 500,
        codPenalty: 50,
      },
      expected: { subtotal: 1500, discountAmount: 150, codPenalty: 0, finalTotal: 1350 },
    },
    {
      name: 'Test 2: COD on ₹1,500 Cake has 0 discount and adds ₹50 penalty (➔ ₹1,550)',
      input: {
        items: [{ price: 1500, quantity: 1 }],
        paymentMethod: 'cod' as const,
        discountPercent: 10,
        minCart: 499,
        maxCap: 500,
        codPenalty: 50,
      },
      expected: { subtotal: 1500, discountAmount: 0, codPenalty: 50, finalTotal: 1550 },
    },
    {
      name: 'Test 3: UPI on cart under ₹499 (₹350) gets 0 discount',
      input: {
        items: [{ price: 350, quantity: 1 }],
        paymentMethod: 'upi' as const,
        discountPercent: 10,
        minCart: 499,
        maxCap: 500,
      },
      expected: { subtotal: 350, discountAmount: 0, codPenalty: 0, finalTotal: 350 },
    },
    {
      name: 'Test 4: High value cart (₹10,000) respects Max Cap of ₹500 (➔ ₹9,500)',
      input: {
        items: [{ price: 5000, quantity: 2 }],
        paymentMethod: 'upi' as const,
        discountPercent: 10,
        minCart: 499,
        maxCap: 500,
      },
      expected: { subtotal: 10000, discountAmount: 500, codPenalty: 0, finalTotal: 9500 },
    },
  ];

  let passed = 0;
  let failed = 0;
  const results: any[] = [];

  for (const t of tests) {
    const res = CalculationEngine.calculate(t.input);
    const isPass =
      res.subtotal === t.expected.subtotal &&
      res.discountAmount === t.expected.discountAmount &&
      res.codPenalty === t.expected.codPenalty &&
      res.finalTotal === t.expected.finalTotal;

    if (isPass) {
      passed++;
      results.push({ name: t.name, status: 'PASSED', details: res });
    } else {
      failed++;
      results.push({ name: t.name, status: 'FAILED', expected: t.expected, actual: res });
    }
  }

  console.log(`[TEST SUITE] CalculationEngine: ${passed} Passed, ${failed} Failed`);
  return { passed, failed, results };
}
