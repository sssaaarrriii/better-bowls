import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { formatCurrency } from '@/lib/utils'
import type { OrderDetails } from '@/app/checkout/page'

// Initialize Stripe with error handling
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any
})

interface CreatePaymentIntentRequest {
  amount: number
  currency: string
  orderDetails: OrderDetails
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as CreatePaymentIntentRequest
    const { amount, orderDetails } = body

    // Validate request
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Amount must be at least 50 cents' },
        { status: 400 }
      )
    }

    if (!orderDetails?.customerInfo?.phone) {
      return NextResponse.json(
        { error: 'Customer phone number is required' },
        { status: 400 }
      )
    }

    if (!orderDetails?.items?.length) {
      return NextResponse.json(
        { error: 'Order must contain items' },
        { status: 400 }
      )
    }

    // Validate and adjust amount
    const minAmount = 50; // 50 cents minimum
    const adjustedAmount = Math.max(minAmount, amount);

    // Create payment intent with Express Checkout settings
    const paymentIntent = await stripe.paymentIntents.create({
      amount: adjustedAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      payment_method_types: ['card', 'apple_pay'],
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic'
        }
      },
      metadata: {
        customerName: orderDetails.customerInfo.name,
        customerPhone: orderDetails.customerInfo.phone,
        subtotal: formatCurrency(orderDetails.subtotal),
        discount: formatCurrency(orderDetails.discount),
        tax: formatCurrency(orderDetails.tax),
        total: formatCurrency(orderDetails.total),
        promoCode: orderDetails.promoCode || 'none',
        pickupLocation: orderDetails.pickupLocation || '',
        pickupTime: orderDetails.pickupTime || '',
        itemCount: orderDetails.items.length.toString()
      }
    })

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment intent' },
      { status: 500 }
    )
  }
} 