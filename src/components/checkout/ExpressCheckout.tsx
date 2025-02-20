'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import type { OrderDetails } from '@/app/checkout/page'
import type { 
  Stripe,
  StripeElements,
  StripeExpressCheckoutElementConfirmEvent, 
  StripeExpressCheckoutElementClickEvent,
  StripeExpressCheckoutElement
} from '@stripe/stripe-js'

// Define the expected shape of click event resolution
interface ExpressCheckoutClickResolveDetails {
  phoneNumberRequired: boolean
  emailRequired: boolean
  shippingAddressRequired: boolean
  billingAddressRequired: boolean
  lineItems: Array<{
    name: string
    amount: number
  }>
  total: {
    label: string
    amount: number
  }
}

interface ExpressCheckoutProps {
  orderDetails: OrderDetails
}

export default function ExpressCheckout({ orderDetails }: ExpressCheckoutProps) {
  // Initialize Stripe hooks and state
  const router = useRouter()
  const stripe = useStripe() as Stripe
  const elements = useElements() as StripeElements
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const expressCheckoutRef = useRef<StripeExpressCheckoutElement | null>(null)

  // Helper to calculate all amounts in cents
  const calculateAmounts = useCallback(() => {
    const subtotalAmount = Math.round(orderDetails.subtotal * 100)
    const discountAmount = Math.round(orderDetails.discount * 100)
    const taxAmount = Math.round(orderDetails.tax * 100)
    const finalAmount = Math.max(subtotalAmount - discountAmount + taxAmount, 50)

    return {
      subtotalAmount,
      discountAmount,
      taxAmount,
      finalAmount
    }
  }, [orderDetails])

  // Create a new payment intent with the server
  const createPaymentIntent = async () => {
    try {
      const { finalAmount } = calculateAmounts()

      const response = await fetch('/api/checkout/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          currency: 'usd',
          orderDetails
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create payment intent')
      }

      const data = await response.json()
      return data.clientSecret
    } catch (error) {
      console.error('Payment intent error:', error)
      throw new Error('Payment initialization failed')
    }
  }

  // Called when Express Checkout sheet is about to open
  const handleClick = async (event: StripeExpressCheckoutElementClickEvent) => {
    try {
      const { subtotalAmount, discountAmount, taxAmount, finalAmount } = calculateAmounts()

      // Build line items for the payment sheet
      const lineItems = [
        {
          name: 'Better Bowls Order',
          amount: subtotalAmount
        }
      ]

      if (orderDetails.discount > 0) {
        lineItems.push({
          name: `Discount (${orderDetails.promoCode})`,
          amount: -discountAmount
        })
      }

      lineItems.push({
        name: 'Tax',
        amount: taxAmount
      })

      // Verify line items sum matches total
      const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.amount, 0)
      if (lineItemsTotal !== finalAmount) {
        console.error('Amount mismatch:', { lineItemsTotal, finalAmount })
        throw new Error('Amount calculation mismatch')
      }

      // Configure and open payment sheet
      event.resolve({
        phoneNumberRequired: true,
        emailRequired: false,
        shippingAddressRequired: false,
        billingAddressRequired: false,
        lineItems,
        total: {
          label: 'Total',
          amount: finalAmount
        }
      } as ExpressCheckoutClickResolveDetails)
    } catch (error) {
      console.error('Error in click handler:', error)
      setErrorMessage('Failed to open payment sheet')
    }
  }

  // Called when payment is confirmed in Express Checkout sheet
  const handleConfirm = async (event: StripeExpressCheckoutElementConfirmEvent) => {
    if (!stripe || !elements || isProcessing) return

    try {
      setIsProcessing(true)
      setErrorMessage('')

      // Submit form data to Stripe
      const { error: submitError } = await elements.submit()
      if (submitError) throw submitError

      // Create payment intent and get client secret
      const clientSecret = await createPaymentIntent()

      // Confirm the payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'if_required'
      })

      if (confirmError) throw confirmError

      // Handle successful payment
      if (paymentIntent.status === 'succeeded') {
        // Store order and send confirmation in parallel
        await Promise.all([
          fetch('/api/checkout/store-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: paymentIntent.id,
              orderDetails,
              status: 'confirmed'
            })
          }),
          fetch('/api/checkout/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: orderDetails.customerInfo.phone,
              orderId: paymentIntent.id
            })
          })
        ])

        router.push(`/order/confirmation?orderId=${paymentIntent.id}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Create and mount Express Checkout Element
  useEffect(() => {
    if (!elements || isProcessing) return

    try {
      // Create element instance
      const expressCheckout = elements.create('expressCheckout')
      
      // Add event listeners
      expressCheckout.on('click', handleClick)
      expressCheckout.on('confirm', handleConfirm)

      // Mount to DOM
      const mountElement = document.getElementById('express-checkout-container')
      if (mountElement) {
        expressCheckout.mount(mountElement)
        expressCheckoutRef.current = expressCheckout
      }

      // Cleanup on unmount
      return () => {
        expressCheckout.destroy()
        expressCheckoutRef.current = null
      }
    } catch (error) {
      console.error('Error creating Express Checkout:', error)
      setErrorMessage('Failed to initialize payment')
    }
  }, [elements, isProcessing])

  return (
    <div className="space-y-4">
      {/* Express Checkout mount point */}
      {!isProcessing && (
        <div id="express-checkout-container" className="w-full" />
      )}
      
      {/* Error message */}
      {errorMessage && (
        <p className="text-red-500 text-center">{errorMessage}</p>
      )}
      
      {/* Loading indicator */}
      {isProcessing && (
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-900 mx-auto" />
          <p className="text-gray-600">Processing payment...</p>
        </div>
      )}
    </div>
  )
} 