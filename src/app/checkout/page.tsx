'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import OrderSummary from '@/components/checkout/order-summary'
import PickupDetails from '@/components/checkout/pickup-details'
import ExpressCheckout from '@/components/checkout/ExpressCheckout'
import { OrderDetails, STRIPE_APPEARANCE } from '@/lib/api/stripe'
import { ErrorBoundary } from 'react-error-boundary'

/**
 * Checkout Flow:
 * 1. User arrives from Order page with data in localStorage
 * 2. Page loads and validates stored data
 * 3. Mounts Stripe Elements with ExpressCheckout
 * 4. When user clicks pay:
 *    - Creates PaymentIntent via API
 *    - Passes clientSecret to ExpressCheckout
 *    - Handles confirmation and redirect
 */

// Add debug logging
console.log('Stripe Key:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
console.log('Stripe Promise:', !!stripePromise)

function CheckoutContent() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  /**
   * On mount: Load and validate data from localStorage
   * This data was set by:
   * - EventCard: Selected event details
   * - OrderForm: Customer information
   * - Order customization: Order items and amounts
   */
  useEffect(() => {
    // Add debug logging
    console.log('CheckoutContent mounted')
    
    const validateStoredData = () => {
      try {
        // Log localStorage contents
        console.log('localStorage data:', {
          event: localStorage.getItem('selectedEvent'),
          order: localStorage.getItem('currentOrder'),
          customer: localStorage.getItem('customerInfo')
        })

        const storedEvent = localStorage.getItem('selectedEvent')
        const storedOrder = localStorage.getItem('currentOrder')
        const customerInfo = localStorage.getItem('customerInfo')

        if (!storedEvent || !storedOrder || !customerInfo) {
          throw new Error('Missing required order data')
        }

        // Parse and validate
        const event = JSON.parse(storedEvent)
        const order = JSON.parse(storedOrder)
        const customer = JSON.parse(customerInfo)

        console.log('Parsed data:', { event, order, customer })

        if (!event.location || !customer.phone || !order.items?.length) {
          throw new Error('Invalid order data')
        }

        setOrderDetails({
          ...order,
          customerInfo: customer,
          pickupLocation: event.location,
          pickupTime: customer.classTime || event.time
        })
      } catch (error) {
        console.error('Validation error:', error)
        router.push('/order')
      }
    }

    validateStoredData()
  }, [router])

  // Log render
  console.log('Rendering with orderDetails:', !!orderDetails)

  /**
   * Configure Stripe Elements options
   * These options are used by the Elements provider
   * and passed down to ExpressCheckout
   */
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: orderDetails ? Math.round(orderDetails.total * 100) : 0,
    currency: 'usd',
    appearance: STRIPE_APPEARANCE, // Imported from @/lib/api/stripe
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pt-32 space-y-6">
      <h1 className="font-recoleta text-3xl mb-6">Checkout</h1>
      
      {orderDetails && (
        <>
          <OrderSummary orderDetails={orderDetails} />
          
          <PickupDetails
            location={{
              name: orderDetails.pickupLocation || '',
              address: '', // Add these to OrderDetails if needed
              city: '',
              zip: ''
            }}
            pickupTime={orderDetails.pickupTime || ''}
          />
          
          {/* 
            Elements provider wraps ExpressCheckout
            - Provides stripe instance and elements context
            - Configures payment flow with mode, amount, currency
          */}
          <Elements stripe={stripePromise} options={options}>
            <ExpressCheckout 
              orderDetails={orderDetails}
              onError={setError}
            />
          </Elements>
        </>
      )}
      
      {/* Error and loading states */}
      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}

export default function Checkout() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong loading checkout</div>}
      onError={(error) => console.error('Checkout error:', error)}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </ErrorBoundary>
  )
}
