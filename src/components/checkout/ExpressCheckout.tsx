'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import type { OrderDetails } from '@/app/checkout/page'

interface ExpressCheckoutProps {
  orderDetails: OrderDetails
}

/**
 * ExpressCheckout component handles Stripe Express Checkout integration
 * Displays payment buttons like Apple Pay, Google Pay, etc based on browser/device
 * Handles payment flow from button click through confirmation
 */
export default function ExpressCheckout({ orderDetails }: ExpressCheckoutProps) {
  // Get Next.js router for redirecting after payment
  const router = useRouter()
  
  // Get Stripe hooks - stripe is the main Stripe instance, elements manages UI components
  const stripe = useStripe()
  const elements = useElements()
  
  // Track payment processing state and any error messages
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * Creates a PaymentIntent on our server
   * PaymentIntent tracks the payment lifecycle and tells Stripe how much to charge
   * Returns client secret needed to confirm payment on frontend
   */
  const createPaymentIntent = async () => {
    // Convert all amounts to cents since Stripe requires integer amounts
    const subtotalAmount = Math.round(orderDetails.subtotal * 100)
    const discountAmount = Math.round(orderDetails.discount * 100)
    const taxAmount = Math.round(orderDetails.tax * 100)
    // Ensure minimum charge of 50 cents
    const finalAmount = Math.max(subtotalAmount - discountAmount + taxAmount, 50)

    // Call our API endpoint to create the PaymentIntent
    const response = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: finalAmount,
        currency: 'usd',
        orderDetails
      })
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment intent')
    }

    return data.clientSecret
  }

  return (
    <div className="space-y-4">
      {/* Only show payment buttons when not actively processing a payment */}
      {!isProcessing && (
        <ExpressCheckoutElement
          // Re-render element when total or promo code changes
          key={`${orderDetails.total}-${orderDetails.promoCode}`}
          
          // Handle successful payment authorization from customer
          onConfirm={async (event) => {
            if (!stripe || !elements) return

            try {
              setIsProcessing(true)
              setErrorMessage('')

              // Submit the form data to Stripe for validation
              const { error: submitError } = await elements.submit()
              if (submitError) throw submitError

              // Get PaymentIntent client secret from our server
              const clientSecret = await createPaymentIntent()

              // Confirm the payment with Stripe
              const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                redirect: 'if_required' // Only redirect if 3D Secure is needed
              })

              if (error) throw error

              // Payment was successful
              if (paymentIntent.status === 'succeeded') {
                // Store order details and send confirmation SMS in parallel
                await Promise.all([
                  // Save order to our database
                  fetch('/api/checkout/store-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      orderId: paymentIntent.id,
                      orderDetails,
                      status: 'confirmed'
                    })
                  }),
                  // Send confirmation SMS to customer
                  fetch('/api/checkout/send-confirmation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      phone: orderDetails.customerInfo.phone,
                      orderId: paymentIntent.id
                    })
                  })
                ])

                // Redirect to order confirmation page
                router.push(`/order/confirmation?orderId=${paymentIntent.id}`)
              }
            } catch (error) {
              console.error('Payment error:', error)
              setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
            } finally {
              setIsProcessing(false)
            }
          }}

          // Configure the payment sheet that appears when customer clicks a payment button
          onClick={(event) => {
            // Calculate amounts in cents
            const subtotalAmount = Math.round(orderDetails.subtotal * 100)
            const discountAmount = Math.round(orderDetails.discount * 100)
            const taxAmount = Math.round(orderDetails.tax * 100)
            const finalAmount = Math.max(subtotalAmount - discountAmount + taxAmount, 50)

            // Build line items to show in payment sheet
            const lineItems = [
              {
                name: 'Better Bowls Order',
                amount: subtotalAmount
              },
              // Only include discount line item if there is one
              ...(orderDetails.discount > 0 ? [{
                name: `Discount (${orderDetails.promoCode})`,
                amount: -discountAmount
              }] : []),
              {
                name: 'Tax',
                amount: taxAmount
              }
            ]

            // Verify line items sum matches final amount to prevent errors
            const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
            if (lineItemsTotal !== finalAmount) {
              console.error('Amount mismatch:', { lineItemsTotal, finalAmount })
              setErrorMessage('Amount calculation error')
              // Note: event.reject() is deprecated, should handle error differently
              return
            }

            // Configure payment sheet display
            event.resolve({
              business: { name: 'Better Bowls' },
              phoneNumberRequired: true,
              emailRequired: false,
            })
          }}
        />
      )}

      {/* Display any error messages */}
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}

      {/* Show loading spinner while processing payment */}
      {isProcessing && (
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900 mx-auto" />
          <p className="text-gray-600">Processing payment...</p>
        </div>
      )}
    </div>
  )
}