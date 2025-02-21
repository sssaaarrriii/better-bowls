import { NextResponse } from 'next/server'
import { 
  OrderDetails, 
  validateOrderAmounts, 
  formatAmountForStripe 
} from '@/lib/api/stripe'
import { stripe } from '@/lib/api/stripe'

// Define expected request body type
interface CreatePaymentIntentRequest {
  orderDetails: OrderDetails
}

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json()
    const { orderDetails } = body as { orderDetails: OrderDetails }

    // Validate the order amounts are correct
    if (!validateOrderAmounts(orderDetails)) {
      return NextResponse.json(
        { error: 'Invalid order amounts' },
        { status: 400 }
      )
    }

    // Convert dollar amounts to cents for Stripe
    const subtotalAmount = formatAmountForStripe(orderDetails.subtotal)
    const discountAmount = formatAmountForStripe(orderDetails.discount)
    const taxAmount = formatAmountForStripe(orderDetails.tax)
    
    // Calculate final amount, ensuring minimum of 50 cents
    const finalAmount = Math.max(
      subtotalAmount - discountAmount + taxAmount,
      50
    )

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true // Enables payment methods like Apple Pay
      },
      // Store order details in metadata for webhook processing
      metadata: {
        customerName: orderDetails.customerInfo.name,
        customerPhone: orderDetails.customerInfo.phone,
        pickupLocation: orderDetails.pickupLocation || '',
        pickupTime: orderDetails.pickupTime || '',
        orderTotal: orderDetails.total.toString()
      }
    })

    // Return the client secret to the frontend
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