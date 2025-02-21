import { NextResponse } from 'next/server'
import { 
  stripe, 
  OrderDetails, 
  validateOrderAmounts, 
  formatAmountForStripe 
} from '@/lib/api/stripe'

// Define expected request body type
interface CreatePaymentIntentRequest {
  orderDetails: OrderDetails
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderDetails } = body as { orderDetails: OrderDetails }

    // Validate order details
    if (!validateOrderAmounts(orderDetails)) {
      return NextResponse.json(
        { error: 'Invalid order amounts' },
        { status: 400 }
      )
    }

    // Calculate final amount
    const subtotalAmount = formatAmountForStripe(orderDetails.subtotal)
    const discountAmount = formatAmountForStripe(orderDetails.discount)
    const taxAmount = formatAmountForStripe(orderDetails.tax)
    const finalAmount = Math.max(
      subtotalAmount - discountAmount + taxAmount,
      50 // Minimum 50 cents
    )

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
      // Enable automatic payment methods
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        customerName: orderDetails.customerInfo.name,
        customerPhone: orderDetails.customerInfo.phone,
        pickupLocation: orderDetails.pickupLocation || '',
        pickupTime: orderDetails.pickupTime || '',
        orderTotal: orderDetails.total.toString()
      }
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    })

  } catch (error) {
    console.error('Create PaymentIntent error:', error)
    return NextResponse.json(
      { error: 'Payment setup failed' },
      { status: 500 }
    )
  }
} 