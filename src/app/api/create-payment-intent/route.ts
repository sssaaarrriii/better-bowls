import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any
})

interface RequestBody {
  amount: number;
  orderId: string;
  promoCode?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as RequestBody
    const { amount, orderId, promoCode } = body

    // Apply appropriate discount
    const finalAmount = promoCode?.toLowerCase() === 'stripetesting'
      ? amount * 0.01  // 99% off for testing
      : promoCode ? amount * 0.8  // Regular 20% discount
      : amount

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100),
      currency: 'usd',
      payment_method_types: ['card', 'apple_pay'],
      metadata: {
        orderId,
        promoCode: promoCode || ''
      }
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    )
  }
} 