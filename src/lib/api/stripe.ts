// Stripe API integration

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function createCheckoutSession(order: any) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/order/success?id=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/order/cancel`,
    line_items: order.items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    metadata: {
      orderId: order.id,
    },
  })
}