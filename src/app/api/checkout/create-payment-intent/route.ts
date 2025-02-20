import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { formatCurrency } from '@/lib/utils'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, orderDetails } = body

    // Create payment intent with amount calculated on client
    // Amount should match what's shown in Apple/Google Pay sheet
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card', 'apple_pay', 'google_pay'],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        // Store original amounts and promo details for reference
        subtotal: formatCurrency(orderDetails.subtotal),
        discount: formatCurrency(orderDetails.discount),
        tax: formatCurrency(orderDetails.tax),
        total: formatCurrency(orderDetails.total),
        promoCode: orderDetails.promoCode || 'none'
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
} 