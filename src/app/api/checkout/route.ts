import { NextResponse } from 'next/server'
import { createCheckoutSession } from '../../../lib/api/stripe'
import { createOrder } from '../../../lib/api/airtable'
import { generateOrderId } from '../../../lib/utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Create a new order ID
    const orderId = generateOrderId()
    
    // Create order in Airtable first
    const order = {
      id: orderId,
      customer: body.customer,
      items: body.items,
      classTime: body.classTime,
      pickupLocation: body.pickupLocation,
      pickupTime: body.pickupTime,
      total: body.total,
      promoCode: body.promoCode,
      discount: body.discount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    await createOrder(order)

    // Create Stripe checkout session
    const session = await createCheckoutSession(order)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
} 