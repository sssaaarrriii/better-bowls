import { NextResponse } from 'next/server'
import { stripe, PaymentError } from '@/lib/api/stripe'
import type Stripe from 'stripe'

// Validate webhook secret at startup
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET')
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    ) as Stripe.Event

    // Handle events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('💰 Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          metadata: paymentIntent.metadata
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('❌ Payment failed:', {
          id: paymentIntent.id,
          error: paymentIntent.last_payment_error
        })
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 400 }
    )
  }
} 