'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements, ExpressCheckoutElement } from '@stripe/react-stripe-js'
import type { OrderDetails } from '@/lib/api/stripe'
import Stripe from '@stripe/stripe-js'

/**
 * ExpressCheckout Props:
 * - orderDetails: Order information from parent
 * - onError: Error handler passed from parent
 */
interface ExpressCheckoutProps {
  orderDetails: OrderDetails
  onError: (error: string) => void
}

/**
 * ExpressCheckout Component
 * 
 * Flow:
 * 1. Mounts Express Checkout Element
 * 2. When customer clicks pay:
 *    - Validates amounts
 *    - Creates PaymentIntent
 *    - Confirms payment
 * 3. Handles success/failure
 */
export default function ExpressCheckout({ 
  orderDetails, 
  onError,
}: ExpressCheckoutProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  /**
   * Handle payment confirmation following Stripe docs
   * https://docs.stripe.com/elements/express-checkout-element/accept-a-payment
   */
  const handleConfirm = async () => {
    if (!stripe || !elements) {
      onError('Payment system not initialized')
      return
    }

    try {
      setIsProcessing(true)

      // Step 1: Submit the form
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      // Step 2: Create PaymentIntent on the server
      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderDetails })
      })

      const { clientSecret, error: createError } = await response.json()
      if (createError) {
        throw new Error(createError)
      }

      // Step 3: Confirm the payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmation`,
        }
      })

      if (confirmError) {
        throw confirmError
      }

      // Payment confirmation is handled by return_url redirect
    } catch (error) {
      // Fix: Check if error is a Stripe error by checking properties
      const isStripeError = (error as any)?.type?.startsWith('stripe_')
      const errorMessage = isStripeError
        ? (error as Stripe.StripeError).message || 'Payment failed'
        : 'Payment failed'
      console.error('Payment error:', error)
      onError(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      {!isProcessing && (
        <ExpressCheckoutElement
          // Re-render element when total changes
          key={`${orderDetails.total}-${orderDetails.promoCode}`}
          onConfirm={handleConfirm}
          onClick={(event) => {
            // Configure payment sheet
            event.resolve({
              business: { name: 'Better Bowls' },
              phoneNumberRequired: true,
              emailRequired: false,
            })
          }}
        />
      )}

      {isProcessing && (
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900 mx-auto" />
          <p className="text-gray-600">Processing payment...</p>
        </div>
      )}
    </div>
  )
}