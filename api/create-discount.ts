export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { shop, accessToken, discountPercent = 10, minSubtotal = 499 } = req.body || {};

  const cleanShop = (shop || process.env.SHOPIFY_SHOP_DOMAIN || 'broomiesbakery.myshopify.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  const token = accessToken || process.env.SHOPIFY_ACCESS_TOKEN || 'shpat_live_broomiesbakery_auto';

  const graphqlMutation = `
    mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
      discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticBasic {
              title
              status
              startsAt
            }
          }
        }
        userErrors {
          field
          code
          message
        }
      }
    }
  `;

  const variables = {
    automaticBasicDiscount: {
      title: `⚡ ${discountPercent}% OFF on Prepaid & UPI`,
      startsAt: new Date().toISOString(),
      customerGets: {
        value: {
          percentage: discountPercent / 100, // e.g. 0.10 for 10%
        },
        items: {
          all: true,
        },
      },
      minimumRequirement: {
        subtotal: {
          greaterThanOrEqualToSubtotal: String(minSubtotal),
        },
      },
      combinesWith: {
        orderDiscounts: true,
        productDiscounts: true,
        shippingDiscounts: true,
      },
    },
  };

  try {
    const response = await fetch(`https://${cleanShop}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query: graphqlMutation, variables }),
    });

    const result = await response.json() as any;

    if (result.errors) {
      return res.status(400).json({ error: 'Shopify GraphQL Error', errors: result.errors });
    }

    const payload = result.data?.discountAutomaticBasicCreate;
    if (payload?.userErrors && payload.userErrors.length > 0) {
      return res.status(422).json({ error: 'Discount validation error', userErrors: payload.userErrors });
    }

    return res.status(200).json({
      success: true,
      message: `${discountPercent}% Automatic Discount successfully created on ${cleanShop}!`,
      discountNode: payload?.automaticDiscountNode,
    });
  } catch (error: any) {
    console.error('[PayBro] Error creating automatic discount:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
