import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { updateOrderStatus } from '@/lib/api/airtable'
import { sendOrderConfirmation } from '@/lib/api/twilio'

// Initialize Stripe with error handling
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as any, {
  apiVersion: '2023-10-16' as any
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle webhook events
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        try {
          // Add payment method info to logs
          console.log('Payment succeeded:', {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            payment_method_types: paymentIntent.payment_method_types,
            payment_method: paymentIntent.payment_method
          })

          await Promise.all([
            updateOrderStatus(paymentIntent.id, 'confirmed'),
            sendOrderConfirmation(
              paymentIntent.metadata.customerPhone,
              {
                id: paymentIntent.id,
                pickupTime: paymentIntent.metadata.pickupTime || 'Not specified',
                location: paymentIntent.metadata.pickupLocation || 'Default location'
              }
            )
          ])
        } catch (error) {
          console.error('Post-payment processing error:', error)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', {
          id: paymentIntent.id,
          error: paymentIntent.last_payment_error,
          payment_method_types: paymentIntent.payment_method_types
        })
        break
      }

      // Add handling for express checkout specific events
      case 'payment_method.attached': {
        console.log('Payment method attached:', event.data.object)
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook handler failed' },
      { status: 500 }
    )
  }
} 