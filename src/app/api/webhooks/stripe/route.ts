import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
// import Stripe from 'stripe'
import { updateOrderStatus } from '../../../../lib/api/airtable'
import { sendOrderConfirmation } from '../../../../lib/api/twilio'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')!

    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   webhookSecret
    // )

    // if (event.type === 'checkout.session.completed') {
    //   const session = event.data.object as Stripe.Checkout.Session

    //   // Update order status in Airtable
    //   await updateOrderStatus(session.metadata!.orderId, 'confirmed')

    //   // Send confirmation SMS
    //   await sendOrderConfirmation(session.metadata!.customerPhone, {
    //     id: session.metadata!.orderId,
    //     pickupTime: session.metadata!.pickupTime,
    //     location: session.metadata!.location,
    //   })
    // }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
} 