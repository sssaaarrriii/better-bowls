import { NextResponse } from 'next/server'
import { stripe } from '@/lib/api/stripe'

/**
 * API Route: Create Payment Intent
 * 
 * Handles the creation of Stripe PaymentIntent for checkout process.
 * Receives the final calculated amount from the client and creates a payment intent.
 * No calculations are done here - all price/discount calculations happen client-side.
 * 
 * Flow:
 * 1. Receives amount, order items, and customer info from client
 * 2. Validates the data
 * 3. Creates Stripe PaymentIntent
 * 4. Returns client secret for payment confirmation
 */

export async function POST(req: Request) {
  try {
    const { amount, orderItems, customerInfo } = await req.json()
    
    // Validate the required data
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    
    if (!orderItems?.length || !customerInfo?.phone) {
      return NextResponse.json({ error: 'Missing order data' }, { status: 400 })
    }
    
    // Create payment intent with the final amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        order_items: JSON.stringify(orderItems),
        customer_phone: customerInfo.phone,
        customer_name: customerInfo.name
      }
    })
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json({ error: 'Payment setup failed' }, { status: 500 })
  }
} 