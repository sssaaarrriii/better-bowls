import { NextResponse } from 'next/server'
import { stripe } from '@/lib/api/stripe'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Missing webhook secret')
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Handle successful payment
        await handleSuccessfulPayment(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        // Handle failed payment
        await handleFailedPayment(paymentIntent)
        break
      }

      case 'payment_intent.requires_action': {
        // Handle when payment requires additional action
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        break
      }

      case 'payment_method.attached': {
        // Handle when a payment method is attached
        const paymentMethod = event.data.object as Stripe.PaymentMethod
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 })
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  // Extract order details from metadata
  const orderItems = JSON.parse(paymentIntent.metadata.order_items || '[]')
  const customerPhone = paymentIntent.metadata.customer_phone
  const customerName = paymentIntent.metadata.customer_name

  // Here you would:
  // 1. Update order status in your database
  // 2. Send confirmation SMS/email
  // 3. Update inventory
  // 4. Any other post-payment business logic
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  // Handle failed payment:
  // 1. Log the failure
  // 2. Notify customer if needed
  // 3. Update order status
  console.error('Payment failed:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    error: paymentIntent.last_payment_error
  })
} 