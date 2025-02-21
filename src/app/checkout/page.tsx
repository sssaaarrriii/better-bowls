'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import OrderSummary from '@/components/checkout/order-summary'
import PickupDetails from '@/components/checkout/pickup-details'
import PromoCode from '@/components/checkout/promo-code'
import { OrderDetails, STRIPE_APPEARANCE } from '@/lib/api/stripe'
import { ErrorBoundary } from 'react-error-boundary'

/**
 * Checkout Page Component
 * 
 * Main checkout flow coordinator that handles:
 * 1. Loading stored order data from localStorage
 * 2. Stripe Elements initialization and configuration
 * 3. Payment processing
 * 4. Order validation
 * 
 * Contains:
 * - Order summary display
 * - Promo code application
 * - Pickup details
 * - Express checkout integration
 * 
 * Uses child components:
 * - OrderSummary: Displays order details
 * - PromoCode: Handles discount application
 * - PickupDetails: Shows pickup information
 */

/**
 * Checkout Page Flow:
 * 1. Initialize Stripe on page load
 * 2. Load order details from localStorage
 * 3. Display order summary and pickup details
 * 4. Handle promo code application
 * 5. Mount Stripe Elements for payment
 * 6. Process payment via ExpressCheckout
 */

// Initialize Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

/**
 * Main Checkout Content Component
 * Handles order data loading, validation, and payment setup
 */
function CheckoutContent({ onAmountChange }: { onAmountChange: (amount: number) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [clientSecret, setClientSecret] = useState<string>('')

  // Load order data only once on mount
  useEffect(() => {
    const loadOrderData = async () => {
      try {
        const event = JSON.parse(localStorage.getItem('selectedEvent') || '')
        const order = JSON.parse(localStorage.getItem('currentOrder') || '')
        const customer = JSON.parse(localStorage.getItem('customerInfo') || '')

        if (!event.location || !customer.phone || !order.items?.length) {
          throw new Error('Invalid order data')
        }

        const details: OrderDetails = {
          ...order,
          customerInfo: customer,
          pickupLocation: event.location,
          pickupTime: customer.classTime || event.time
        }

        setOrderDetails(details)
      } catch (error) {
        console.error('Data validation error:', error)
        router.push('/order')
      }
    }

    loadOrderData()
  }, [router]) // Remove onAmountChange from dependencies

  // Create/update payment intent when orderDetails changes
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!orderDetails) return

      try {
        const response = await fetch('/api/checkout/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(orderDetails.total * 100),
            orderItems: orderDetails.items,
            customerInfo: orderDetails.customerInfo
          })
        })
        const { clientSecret } = await response.json()
        setClientSecret(clientSecret)
        onAmountChange(Math.round(orderDetails.total * 100))
      } catch (error) {
        console.error('Payment intent error:', error)
        setError('Payment setup failed')
      }
    }

    createPaymentIntent()
  }, [orderDetails]) // Only run when orderDetails changes

  /**
   * Handle promo code application
   * Validates code and updates order amounts
   */
  const handlePromoCode = async (discount: number, code: string) => {
    if (!orderDetails) return
    
    // Calculate new totals
    const subtotal = orderDetails.subtotal
    const discountedSubtotal = Math.round((subtotal - discount) * 100) / 100
    const tax = Math.round((discountedSubtotal * 0.095) * 100) / 100
    const total = Math.round((discountedSubtotal + tax) * 100) / 100

    const newDetails = {
      ...orderDetails,
      discount,
      promoCode: code,
      tax,
      total
    }

    // Update state and localStorage
    setOrderDetails(newDetails)
    localStorage.setItem('currentOrder', JSON.stringify(newDetails))

    // Create new payment intent with discounted amount
    const response = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        orderItems: newDetails.items,
        customerInfo: newDetails.customerInfo
      })
    })
    const { clientSecret } = await response.json()
    setClientSecret(clientSecret)
    onAmountChange(Math.round(total * 100))
  }

  // Handle the click event for Express Checkout
  const handleClick = ({ resolve }: { resolve: (details: any) => void }) => {
    if (!orderDetails) return

    resolve({
      phoneNumberRequired: true,
      lineItems: orderDetails.items.map(item => ({
        name: item.name,
        amount: Math.round(item.price * 100)
      }))
    })
  }

  // Use stored clientSecret for confirmation
  const handleConfirm = async () => {
    if (!stripe || !elements || !clientSecret) return

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Error submitting payment')
        return
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order/confirmation`,
        },
      })

      if (error) {
        setError(error.message || 'Payment confirmation failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setError('Payment processing failed')
    }
  }

  if (!orderDetails) {
    return <div className="p-4">Loading order details...</div>
  }

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(orderDetails.total * 100),
    currency: 'usd',
    appearance: STRIPE_APPEARANCE,
  }

  /**
   * Render checkout interface
   * Components:
   * - Order summary
   * - Promo code input
   * - Pickup details
   * - Express checkout element
   */
  return (
    <div className="max-w-2xl mx-auto p-4 pt-32 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      {/* Display order summary with items and totals */}
      <OrderSummary orderDetails={orderDetails} />
      
      {/* Promo code section */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Promo Code</h2>
        <PromoCode 
          subtotal={orderDetails.subtotal}
          onApplyPromo={handlePromoCode}
        />
      </div>
      
      {/* Pickup location and time details */}
      <PickupDetails
        location={{
          name: orderDetails.pickupLocation || '',
          address: '',
          city: '',
          zip: ''
        }}
        pickupTime={orderDetails.pickupTime || ''}
      />
      
      {/* Mount ExpressCheckoutElement directly here */}
      <ExpressCheckoutElement
        onConfirm={handleConfirm}
        onClick={handleClick}
      />
      
      {error && (
        <div className="mt-4 text-red-500 text-center">{error}</div>
      )}
    </div>
  )
}

/**
 * Checkout Page Wrapper
 * Provides error boundary and loading state
 */
export default function Checkout() {
  // Initialize with a minimum amount to avoid the error
  const [options, setOptions] = useState<StripeElementsOptions>({
    mode: 'payment',
    amount: 100, // Set minimum amount (100 cents = $1.00)
    currency: 'usd',
    appearance: STRIPE_APPEARANCE,
  })

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong loading checkout</div>}
      onError={(error) => console.error('Checkout error:', error)}
    >
      <Elements stripe={stripePromise} options={options}>
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutContent onAmountChange={(amount) => {
            setOptions(prev => ({ ...prev, amount }))
          }} />
        </Suspense>
      </Elements>
    </ErrorBoundary>
  )
}

