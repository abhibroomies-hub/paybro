/**
 * PayBro / Prepaid Perks - Client Theme Script
 * Automatically injects banners & intercepts checkout for Broomies Bakery
 */

(function () {
  'use strict';

  const configEl = document.getElementById('paybro-config');
  const APP_URL = (configEl && configEl.dataset.appUrl) || 'https://paybro-eta.vercel.app';
  const DISCOUNT_PCT = (configEl && configEl.dataset.discountPercent) || '10';
  const MIN_ORDER = parseFloat((configEl && configEl.dataset.minOrder) || '499');

  console.log('[PayBro] Theme Extension initialized for', window.location.hostname);

  // 1. Render Offer Banners in Cart Drawer / Cart Page
  function injectCartBanner() {
    if (document.getElementById('paybro-cart-offer-banner')) return;

    const cartContainers = document.querySelectorAll(
      '.cart__footer, .cart-drawer__footer, .drawer__footer, form[action*="/cart"], .cart-total, [data-cart-subtotal]'
    );

    if (cartContainers.length > 0) {
      const banner = document.createElement('div');
      banner.id = 'paybro-cart-offer-banner';
      banner.style.cssText = `
        background: linear-gradient(135deg, #022c22, #064e3b);
        color: #ffffff;
        border: 1px solid #10b981;
        border-radius: 8px;
        padding: 10px 14px;
        margin: 10px 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;

      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">⚡</span>
          <div>
            <strong style="color: #6ee7b7; font-size: 13px;">${DISCOUNT_PCT}% OFF on Prepaid / UPI</strong>
            <div style="color: #d1fae5; font-size: 11px;">Avoid COD fees. Instant delivery priority!</div>
          </div>
        </div>
        <span style="background: #059669; color: #ffffff; font-weight: bold; font-size: 10px; padding: 3px 7px; border-radius: 4px; text-transform: uppercase;">
          RECOMMENDED
        </span>
      `;

      cartContainers[0].insertBefore(banner, cartContainers[0].firstChild);
    }
  }

  // 2. Render Sticky Offer on Product Page
  function injectProductNudge() {
    if (document.getElementById('paybro-product-nudge')) return;

    const addToCartForms = document.querySelectorAll('form[action*="/cart/add"], .product-form');
    if (addToCartForms.length > 0) {
      const nudge = document.createElement('div');
      nudge.id = 'paybro-product-nudge';
      nudge.style.cssText = `
        background: #f0fdf4;
        border: 1px dashed #16a34a;
        color: #14532d;
        padding: 8px 12px;
        border-radius: 6px;
        margin: 12px 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: sans-serif;
      `;
      nudge.innerHTML = `
        <span style="color: #16a34a; font-size: 14px;">⚡</span>
        <span><strong>Prepaid Offer:</strong> Pay via UPI at checkout & get <strong>${DISCOUNT_PCT}% instant discount</strong>!</span>
      `;

      addToCartForms[0].appendChild(nudge);
    }
  }

  // 3. Intercept Checkout Buttons & Redirect to Fast 1-Page Checkout
  function setupCheckoutInterception() {
    document.addEventListener('click', async function (e) {
      const target = e.target.closest(
        'button[name="checkout"], input[name="checkout"], .cart__checkout-button, a[href*="/checkout"]'
      );

      if (!target) return;

      // Allow bypass if modifier keys pressed
      if (e.metaKey || e.ctrlKey) return;

      e.preventDefault();
      e.stopPropagation();

      const originalText = target.innerText || target.value;
      if (target.tagName === 'INPUT') target.value = 'Redirecting to Fast Checkout...';
      else target.innerText = '⚡ Opening PayBro Fast Checkout...';

      try {
        // Fetch current Cart JSON from Shopify Storefront
        const cartResponse = await fetch('/cart.js');
        const cartData = await cartResponse.json();

        // Create Checkout Session with our backend
        const sessionResponse = await fetch(`${APP_URL}/api/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cart: cartData,
            shop: window.location.hostname,
            appliedDiscountPct: DISCOUNT_PCT,
          }),
        });

        const sessionResult = await sessionResponse.json();

        if (sessionResult && sessionResult.sessionId) {
          window.location.href = `${APP_URL}/checkout?session=${encodeURIComponent(sessionResult.sessionId)}`;
        } else {
          // Fallback to standard checkout if session creation fails
          window.location.href = '/checkout';
        }
      } catch (err) {
        console.warn('[PayBro] Fast Checkout redirect failed, using native checkout', err);
        window.location.href = '/checkout';
      }
    }, true);
  }

  // Run on load and DOM mutations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectCartBanner();
      injectProductNudge();
      setupCheckoutInterception();
    });
  } else {
    injectCartBanner();
    injectProductNudge();
    setupCheckoutInterception();
  }

  // Watch for dynamic drawer opens
  const observer = new MutationObserver(() => {
    injectCartBanner();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
