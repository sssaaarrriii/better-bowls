import { NextResponse } from 'next/server'
import { stripe, createPaymentIntent } from '@/lib/api/stripe'
import type { OrderDetails } from '@/lib/api/stripe'

export async function POST(req: Request) {
  try {
    const { amount, orderItems, customerInfo } = await req.json()

    const paymentIntent = await createPaymentIntent(amount, {
      order_items: JSON.stringify(orderItems),
      customer_phone: customerInfo.phone,
      customer_name: customerInfo.name,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      // Include any additional data needed by the client
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
} 